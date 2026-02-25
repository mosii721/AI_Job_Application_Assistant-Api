import { JobApplication } from "src/job_applications/entities/job_application.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

export enum ContentType {
    COVER_LETTER = 'cover_letter',
    EMAIL = 'email',
    RESUME_BULLET = 'resume_bullet'
}

export enum CreatedBy {
    AI = 'ai',
    USER = 'user',
    AI_REFINEMENT = 'ai_refinement',
    REVERTED = 'reverted'
}

@Entity()
export class ApplicationVersion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    applicationId: string;

    @Column({type: 'enum', enum: ContentType })
    contentType: ContentType;

    @Column('text')
    contentData: string;

    @Column({type: 'enum', enum: CreatedBy })
    created_by: CreatedBy;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @ManyToOne(() => JobApplication, (application) => application.versions)
    @JoinColumn({ name: 'applicationId' })
    application: Relation<JobApplication>;

}
