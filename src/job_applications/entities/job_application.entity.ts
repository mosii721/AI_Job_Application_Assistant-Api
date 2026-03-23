import { ApplicationDocument } from "src/application_documents/entities/application_document.entity";
import { ApplicationTimeline } from "src/application_timelines/entities/application_timeline.entity";
import { ApplicationVersion } from "src/application_versions/entities/application_version.entity";
import { Job } from "src/jobs/entities/job.entity";
import { SuggestionFeedback } from "src/suggestion_feedbacks/entities/suggestion_feedback.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";

export enum Tone {
    PROFESSIONAL = 'professional',
    ENTHUSIASTIC = 'enthusiastic',
    TECHNICAL = 'technical'
}

export enum CoverLetterLength {
    SHORT = 'short',
    MEDIUM = 'medium',
    LONG = 'long'
}

export enum ApplicationStatus {
    DRAFT = 'draft',
    READY_TO_APPLY = 'ready_to_apply',
    APPLIED = 'applied',
    INTERVIEW = 'interview',
    OFFER = 'offer',
    REJECTED = 'rejected',
    EXPIRED = 'expired'
}

@Entity()
export class JobApplication {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    jobId: string;

    @Column()
    userId: string;

    @Column('int')
    profileVersionUsed: number;

    @Column('float')
    overallMatchScore: number;

    @Column('float')
    skillScore: number;

    @Column('float')
    experienceScore: number;

    @Column('float')
    educationScore: number;

    @Column('jsonb')
    matchAnalysisJson: Record<string, any>;

    @Column('jsonb')
    tailoredResumeJson: {
        summary?: string;
        skills?: {
            name: string;
            category?: string | null;
            proficiency?: string | null;
            years?: number | null;
        }[];
        experience?: {
            company: string;
            role: string;
            start_date?: string;
            end_date?: string;
            is_current?: boolean;
            industry?: string;
            location?: string;
            employment_type?: string;
            bullets?: string[];
            duration_months?: number;
            duration_estimated?: boolean;
        }[];
        education?: {
            institution: string;
            degree: string;
            field?: string;
            graduation_year?: number;
            graduation_year_estimated?: boolean;
            grade?: string;
            relevant_coursework?: string[];
        }[];
        certifications?: {
            name: string;
            issuer?: string;
            year_obtained?: number;
            expiry_year?: number;
            credential_id?: string;
            credential_url?: string;
        }[];
        projects?: {
            name: string;
            description?: string;
            role?: string;
            organization?: string;
            tech_stack?: string[];
            outcomes?: string[];
            url?: string;
            year?: number;
        }[];
        languages?: {
            language: string;
            proficiency?: string;
        }[];
        personal?: any;
        extracted_metadata?: any;

    };

    @Column({type:'text', nullable: true})
    coverLetterCurrent?: string;

    @Column('jsonb',{nullable: true})
    coverLetterPreferencesJson?: {
        tone: Tone;
        length: CoverLetterLength;
        emphasize: string[];
    };

    @Column({nullable: true})
    emailSubject?: string;

    @Column({type:'text', nullable: true})
    emailBody?: string;

    @Column({nullable: true})
    resumeFileUrl?: string;

    @Column({nullable: true})
    mergedPackageUrl?: string;

    @Column({type:'enum', enum: ApplicationStatus})
    status: ApplicationStatus;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP',onUpdate:'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.applications)
    @JoinColumn({ name: 'userId' })
    user: Relation<User>;

    @ManyToOne(() => Job, (job) => job.applications)
    @JoinColumn({ name: 'jobId' })
    job: Relation<Job>;

    @OneToMany(() => ApplicationVersion, (version) => version.application)
    versions: ApplicationVersion[];

    @OneToMany(() => ApplicationTimeline, (timeline) => timeline.application)
    timeline: ApplicationTimeline[];

    @OneToMany(() => ApplicationDocument, (appDoc) => appDoc.application)
    documents: ApplicationDocument[];

    @OneToMany(() => SuggestionFeedback, (feedback) => feedback.application)
    suggestionFeedbacks: SuggestionFeedback[];
}
