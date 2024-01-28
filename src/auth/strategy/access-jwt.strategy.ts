import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadType } from '../types/jwt-payload.type';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    const secret = config.get('ACCESS_JWT_SECRET');
    super({
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayloadType) {
    // overrides the default "validate"
    // payload: {
    //   sub:'',
    //   email:'',
    //   iat: '',
    //   expireAt:''
    // }
    const { id, email } = payload;
    return { id, email }; // same as req.user = {id, email} in EXPRESS.js
  }
}
