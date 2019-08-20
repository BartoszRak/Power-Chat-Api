import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module';
import { ExceptionsFilter } from './filters/exceptions.filter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new ExceptionsFilter())
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }))
  await app.listen(3000);
}
bootstrap();
