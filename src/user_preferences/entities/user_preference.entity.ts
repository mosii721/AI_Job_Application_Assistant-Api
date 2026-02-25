import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";


export enum ExperienceLevel {
    ENTRY = 'entry',
    JUNIOR = 'junior',
    MID = 'mid',
    SENIOR = 'senior',
    LEAD = 'lead',
    EXECUTIVE = 'executive',
}

export enum JobType {
    FULL_TIME = 'full_time',
    PART_TIME = 'part_time',
    CONTRACT = 'contract',
    INTERNSHIP = 'internship',
}

@Entity()
export class UserPreference {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column('jsonb')
    preferredRoles: string[];

    @Column('jsonb')
    industries: string[];

    @Column({type:'enum', enum: ExperienceLevel})
    experienceLevel: ExperienceLevel;

    @Column('jsonb')
    locationPreference: string[];

    @Column('jsonb')
    jobType: JobType[];

    @Column({ nullable: true, type: 'float' })
    salaryMin: number;

    @Column({ nullable: true, type: 'float' })
    salaryMax: number;

    @Column({nullable: true})
    salaryCurrency: string;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP',onUpdate:'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @OneToOne(() => User, user => user.preferences)
    @JoinColumn({ name: 'userId' })
    user: Relation<User>;
}
