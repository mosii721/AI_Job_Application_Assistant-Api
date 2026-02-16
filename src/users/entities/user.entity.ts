import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

}
