import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { UsersModule } from './modules/users/users.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CustomHttpExceptionFilter } from './common/filters/custom-http-exception.filter';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvincesModule } from './modules/provinces/provinces.module';
import { DistrictsModule } from './modules/districts/districts.module';
import { WardsModule } from './modules/wards/wards.module';
import { ImportDataModule } from './modules/import-data/import-data.module';
import { ConsoleModule } from 'nestjs-console';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { AuthModule } from './modules/auth/auth.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { VaccinationSitesModule } from './modules/vaccination-sites/vaccination-sites.module';
import { VaccineRegistrationsModule } from './modules/vaccine-registrations/vaccine-registrations.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [join(__dirname, '../../.env')],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    AuthModule,
    UsersModule,
    ProvincesModule,
    DistrictsModule,
    WardsModule,
    ImportDataModule,
    ConsoleModule,
    VaccinationSitesModule,
    VaccineRegistrationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: CustomHttpExceptionFilter },
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    JwtStrategy,
  ],
})
export class AppModule {}
