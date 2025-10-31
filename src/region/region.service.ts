// src/region/region.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class RegionService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getAllRegions() {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.from('region').select('*');

    if (error) throw new BadRequestException(error.message);

    return data;
  }
}
