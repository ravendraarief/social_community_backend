import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class RolesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllRoles() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('roles')
      .select('role_id, role_name')
      .order('role_name', { ascending: true });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }
}
