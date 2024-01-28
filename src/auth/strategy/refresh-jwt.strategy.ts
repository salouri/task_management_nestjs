import { Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayloadType } from '../types/jwt-payload.type';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private config: ConfigService) {
    const secret = config.get('REFRESH_JWT_SECRET');
    super({
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  } // constructor

  async validate(req: Request, payload: JwtPayloadType) {
    const refreshToken =
      req.headers?.authorization.replace('Bearer', '').trim() || '';
    const { id, email } = payload;
    return { id, email, refreshToken }; // same as req.user = {id, email} in EXPRESS.js
  }
}
