import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersRepository } from './users/users.repository';
import { UsersService } from './users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailController } from './email/email.service';
import { EmailService } from './email/email.controller';
import { BlogsController } from './blogs/blog.controller';
import { BlogsRepository } from './blogs/blog.repository';
import { BlogsService } from './blogs/blog.service';
import { PostsService } from './posts/post.service';
import { PostsRepository } from './posts/post.repository';
import { PostsController } from './posts/post.controller';
import { CommentsService } from './comments/comment.service';
import { CommentsRepository } from './comments/comment.repository';
import { CommentsController } from './comments/comment.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { DevicesService } from './devices/device.service';
import { DevicesRepository } from './devices/device.repository';
import { AttemptsRepository } from './attempts/attempts.repository';
import { DevicesController } from './devices/device.controller';
import { LikesService } from './likes/like.service';
import { LikesRepository } from './likes/like.repository';
import { TokensRepository } from './tokens/tokens.repository';
import { JwtService } from './jwt/jwt.service';
import { AttemptsControlMiddleware } from './middlewares/attempt.middleware';
import { APP_GUARD } from '@nestjs/core';
import { DeviceMiddleware } from './middlewares/device.middleware';
import { InputValidationMiddleware } from './middlewares/input-validation.middleware';
import { QueryParamsMiddleware } from './middlewares/query-params-parsing.middleware';
//import { RateLimiterMiddleware } from './middlewares/rate-limiter.middleware';
import { RefreshTokenMiddleware } from './middlewares/refresh-token.middleware';
import {
  AttemptSchema,
  BlogSchema,
  CommentSchema,
  DeviceSchema,
  LikeSchema,
  PostSchema,
  TokenBlackListSchema,
  UserSchema,
} from './types and models/schemas';
import { TestingController } from './testing/testing.controller';
import { EmailAdapter } from './email/email.adapter';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import {
  IsEmailAlreadyConfirmedConstraint,
  IsEmailAlreadyExistConstraint,
  IsLoginAlreadyExistConstraint,
  isCodeAlreadyConfirmedConstraint,
  isBlogExistConstraint,
  isCommentExistConstraint,
} from './validator';
import {
  useContainer,
  Validator,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Container } from 'typedi';
import { BasicAuthStrategy } from './auth/guards/basic-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { settings } from './jwt/jwt.settings';
import { JwtStrategy } from './auth/guards/bearer-auth.guard';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://solikamsk:solikamsk@cluster0.uu9g6jj.mongodb.net/?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Blog', schema: BlogSchema },
      { name: 'Post', schema: PostSchema },
      { name: 'Comment', schema: CommentSchema },
      { name: 'Device', schema: DeviceSchema },
      { name: 'Like', schema: LikeSchema },
      { name: 'TokenBlackList', schema: TokenBlackListSchema },
      { name: 'Attempt', schema: AttemptSchema },
    ]),
    MongooseModule.forRoot('mongodb://localhost/nest'),
    ConfigModule.forRoot({}),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'bonjorim@gmail.com',
          pass: 'nronmxaommldkjpc',
        },
      },
    }),
    PassportModule,
    JwtModule.register({
      secret: settings.JWT_SECRET, // ?????????????????? ???????? ?????? ?????????????? ??????????????
      signOptions: { expiresIn: '7m' }, // ?????????? ?????????? ??????????????
    }),
  ],
  controllers: [
    TestingController,
    AppController,
    UsersController,
    EmailController,
    BlogsController,
    PostsController,
    CommentsController,
    AuthController,
    DevicesController,
  ],
  providers: [
    AppService,
    UsersService,
    UsersRepository,
    EmailService,
    EmailAdapter,
    BlogsService,
    BlogsRepository,
    PostsService,
    PostsRepository,
    CommentsService,
    CommentsRepository,
    AuthService,
    DevicesService,
    DevicesRepository,
    LikesService,
    LikesRepository,
    AttemptsRepository,
    TokensRepository,
    JwtService,
    IsEmailAlreadyExistConstraint,
    IsLoginAlreadyExistConstraint,
    IsEmailAlreadyConfirmedConstraint,
    isCodeAlreadyConfirmedConstraint,
    isBlogExistConstraint,
    isCommentExistConstraint,
    BasicAuthStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AttemptsControlMiddleware,
    },
    {
      provide: APP_GUARD,
      useClass: DeviceMiddleware,
    },
    {
      provide: APP_GUARD,
      useClass: InputValidationMiddleware,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: RateLimiterMiddleware,
    // },
    {
      provide: APP_GUARD,
      useClass: RefreshTokenMiddleware,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(QueryParamsMiddleware)
      .forRoutes('blogs', 'posts', 'comments', 'users');
  }
}

useContainer(Container);
