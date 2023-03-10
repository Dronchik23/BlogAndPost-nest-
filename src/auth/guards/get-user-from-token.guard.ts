import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { settings } from '../../jwt/jwt.settings';
import { UsersRepository } from '../../users/users.repository';
import { BearerJwtPayloadType } from '../../types and models/types';

@Injectable()
export class MyStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: settings.JWT_SECRET,
    });
  }
  async validate(payload: BearerJwtPayloadType) {
    const user = await this.usersRepository.findUserByUserId(payload.userId);
    return user.id;
  }
}
