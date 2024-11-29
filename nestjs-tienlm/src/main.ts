import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = +configService.get<number>('PORT');
  const options = new DocumentBuilder()
    .setTitle('Covid Tracker')
    .setDescription('The Covid Tracker API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', in: 'header' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  app.enableCors({
    origin: [
      configService.get<string>('CLIENT_BASE_URL'),
      'http://localhost:3001',
    ],
  });
  await app.listen(PORT);
}
bootstrap();
