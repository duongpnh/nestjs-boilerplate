/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from '@decorators/public.decorator';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterDto } from './dto/register.dto';

@Resolver()
export class AuthResolver {
  constructor(private _authService: AuthService) {}

  @Public()
  @Mutation(() => RegisterResponseDto)
  register(@Args('payload') payload: RegisterDto): Promise<RegisterResponseDto> {
    return this._authService.register(payload);
  }

  @Public()
  @Public()
  @Mutation(() => RegisterResponseDto)
  login(@Args('payload') payload: LoginDto): Promise<RegisterResponseDto> {
    return this._authService.login(payload);
  }
}
