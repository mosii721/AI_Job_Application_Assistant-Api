import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";


@Injectable()
export class AtGuard extends AuthGuard('jwt-at'){
    constructor( private readonly reflector:Reflector){
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> { // to allow public routes to be accessed without authentication
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic',[
            context.getHandler(),
            context.getClass(),
        ]);

        if(isPublic){
            return true;
        }

        return super.canActivate(context) // if not public, proceed with the normal jwt authentication flow
    }
}