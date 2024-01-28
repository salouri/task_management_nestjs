import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';
import { AccessJwtStrategy } from './strategy/access-jwt.strategy';
import { RefreshJwtStrategy } from './strategy/refresh-jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, AccessJwtStrategy, RefreshJwtStrategy],
  exports: [AccessJwtStrategy, PassportModule],
})
export class AuthModule {}
