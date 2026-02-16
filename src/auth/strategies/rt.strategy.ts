import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from "passport-jwt";

type JWTPayload = {
    sub: string;
    email:string;
}

interface JWTPayloadWithRt extends JWTPayload{
    refreshToken: string;
}

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy,'jwt-rt'){

    constructor(private readonly configService:ConfigService){
        const options: StrategyOptionsWithRequest = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extracts rt token from Authorization: Bearer {{customerRefreshToken}}
            secretOrKey: configService.getOrThrow<string>('JWT_RT_SECRET'),
            passReqToCallback: true, // to get access to the request object( Authorization: Bearer {{customerRefreshToken}} ) in the validate method
        }
        super(options)
    }

    validate(req:Request, payload:JWTPayload): JWTPayloadWithRt {
        const authHeader = req.get('Authorization'); // get the full Authorization header Authorization: Bearer {{customerRefreshToken}}

        if(!authHeader){
            throw new UnauthorizedException('no refresh token provided');
        }

        const refreshToken = authHeader.replace('Bearer','').trim(); // remove 'Bearer ' from the string to get the actual token
        if(!refreshToken){
            throw new UnauthorizedException('invalid refresh token');
        }

        return{
            ...payload,
            refreshToken
        }
    }
}