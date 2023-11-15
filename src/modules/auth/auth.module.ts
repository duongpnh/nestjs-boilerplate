import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@config/config.service';
import { SharedModule } from '@shared/shared.module';

import { UserEntity } from '@users/user.entity';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [SharedModule],
      useFactory: (configService: ConfigService): Promise<JwtModuleOptions> | JwtModuleOptions => {
        const { key, expirationTime } = configService.jwtConfig;

        return {
          secret: key,
          signOptions: {
            expiresIn: expirationTime,
          },
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
