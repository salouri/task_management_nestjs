import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private usersService: UsersService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async signUp(data: CreateUserDto): Promise<{ id: string }> {
    return this.usersService.create(data);
  }

  async signIn(data: SigninUserDto): Promise<{ access_token: string }> {
    const { email, password } = data;
    try {
      const user = await this.usersService.findByEmail(email);
      const pwMatches = await argon.verify(user.password, password);
      if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

      const token = await this.singToken(user.id, email);
      return token;
    } catch (error) {
      throw new UnauthorizedException('Credentials incorrect');
    }
  }

  async singToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const expTimeMin = this.config.get('JWT_EXPIRES_IN');
    const jwtSecret = this.config.get('JWT_SECRET');

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: expTimeMin,
      secret: jwtSecret,
    });

    return {
      access_token,
    };
  }
}
