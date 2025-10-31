// src/region/region.module.ts
import { Module } from '@nestjs/common';
import { RegionService } from './region.service'; 
import { RegionController } from './region.controller'; 
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [SupabaseModule], // SupabaseService tersedia di sini
  controllers: [RegionController],
  providers: [RegionService],
  exports: [RegionService], // optional, kalau mau dipakai di module lain
})
export class RegionModule {}
