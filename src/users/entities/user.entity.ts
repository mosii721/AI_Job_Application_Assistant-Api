import { JobApplication } from "src/job_applications/entities/job_application.entity";
import { MasterProfile } from "src/master_profiles/entities/master_profile.entity";
import { RecommendedJob } from "src/recommended_jobs/entities/recommended_job.entity";
import { SuggestionFeedback } from "src/suggestion_feedbacks/entities/suggestion_feedback.entity";
import { UserDocument } from "src/user_documents/entities/user_document.entity";
import { UserPreference } from "src/user_preferences/entities/user_preference.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

export enum Role{
    ADMIN = 'admin',
    USER = 'user'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @Column({ unique: true })
    email:string;

    @Column()
    password:string;

    @Column({type:'text', nullable:true,default:null})
    hashedRefreshToken:string | null;

    @Column()
    phone:string;

    @Column({type:'boolean', default: true })
    active:boolean;

    @Column({ nullable: true })
    profile_photo:string;

    @Column({type:'enum',enum:Role,default:Role.USER})
    role: Role;

    @Column({type:'varchar', nullable:true,default:null })
    otpCode:string | null;

    @Column({ type:'timestamptz', nullable:true,default:null})
    otpExpiry: Date | null;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP',onUpdate:'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @OneToOne(() => MasterProfile, masterProfile => masterProfile.user)
    masterProfile: Relation<MasterProfile>;

    @OneToOne(() => UserPreference, userPreferences => userPreferences.user)
    preferences: Relation<UserPreference>;

    @OneToMany(() => JobApplication, (application) => application.user)
    applications: JobApplication[];

    @OneToMany(() => UserDocument, (document) => document.user)
    documents: UserDocument[];

    @OneToMany(() => RecommendedJob, (recommendation) => recommendation.user)
    recommendations: RecommendedJob[];

    @OneToMany(() => SuggestionFeedback, (feedback) => feedback.user)
    suggestionFeedbacks: SuggestionFeedback[];

}
