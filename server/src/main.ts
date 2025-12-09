import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000;
  const PREFIX = process.env.SERVER_API_PREFIX ?? 'apiv1';
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(process.cwd(), 'static'), {
    prefix: '/static/',
  });

  app.setGlobalPrefix(PREFIX);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Бэкенд для СПНСР')
    .setTitle('Документация бэкенда')
    .setVersion('1.0.0')
    .addTag('Backend')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(`/${PREFIX}/docs`, app, document);

  await app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
  });
}
bootstrap();
