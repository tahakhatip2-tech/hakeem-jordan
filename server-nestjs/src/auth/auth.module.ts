import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

import { SupabaseService } from '../storage/supabase.service';

@Module({
  // ...
  providers: [AuthService, JwtStrategy, SupabaseService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
