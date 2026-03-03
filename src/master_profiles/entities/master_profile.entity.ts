import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

@Entity()
export class MasterProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column({type: 'int', default: 1})
    version_number: number;

    @Column('jsonb')
    structured_data_json: {
        summary?: string; 
        skills?: any[];
        personal?: any;
        certfications?: any;
        extracted_metadata?: any; 
        experience?: {
            company: string; 
            job_title: string; 
            start_date: string; 
            end_date?: string; 
            description: string;
        }[];
        education?: { 
            institution: string; 
            degree: string; 
            start_date: string; 
            end_date?: string;
        }[]};

    @Column('jsonb', { nullable: true })
    resume_embedding: Record<string, number[]>;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP',onUpdate:'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @OneToOne(() => User, user => user.masterProfile)
    @JoinColumn({ name: 'userId' })
    user: Relation<User>;
}
