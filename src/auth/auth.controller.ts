import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SigninUserDto } from 'src/users/dto/signin-user.dto';
import { Tokens } from './types/tokens.type';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { RefreshPayloadType } from './types/refresh-payload.type';
import { RefreshJwtGuard } from './guards/rt.guard';
import { PublicApi } from './decorator/public-api.decorator';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @PublicApi()
  @Post('signup')
  async signUp(@Body() data: CreateUserDto): Promise<Tokens> {
    return await this.authService.signUp(data);
  }

  @PublicApi()
  @Post('signin')
  async signIn(@Body() data: SigninUserDto): Promise<Tokens> {
    return await this.authService.signIn(data);
  }

  // @UseGuards(AccessJwtGuard)
  @Post('signout')
  async signOut(@GetUser() user: User): Promise<void> {
    return await this.authService.signOut(user.id);
  }

  @PublicApi() // to bypass the global AuthGuard('jwt')
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshTokens(@GetUser() payload: RefreshPayloadType): Promise<Tokens> {
    const { email, refreshToken } = payload;
    return await this.authService.refreshTokens(email, refreshToken);
  }
}
