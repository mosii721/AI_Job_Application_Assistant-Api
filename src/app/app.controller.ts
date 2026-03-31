import { Controller, Get, Head } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('app')
@Controller()
export class AppController {

    @Public()
    @ApiQuery({ name: 'ping', required: false , description: 'Simple endpoint to check if the backend is running' })
    @Get('ping')
    @Head('ping')
    ping() {
        return 'Backend is running well';
    }
}