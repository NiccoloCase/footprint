import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './auth.strategies';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule],
  providers: [AuthResolver, AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
