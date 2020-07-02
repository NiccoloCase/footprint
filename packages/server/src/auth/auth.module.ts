import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy, GoogleStrategy } from './auth.strategies';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule],
  providers: [AuthResolver, AuthService, JwtStrategy, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
