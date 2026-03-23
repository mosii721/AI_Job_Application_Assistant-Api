import { Exclude } from "class-transformer";
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
        skills?: {
            name: string;
            category: string | null;
            proficiency?: string | null;
            years?: number | null;
        }[];
        personal?: {
            name: string;
            email: string;
            phone?: string;
            nationality?: string;
            location?: string;
            linkedin?: string;
            github?: string;
            portfolio?: string;
            website?: string;
            photo_url?: string;
            created_at?: string;
            updated_at?: string;
        };
        certifications?: {
            name: string;
            issuer?: string;
            year_obtained?: number;
            expiry_year?: number;
            credential_id?: string;
            credential_url?: string;
        }[];
        experience?: {
            company: string;
            role: string;
            start_date: string;
            end_date?: string;
            is_current: boolean;
            industry?: string;
            location?: string;
            employment_type?: string;
            bullets?: string[];
            duration_months?: number;
            duration_estimated?: boolean;
        }[];
        education?: { 
            institution: string;
            degree?: string;
            field?: string;
            graduation_year?: number;
            graduation_year_estimated?: boolean;
            grade?: string;
            relevant_coursework?: string[];
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
        volunteer?: {
            organization: string;
            role: string;
            start_date?: string;
            end_date?: string;
            is_current?: boolean;
            bullets?: string[];
        }[];
        publications?: {
            title: string;
            publisher?: string;
            year?: number;
            co_authors?: string[];
            url?: string;
            doi?: string;
        }[];
        awards?: {
            title: string;
            issuer?: string;
            year?: number;
            description?: string;
        }[];
        references?: {
            name: string;
            title?: string;
            organization?: string;
            email?: string;
            phone?: string;
            po_box?: string;
            relationship?: string;
        }[];
        extracted_metadata?: {
            multi_candidate_detected: boolean;
            candidate_count_hint: number;
            fields_inferred: string[];
            ambiguous_fields: string[];
            warning?: string;
        };
        created_at?: string;
        updated_at?: string;
    };

    @Exclude()
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
