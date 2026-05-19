import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule, // not necceessary since it is global in app.module but it is here for clarity
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule], // not necceessary since it is global in app.module but it is here for clarity
            useFactory: async (configService: ConfigService) => ({
                type: 'postgres',
                url: configService.getOrThrow<string>('DATABASE_URL'),
                ssl:{ rejectUnauthorized: false},
                autoLoadEntities: true,
                synchronize: configService.getOrThrow<string>('DB_SYNC') === 'true',
                logging: configService.getOrThrow<string>('DB_LOGGING') === 'true',
                migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
            }),
            inject: [ConfigService], // injecting ConfigService to use in useFactory
        }),
    ],
    providers: [],
})
export class DatabaseModule {}
