import { ArgumentsHost, Catch, HttpException, HttpStatus } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import { Request, Response } from "express";


interface MyResponseObj {
    statusCode: number,
    timestamp: string,
    path: string,
    response: string | object,
}

@Catch()
export class AllExceptionFilters extends BaseExceptionFilter{
    private getClientIp(request:Request) {
        const forwardedFor = request.headers['x-forwarded-for']

        if(forwardedFor) {
            return Array.isArray(forwardedFor)
                ? forwardedFor[0]
                : forwardedFor.split(',')[0].trim()
        }

        return request.ip || 'Unknown'
    }

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const request = ctx.getRequest<Request>()
        const response = ctx.getResponse<Response>()
        const clientIp = this.getClientIp(request)

        const myResponseObj: MyResponseObj = {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toISOString(),
            path: request.url,
            response: '',
        }

        if(exception instanceof HttpException) {
            myResponseObj.statusCode = exception.getStatus()
            myResponseObj.response = exception.getResponse()
        } else if(exception instanceof Error) {
            myResponseObj.response = exception.message
        } else{
            myResponseObj.response = 'Internal Server Error'
        }

        response.status(myResponseObj.statusCode).json(myResponseObj)

        const logMessage = typeof myResponseObj.response === 'string'
                                ? myResponseObj.response
                                : JSON.stringify(myResponseObj.response)

        const fullLog = `[ERROR] ${myResponseObj.timestamp} | Client Ip ${clientIp} | Path ${request.url} | Message ${logMessage}`
        console.error(fullLog)

        if(exception instanceof Error) {
            console.error('Stack trace', exception.stack)
        }
    }
}