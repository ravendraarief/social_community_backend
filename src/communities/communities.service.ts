import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CommunitiesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // 🔹 Membuat community baru
  async createCommunity(
  userId: string,
  dto: { name: string; desc?: string; region_id?: string; preferences?: string[] }
) {
  const { name, desc, region_id, preferences } = dto;

  // 🔍 1️⃣ Cek apakah komunitas sudah ada
  const { data: existing } = await this.supabaseService.client
    .from('communities')
    .select('community_id')
    .eq('community_name', name)
    .maybeSingle();

  if (existing) {
    throw new Error('Community with this name already exists');
  }

  // 🏗️ 2️⃣ Insert ke table communities
  const { data: community, error: communityError } = await this.supabaseService.client
    .from('communities')
    .insert([{ community_name: name, com_desc: desc || null, region_id: region_id || null }])
    .select('*')
    .single();

  if (communityError) throw new Error(communityError.message);

  // 👑 3️⃣ Tambahkan user sebagai owner
  const { error: memberError } = await this.supabaseService.client
    .from('user_communities')
    .insert([{ user_id: userId, community_id: community.community_id, role: 'owner' }]);

  if (memberError) throw new Error(memberError.message);

  // 🎯 4️⃣ Tambahkan preferences jika ada
  if (preferences && preferences.length > 0) {
    const preferenceData = preferences.map((prefId) => ({
      community_id: community.community_id,
      preference_id: prefId,
    }));

    const { error: prefError } = await this.supabaseService.client
      .from('community_preferences')
      .insert(preferenceData);

    if (prefError) throw new Error(prefError.message);
  }

  return {
    message: 'Community created successfully',
    community,
  };
}


  // 🔹 Ambil daftar community
  async getAllCommunities() {
    const { data, error } = await this.supabaseService.client
      .from('communities')
      .select(`
        community_id,
        community_name,
        com_desc,
        region:region_id (region_id, country_name, city_name),
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  // 🔹 Ambil community milik user
  async getUserCommunities(userId: string) {
    const { data, error } = await this.supabaseService.client
      .from('user_communities')
      .select(`
        community:community_id (
          community_id,
          community_name,
          com_desc,
          created_at
        )
      `)
      .eq('user_id', userId);

    if (error) throw new Error(error.message);

    // Flatten hasil
    return data.map((item) => item.community);
  }
}
