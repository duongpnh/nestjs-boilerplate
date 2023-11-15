import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as compression from 'compression';
import * as ContextService from 'request-context';
import { ConfigService } from '@config/config.service';
import { setupSwagger } from '@config/swagger.config';
import { RequestExceptionFilter } from '@exceptions/request.exception';
import { UserEntity } from '@users/user.entity';

import { AppModule } from './app.module';
import { AuthGuard } from './guards/auth.guard';
import { GeneralLogger } from './logger/general.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new GeneralLogger(process.env.LOG_APP_NAME),
  });

  // CORS
  app.enableCors();
  app.use(ContextService.middleware('request'));
  // Compression can greatly decrease the size of the response body, thereby increasing the speed of a web app
  app.use(compression());
  // setup swagger
  setupSwagger(app);

  // add filter exception
  const reflector = app.get(Reflector);
  const configService = app.get<ConfigService>(ConfigService);
  const jwtService = app.get<JwtService>(JwtService);
  const userRepo = app.get(getRepositoryToken(UserEntity));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      dismissDefaultMessages: true,
      validationError: {
        target: false,
      },
    }),
  );
  app.useGlobalGuards(new AuthGuard(reflector, userRepo, configService, jwtService));
  app.useGlobalFilters(new RequestExceptionFilter(reflector));

  const { PORT } = process.env;

  await app.listen(PORT, () => console.log(`APP LISTENING ON PORT ${PORT}`));
}
bootstrap();
