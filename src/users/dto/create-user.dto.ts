import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Role } from "../entities/user.entity";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    password:string;

    @IsString()
    @IsNotEmpty()
    phone:string;

    @IsBoolean()
    active:boolean = true;

    @IsString()
    @IsOptional()
    profile_photo?:string;

    @IsEnum(Role)
    role: Role=Role.USER
}
