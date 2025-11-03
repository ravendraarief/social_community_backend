import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { RegionModule } from './region/region.module';
import { RolesModule } from './roles/roles.module';
import { PreferencesModule } from './preferences/preferences.module';
import { SocialConnectionModule } from './social_connection/social-connection.module';
import { CommunitiesModule } from './communities/communities.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 🔥 penting
      envFilePath: '.env',
    }),
    SupabaseModule,
    AuthModule,
    RegionModule,
    RolesModule,
    PreferencesModule,
    SocialConnectionModule,
    CommunitiesModule
  ],
})
export class AppModule {}
