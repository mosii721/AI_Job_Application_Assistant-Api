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

    @Column('text')
    raw_description: string; // plain scraped text, always a string

    @Column('jsonb')
    structured_job_json: {
        title: string;
        company: string;
        location: string;
        seniority: Seniority;
        mode: WorkMode;
        job_type: JobType;
        required_skills: string[];
        responsibilities: string[];
        application_method: ApplicationMethod;
        application_email?: string;
        deadline?: string;
        required_experience_years?: number;
    }; // AI-structured version of raw_description

    @Column({ type: 'jsonb', nullable: true })
    job_embedding: Record<string, number[]>;

    @Column()
    source_url: string;

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
