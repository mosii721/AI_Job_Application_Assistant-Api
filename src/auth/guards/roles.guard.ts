import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Role, User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { ROLES_KEY } from "../decorators/role.decorator";
import { Request } from "express";
import { JWTPayload } from "../strategies";


interface UserRequest extends Request{
    user?: JWTPayload;
}


@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private readonly reflector:Reflector,
        @InjectRepository(User) private readonly userRepository:Repository<User>,
    ){}

    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,[ // get roles metadata set by @Roles decorator
            context.getHandler(), // method level or get roles from  router
            context.getClass(), // class level or controller
        ])
        if(!requiredRoles){ // if no roles are required, allow access
            return true;
        }

        const request = context.switchToHttp().getRequest<UserRequest>(); // get the request object 
        const user = request.user;

        if(!user){ // if no user in request, deny access
            return false;
        }

        const User = await this.userRepository.findOne({
            where:{id: user.sub},
            select:['id','role']
        })

        if(!User){
            return false;
        }

        return requiredRoles.some((role) => User.role == role) // check if user role matches any of the required roles
    }
}