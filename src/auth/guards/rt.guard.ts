import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
export class RtGuard extends AuthGuard('jwt-rt'){
    constructor(private readonly reflector:Reflector){ // Reflector to access metadata set by decorators eg @Public
        super();
    }
}