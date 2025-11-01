import { Module } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SocialConnectionController } from './social-connection.controller';
import { SocialConnectionService } from './social-connection.service';
@Module({
  controllers: [SocialConnectionController],
  providers: [SocialConnectionService, SupabaseService],
})
export class SocialConnectionModule {}
