import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export type JWTPayload = { // define the shape of JWT payload or what you will get back once validated
    sub: string;
    email: string;
    role: string;
}

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy,'jwt-at'){

    constructor(private readonly configService:ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extract at token from Authorization: Bearer {{customeraccessToken}}
            secretOrKey: configService.getOrThrow<string>('JWT_AT_SECRET'),
        });
    }

    validate(payload:JWTPayload): JWTPayload {
        return payload;
    }
}