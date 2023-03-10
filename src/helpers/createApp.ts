import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../exeption.filter';

export const createApp = (app: INestApplication) => {
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors) => {
        const errorForResponse = [];

        errors.forEach((e) => {
          const constraintsKeys = Object.keys(e.constraints);
          constraintsKeys.forEach((key) => {
            errorForResponse.push({
              message: e.constraints[key],
              field: e.property,
            });
          });
        });
        throw new BadRequestException(errorForResponse);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  return app;
};
