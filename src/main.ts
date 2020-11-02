import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as session from 'express-session'

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  // app.useGlobalInterceptors(new TransformInterceptor());
  app.use(helmet());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.use(cookieParser('secret'));
  app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'secret',
    cookie: {
      httpOnly: false,
      secure: false,
    },
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  await app.listen(+process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
