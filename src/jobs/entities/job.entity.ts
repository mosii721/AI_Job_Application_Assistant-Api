import { Exclude } from "class-transformer";
import { JobApplication } from "src/job_applications/entities/job_application.entity";
import { RecommendedJob } from "src/recommended_jobs/entities/recommended_job.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum Seniority {
    INTERN = 'intern',
    JUNIOR = 'junior',
    MID = 'mid',
    SENIOR = 'senior',
    LEAD = 'lead',
    EXECUTIVE = 'executive'
}

export enum WorkMode {
    REMOTE = 'remote',
    ONSITE = 'onsite',
    HYBRID = 'hybrid'
}

export enum ApplicationMethod {
    EMAIL = 'email',
    PORTAL = 'portal',
    BOTH = 'both',
    UNKNOWN = 'unknown'
}

export enum JobType {
    FULL_TIME = 'full_time',
    PART_TIME = 'part_time',
    CONTRACT = 'contract',
    INTERNSHIP = 'internship',
    FREELANCE = 'freelance'
}

@Entity()
export class Job {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    company: string;

    @Column()
    location: string;

    @Exclude()
    @Column('text')
    raw_description: string; // plain scraped text, always a string

    @Column('jsonb')
    structured_job_json: {
        url?: string;
        title: string;
        company: string;
        location?: string;
        mode?: string;
        seniority?: string;
        employment_type?: string;
        industry?: string;
        salary?: {
            min?: number;
            max?: number;
            currency?: string;
            period?: string;
        };
        required_skills?: {
            skill: string;
            priority: string;
        }[];
        responsibilities?: string[];
        key_qualifications?: string[];
        requirements?: string[];
        required_experience_years?: number;
        application_method?: string;
        application_email?: string;
        application_url?: string;
        deadline?: string;
        about_company?: string;
        company_size?: string;
        company_values?: string[];
        why_join?: string;
        department?: string;
        reporting_to?: string;
        work_arrangement?: string;
        benefits?: string[];
        payment_schedule?: string;
        probation_period?: string;
        equal_opportunity?: boolean;
        visa_sponsorship?: boolean;
        relocation_support?: boolean;
        is_public?: boolean;
        created_at?: string;
    }; // AI-structured version of raw_description

    @Exclude()
    @Column({ type: 'jsonb', nullable: true })
    job_embedding: Record<string, number[]>;

    @Column()
    source_url: string;

    @Exclude()
    @Column({unique: true})
    url_hash: string;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP',onUpdate:'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @OneToMany(() => JobApplication, (application) => application.job)
    applications: JobApplication[];

    @OneToMany(() => RecommendedJob, (recommendation) => recommendation.job)
    recommendations: RecommendedJob[];
}
