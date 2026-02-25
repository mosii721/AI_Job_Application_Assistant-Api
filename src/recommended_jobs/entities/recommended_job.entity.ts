import { Job } from "src/jobs/entities/job.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

@Entity()
export class RecommendedJob {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string

    @Column()
    jobId: string;

    @Column('float')             // your docs say scores are 0.0 - 1.0
    basicMatchScore: number;

    @Column({default:false})
    isProcessed: boolean;

    @Column({nullable:true})
    sourceApi: string;

    @Column({type:'timestamp', default:() => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.recommendations)
    @JoinColumn({ name: 'userId' })
    user: Relation<User>;

    @ManyToOne(() => Job, (job) => job.recommendations)
    @JoinColumn({ name: 'jobId' })
    job: Relation<Job>;
}
