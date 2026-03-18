import { 
  Injectable, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDocument, DocumentType } from './entities/user_document.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { MasterProfilesService } from 'src/master_profiles/master_profiles.service';
import * as fs from 'fs';
import * as path from 'path';
import pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import { v2 as cloudinary } from 'cloudinary';



@Injectable()
export class UserDocumentsService {
  // upload directories
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly documentsDir = path.join(this.uploadDir, 'documents');
  private readonly photosDir = path.join(this.uploadDir, 'photos');

  constructor(
    @InjectRepository(UserDocument) 
    private readonly userDocumentRepository: Repository<UserDocument>,
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    private readonly masterProfilesService: MasterProfilesService,
  ) {
    // create upload folders if they don't exist
    this.ensureDirectoriesExist();
  }

  // create folders if they don't exist
  private ensureDirectoriesExist(): void {
    [this.uploadDir, this.documentsDir, this.photosDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // save file to local storage - private helper
  private async saveFile(file: Express.Multer.File, directory: string): Promise<string> {
    // create unique filename to avoid conflicts
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    const filePath = path.join(directory, uniqueName);
    
    // write file to disk
    await fs.promises.writeFile(filePath, file.buffer);
    
    // return relative url path for storing in database
    return `/uploads/${path.basename(directory)}/${uniqueName}`;
  }

  // delete file from local storage - private helper
  private deleteFile(fileUrl: string): void {
    const cleanedPath = fileUrl.replace(/^\//, '');
    const filePath = path.join(process.cwd(), cleanedPath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  // extract raw text from PDF or DOCX - private helper
  private async extractText(file: Express.Multer.File): Promise<string> {
    const extension = path.extname(file.originalname).toLowerCase();

    if (extension === '.pdf') {
      const pdfData = await pdfParse(file.buffer);
      return pdfData.text;
    }

    if (extension === '.docx') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value;
    }

    throw new BadRequestException('Only PDF and DOCX files are supported for resume upload');
  }

  // basic pre-parsing using regex - private helper
  // backend does this before sending to AI
  private preParse(rawText: string, user: User) {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(\+?254|0)[0-9]{9}/; // kenyan phone number format

    // common skills to look for
    const commonSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'React', 'Node.js',
      'NestJS', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Git',
      'HTML', 'CSS', 'REST', 'GraphQL', 'Redis', 'Kubernetes',
    ];

    const foundSkills = commonSkills.filter(skill =>
      rawText.toLowerCase().includes(skill.toLowerCase())
    );

    return {
      name: user.name, // use name from user account
      email: rawText.match(emailRegex)?.[0] ?? user.email,
      phone: rawText.match(phoneRegex)?.[0] ?? undefined,
      found_skills: foundSkills,
      sections: {
        // basic section detection by looking for common headers
        experience: rawText.toLowerCase().includes('experience') ? 'found' : undefined,
        education: rawText.toLowerCase().includes('education') ? 'found' : undefined,
        skills: rawText.toLowerCase().includes('skills') ? 'found' : undefined,
      },
    };
  }

  // UPLOAD RESUME - POST /upload/resume
  // this is the main upload that triggers master profile creation
  async uploadResume(userId: string, file: Express.Multer.File) {

    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File too large (max 5MB)');
    }
    // 1. check user exists
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // 2. validate file type
    const extension = path.extname(file.originalname).toLowerCase();
    if (!['.pdf', '.docx'].includes(extension)) {
      throw new BadRequestException('Only PDF and DOCX files are supported');
    }

    // 3. extract raw text from file
    const rawText = await this.extractText(file);

    console.log('Extracted text length:', rawText.length);
    console.log('Extracted text preview:', rawText.substring(0, 200));

    if (!rawText || rawText.trim().length < 50) {
      throw new BadRequestException(
        'Could not extract text from this PDF. Please ensure your CV is a text-based PDF and not a scanned image, or try uploading as a DOCX file instead.'
      );
    }

    // 4. do basic pre-parsing before sending to AI
    const preParsed = this.preParse(rawText, user);

    // 5. save file to local storage
    const fileUrl = await this.saveFile(file, this.documentsDir);

    // 6. save document record to database
    const userDocument = this.userDocumentRepository.create({
      userId,
      name: `${user.name} Resume`,
      documentType: DocumentType.RESUME,
      fileUrl,
      pageCount: 1, // pdf-parse doesn't give page count easily, default to 1
      fileSizeKb: Math.round(file.size / 1024),
    });
    await this.userDocumentRepository.save(userDocument);

    // 7. call master profile service which calls AI and saves profile
    // this is the key step that triggers the whole AI flow
    const masterProfile = await this.masterProfilesService.createFromResumeUpload(
      userId,
      rawText,
      preParsed,
    );

    if(!masterProfile){
      throw new NotFoundException(`Master Profile not found`)
    }

    return {
      file_id: userDocument.id,
      file_url: fileUrl,
      master_profile_id: masterProfile.id,
      status: 'completed',
    };
  }

  // UPLOAD SUPPORTING DOCUMENT - POST /upload/document
  // certificates, IDs etc - no AI processing needed
  async uploadDocument(
    userId: string,
    file: Express.Multer.File,
    metadata: {
      type: DocumentType;
      name: string;
      certification_name?: string;
      issuing_org?: string;
      issue_date?: string;
      expiry_date?: string;
    }
  ) {

    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File too large (max 5MB)');
    }
    // 1. check user exists
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // 2. save file to local storage
    const fileUrl = await this.saveFile(file, this.documentsDir);

    // 3. save document record
    const userDocument = this.userDocumentRepository.create({
      userId,
      name: metadata.name,
      documentType: metadata.type,
      fileUrl,
      pageCount: 1,
      fileSizeKb: Math.round(file.size / 1024),
      certificateName: metadata.certification_name,
      issuingOrg: metadata.issuing_org,
      issueDate: metadata.issue_date,
      expiryDate: metadata.expiry_date,
    });

    return await this.userDocumentRepository.save(userDocument);
  }

  // UPLOAD PROFILE PHOTO - POST /upload/photo
  // saves photo and updates user photo_url directly
  async uploadPhoto(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File too large (max 5MB)');
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const extension = path.extname(file.originalname).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(extension)) {
      throw new BadRequestException('Only JPG and PNG images are supported');
    }

    // configure cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // delete old photo from cloudinary if exists
    if (user.profile_photo && user.profile_photo.includes('cloudinary')) {
      const publicId = user.profile_photo
        .split('/')
        .pop()
        ?.replace(/\.[^/.]+$/, '');
      if (publicId) {
        await cloudinary.uploader.destroy(`profile_photos/${publicId}`);
      }
    }

    // upload to cloudinary from buffer
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'profile_photos',
          public_id: `${userId}_${Date.now()}`,
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });

    const photoUrl = uploadResult.secure_url;

    // delete old local photo if exists
    if (user.profile_photo && !user.profile_photo.includes('cloudinary')) {
      this.deleteFile(user.profile_photo);
    }

    // save cloudinary url to user
    await this.userRepository.update(userId, { profile_photo: photoUrl });

    return { photo_url: photoUrl };
  }

  // GET ALL DOCUMENTS FOR USER - GET /documents/:userId
  async findByUser(userId: string, type?: DocumentType) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const where: any = { userId };
    if (type) where.documentType = type;

    return await this.userDocumentRepository.find({
      where,
      relations: ['applicationDocuments'],
    });
  }

  // GET ALL - admin only
  async findAll() {
    return this.userDocumentRepository.find({
      relations: ['user', 'applicationDocuments'],
    });
  }

  // GET ONE
  async findOne(id: string) {
    const document = await this.userDocumentRepository.findOne({
      where: { id },
      relations: ['user', 'applicationDocuments'],
    });
    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    return document;
  }

  // DELETE DOCUMENT - DELETE /documents/:doc_id
  async remove(id: string) {
    const document = await this.findOne(id);
    
    // delete file from local storage too
    this.deleteFile(document.fileUrl);
    
    return await this.userDocumentRepository.delete(id);
  }
}