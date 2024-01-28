import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';
import { Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private usersService: UsersService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async hashData(data: string): Promise<string> {
    return await argon.hash(data);
  }

  async signUp(data: CreateUserDto): Promise<Tokens> {
    const user = await this.usersService.create(data);
    const tokens = await this.signTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signIn(data: SigninUserDto): Promise<Tokens> {
    const { email, password } = data;
    try {
      const user = await this.usersService.findByEmail(email);
      const pwMatches = await argon.verify(user.password, password);
      if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

      const tokens = await this.signTokens(user.id, email);
      await this.updateRtHash(user.id, tokens.refresh_token);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Credentials incorrect');
    }
  }

  async signOut(userId: string): Promise<void> {
    await this.usersService.updateRtHash(userId);
  }

  async refreshTokens(email: string, rt: string): Promise<Tokens> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user || !user.hashedRt)
        throw new ForbiddenException('Access Denied');

      const rtMatches = await argon.verify(user.hashedRt, rt);
      if (!rtMatches) throw new ForbiddenException('Access Denied');

      const tokens = await this.signTokens(user.id, email);

      await this.updateRtHash(user.id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      throw new Error(error);
    }
  }

  async signTokens(id: string, email: string): Promise<Tokens> {
    const payload = {
      id,
      email,
    };

    // expiresIn: 60, "2 days", "10h", "7d". A numeric value is interpreted as a seconds count.
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: this.config.get('ACCESS_JWT_EXPIRES_IN'),
        secret: this.config.get('ACCESS_JWT_SECRET'),
      }),
      this.jwt.signAsync(payload, {
        expiresIn: this.config.get('REFRESH_JWT_EXPIRES_IN'),
        secret: this.config.get('REFRESH_JWT_SECRET'),
      }),
    ]);
    return { access_token: at, refresh_token: rt };
  }

  async updateRtHash(userId: string, refreshToken: string): Promise<void> {
    const hash = await this.hashData(refreshToken);
    await this.usersService.updateRtHash(userId, hash);
  }
}
