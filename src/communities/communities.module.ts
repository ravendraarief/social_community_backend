import { Module } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CommunitiesController } from './communities.controller';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  controllers: [CommunitiesController],
  providers: [CommunitiesService, SupabaseService],
})
export class CommunitiesModule {}
