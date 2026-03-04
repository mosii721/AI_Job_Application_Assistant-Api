import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAuthDto {
    @ApiProperty({ description: 'Email address of the user' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ description: 'Password for the user account' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
