import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private config: ConfigService,
  ) {
    super({
      secretOrKey: config.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any) {
    // overrides the default "validate"
    const user = await this.usersRepo.findOne({
      where: { email: payload.email },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
