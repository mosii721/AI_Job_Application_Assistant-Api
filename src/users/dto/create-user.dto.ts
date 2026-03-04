import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Role } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ description: 'Full name of the user' })
    @IsString()
    @IsNotEmpty()
    name:string;

    @ApiProperty({ description: 'Email address of the user' })
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @ApiProperty({ description: 'Password for the user account' })
    @IsString()
    @IsNotEmpty()
    password:string;

    @ApiProperty({ description: 'Phone number of the user' })
    @IsString()
    @IsNotEmpty()
    phone:string;

    @ApiProperty({ description: 'Whether the user account is active or not (default: true)' })
    @IsBoolean()
    active:boolean = true;

    @ApiProperty({ description: 'URL of the user\'s profile photo (optional)' })
    @IsString()
    @IsOptional()
    profile_photo?:string;

    @ApiProperty({ description: 'Role of the user (e.g. USER, ADMIN, etc.)' })
    @IsEnum(Role)
    role: Role=Role.USER
}
