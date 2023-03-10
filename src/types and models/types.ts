import { ObjectId } from 'mongodb';
import {
  BlogViewModel,
  CommentViewModel,
  PostViewModel,
  UserViewModel,
} from './models';
import mongoose from 'mongoose';

// types
export type PaginationType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items:
    | BlogViewModel[]
    | PostViewModel[]
    | UserViewModel[]
    | CommentViewModel[]
    | DeviceType[];
};
export type ErrorType = {
  errorsMessages: [{ message: string; field: string }];
};
export type TokenType = {
  accessToken: string;
  refreshToken: string;
};
export type TokenBlackListType = {
  refreshToken: string;
};
export type JWTPayloadType = {
  userId: string;
  deviceId: string;
  iat: number;
};
export type AttemptsType = {
  ip: string;
  url: string;
  attemptsTime: string;
};

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}
// classes
export class BlogDBType {
  constructor(
    public _id: ObjectId,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public isMembership: boolean,
  ) {}
}
export class PostDBType {
  constructor(
    public _id: ObjectId,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
    public extendedLikesInfo: ExtendedLikesInfoType,
  ) {}
}
export class UserDBType {
  constructor(
    public _id: ObjectId,
    public accountData: AccountDataType,
    public emailConfirmation: EmailConfirmationType,
    public passwordRecovery: PasswordRecoveryType,
    public passwordSalt?: string,
  ) {}
}
export class CommentDBType {
  constructor(
    public _id: ObjectId,
    public content: string,
    public commentatorInfo: CommentatorInfoType,
    public createdAt: string,
    public postId: string,
    public likesInfo: LikesInfoType,
  ) {}
}
export class AccountDataType {
  constructor(
    public login: string,
    public email: string,
    public passwordHash: string,
    public createdAt: string,
  ) {}
}
export class EmailConfirmationType {
  constructor(
    public confirmationCode: string,
    public expirationDate: Date,
    public isConfirmed: boolean,
  ) {}
}
export class LikesInfoType {
  constructor(
    public likesCount: number = 0,
    public dislikesCount: number = 0,
    public myStatus: LikeStatus = LikeStatus.None,
  ) {}
}
export class NewestLikesType {
  constructor(
    public addedAt: string,
    public userId: string,
    public login: string,
  ) {}
}
export class ExtendedLikesInfoType {
  constructor(
    public likesCount: number = 0,
    public dislikesCount: number = 0,
    public myStatus: LikeStatus = LikeStatus.None,
    public newestLikes: NewestLikesType[],
  ) {}
}
export class LikeDbType {
  constructor(
    public parentId: mongoose.Types.ObjectId,
    public userId: mongoose.Types.ObjectId,
    public userLogin: string,
    public status: LikeStatus,
    public addedAt: string,
  ) {}
}
export class PasswordRecoveryType {
  constructor(
    public recoveryCode: string | null,
    public isConfirmed: boolean,
  ) {}
}
export class DeviceType {
  constructor(
    public ip: string,
    public title: string,
    public lastActiveDate: string,
    public deviceId: string,
    public userId: string,
  ) {}
}
export class CommentatorInfoType {
  constructor(public userId: ObjectId, public userLogin: string) {}
}
export class BearerJwtPayloadType {
  iat: number;
  exp: number;
  userId: string;
}
