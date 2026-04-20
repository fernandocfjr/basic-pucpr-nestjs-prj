import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthConfigModule } from './jwt-config.module';

@Module({
  imports: [UsersModule, JwtAuthConfigModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
