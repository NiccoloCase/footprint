import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { keys } from '@footprint/config';
import { CustumValidationPipe } from './shared/validation';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  // Validazione
  app.useGlobalPipes(CustumValidationPipe);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  console.log(keys.server.PORT);
  await app.listen(keys.server.PORT);
}
bootstrap();
