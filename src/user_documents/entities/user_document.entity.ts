import { ApplicationDocument } from "src/application_documents/entities/application_document.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";


export enum DocumentType {
    RESUME = 'resume',
    KCPE = 'kcpe',
    KCSE = 'kcse',
    DEGREE = 'degree',
    TRANSCRIPT = 'transcript',
    NATIONAL_ID = 'national_id',
    KRA_PIN = 'kra_pin',
    CERTIFICATION = 'certification',
    REFERENCE_LETTER = 'reference_letter',
    OTHER = 'other',
}

@Entity()
export class UserDocument {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    name: string;

    @Column({type:'enum', enum: DocumentType})
    documentType: DocumentType;

    @Column()
    fileUrl: string;

    @Column('int')
    pageCount: number;

    @Column()
    fileSizeKb: number;

    @Column({nullable: true})
    certificateName?: string; // for certifications, optional for resumes

    @Column({nullable: true})
    issuingOrg?: string; // for certifications, optional for resumes

    @Column({type:'date', nullable: true})
    issueDate?: string; // for certifications, optional for resumes

    @Column({type:'date', nullable: true})
    expiryDate?: string;
    
    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    uploadedAt: Date;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP',onUpdate:'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.documents)
    @JoinColumn({ name: 'userId' })
    user: Relation<User>;

    @OneToMany(() => ApplicationDocument, (appDoc) => appDoc.document)
    applicationDocuments: ApplicationDocument[];
}
