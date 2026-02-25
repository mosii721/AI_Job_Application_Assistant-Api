import { JobApplication } from "src/job_applications/entities/job_application.entity";
import { UserDocument } from "src/user_documents/entities/user_document.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

@Entity()
export class ApplicationDocument {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    applicationId: string;

    @Column()
    documentId: string;

    @Column({ type: 'int' })
    displayOrder: number;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP',onUpdate:'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @ManyToOne(() => JobApplication, (application) => application.documents)
    @JoinColumn({ name: 'applicationId' })
    application: Relation<JobApplication>;

    @ManyToOne(() => UserDocument, (document) => document.applicationDocuments)
    @JoinColumn({ name: 'documentId' })
    document: Relation<UserDocument>;
}
