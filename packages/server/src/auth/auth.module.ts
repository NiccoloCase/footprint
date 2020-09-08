import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy, GoogleStrategy } from './auth.strategies';
import { AuthController } from './auth.controller';
import { TokenModule } from '../token/token.module';
import {
  IsUsernameAlreadyUsedConstraint,
  IsEmailAlreadyUsedConstraint,
} from '../shared/validation';

@Module({
  imports: [UsersModule, TokenModule],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    IsEmailAlreadyUsedConstraint,
    IsUsernameAlreadyUsedConstraint,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
