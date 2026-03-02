import { JobApplication } from "src/job_applications/entities/job_application.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

export enum SuggestionContentType {
    BULLET = 'bullet',
    SKILL = 'skill',
    COVER_LETTER = 'cover_letter',
    EMAIL = 'email',
}

export enum SuggestionAction {
    ACCEPT = 'accept',
    REJECT = 'reject',
    IGNORE = 'ignore',
}

@Entity()
export class SuggestionFeedback {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column({nullable: true})
    applicationId?: string;      // optional per API spec

    @Column({type: 'enum', enum: SuggestionContentType})
    contentType: SuggestionContentType;

    @Column({type: 'text',nullable: true})
    originalContent?: string;    // optional per API spec

    @Column({type: 'text',nullable: true})
    suggestedContent?: string;   // optional per API spec

    @Column({type: 'enum', enum: SuggestionAction})
    action: SuggestionAction;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.suggestionFeedbacks)
    @JoinColumn({ name: 'userId' })
    user: Relation<User>;

    @ManyToOne(() => JobApplication, (application) => application.suggestionFeedbacks, { nullable: true })
    @JoinColumn({ name: 'applicationId' })
    application: Relation<JobApplication>;
}
