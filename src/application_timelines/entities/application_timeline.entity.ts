import { JobApplication } from "src/job_applications/entities/job_application.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

export enum ApplicationStatus {
    DRAFT = 'draft',
    READY_TO_APPLY = 'ready_to_apply',
    APPLIED = 'applied',
    INTERVIEW = 'interview',
    OFFER = 'offer',
    REJECTED = 'rejected',
    EXPIRED = 'expired'
}

export enum EventType {
    STATUS_CHANGE = 'status_change',
    NOTE_ADDED = 'note_added',
    DOCUMENT_ADDED = 'document_added',
    COVER_LETTER_GENERATED = 'cover_letter_generated',
    EMAIL_GENERATED = 'email_generated',
    RESUME_DOWNLOADED = 'resume_downloaded'
}

@Entity()
export class ApplicationTimeline {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    applicationId: string;

    @Column({type: 'enum', enum: EventType })
    eventType: EventType;

    @Column({type: 'enum', enum: ApplicationStatus })
    previousStatus: ApplicationStatus;

    @Column({type: 'enum', enum: ApplicationStatus })
    newStatus: ApplicationStatus;

    @Column({type: 'text', nullable: true })
    notes?: string;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    eventDate: Date;

    @ManyToOne(() => JobApplication, (application) => application.timeline)
    @JoinColumn({ name: 'applicationId' })
    application: Relation<JobApplication>;

}
