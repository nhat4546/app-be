import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configDocument = new DocumentBuilder()
    .setTitle('Api Documentation')
    .setDescription('App API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, configDocument);
  SwaggerModule.setup('/api', app, document);

  const config = app.get(ConfigService);
  app.enableCors({
    origin: config.get('PUBLIC_URL'),
    credentials: true,
  });

  const port = +config.get('PORT') || 5000;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => {
    console.log('App listen port ' + port);
  });
}
bootstrap();
