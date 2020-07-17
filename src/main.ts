import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { HttpExceptionFilter } from '@/shared/filters/http-exception.filter';
import { AppModule } from '@/app.module';
import { swagger, documentBuilder } from '@/app.config';

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
    .setTitle(documentBuilder.title)
    .setDescription(documentBuilder.description)
    .setVersion(documentBuilder.version)
    .addBearerAuth({ type: 'apiKey', in: 'header', name: 'Authorization' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, swagger);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
