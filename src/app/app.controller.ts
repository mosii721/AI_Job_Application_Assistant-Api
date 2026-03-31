import { Controller, Get, Head } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
    @ApiQuery({ name: 'ping', required: false , description: 'Simple endpoint to check if the backend is running' })
    @Get('ping')
    @Head('ping')
    ping() {
        return 'Backend is running well';
    }
}