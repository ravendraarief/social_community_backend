import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PreferencesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllPreferences() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('preferences')
      .select('preference_id, preference_name')
      .order('preference_name', { ascending: true });

    if (error) throw new InternalServerErrorException(error.message);

    return data;
  }

  async getPreferencesByRole(role_id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('role_preferences')
      .select(`
        preference_id,
        preferences:preference_id ( preference_name )
      `)
      .eq('role_id', role_id);

    if (error) throw new InternalServerErrorException(error.message);

    return data.map((item: any) => ({
      preference_id: item.preference_id,
      preference_name: item.preferences?.preference_name ?? 'Unknown',
    }));
  }
}
