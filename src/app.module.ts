import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { RegionModule } from './region/region.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 🔥 penting
    }),
    SupabaseModule,
    AuthModule,
    RegionModule,
    RolesModule
  ],
})
export class AppModule {}
