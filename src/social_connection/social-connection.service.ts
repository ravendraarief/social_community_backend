import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SocialConnectionService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // Kirim permintaan pertemanan
  async sendFriendRequest(userAId: string, userBId: string) {
    const { data, error } = await this.supabaseService.client
      .from('social_connection')
      .insert([{ user_a_id: userAId, user_b_id: userBId }])
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getFriendList(userId: string) {
  const { data, error } = await this.supabaseService.client
    .from('social_connection')
    .select(`
      connection_id,
      created_at,
      user_a:user_a_id (user_id, username, email),
      user_b:user_b_id (user_id, username, email)
    `)
    .eq('status', 'accepted')
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);

  if (error) throw new Error(error.message);

  const friends = data.map((connection) => {
    // Ambil data user_a / user_b dari array (karena Supabase bisa return array)
    const userA = Array.isArray(connection.user_a)
      ? connection.user_a[0]
      : connection.user_a;
    const userB = Array.isArray(connection.user_b)
      ? connection.user_b[0]
      : connection.user_b;

    if (userA.user_id === userId) {
      return userB;
    } else {
      return userA;
    }
  });

  return friends;
}


  

  // Terima atau tolak permintaan
  async updateConnectionStatus(connectionId: string, status: 'accepted' | 'blocked') {
    const { data, error } = await this.supabaseService.client
      .from('social_connection')
      .update({ status })
      .eq('connection_id', connectionId)
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // Hapus koneksi (unfriend)
  async removeConnection(connectionId: string) {
    const { error } = await this.supabaseService.client
      .from('social_connection')
      .delete()
      .eq('connection_id', connectionId);

    if (error) throw new Error(error.message);
    return { message: 'Connection removed successfully' };
  }
}
