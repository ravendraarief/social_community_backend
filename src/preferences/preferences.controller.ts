import { Controller, Get, Param } from '@nestjs/common';
import { PreferencesService } from './preferences.service';

@Controller('preferences')
export class PreferencesController { // pastikan huruf besar kecil sesuai
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  async getAllPreferences() {
    return await this.preferencesService.getAllPreferences();
  }

  @Get(':role_id')
  async getPreferencesByRole(@Param('role_id') role_id: string) {
    return await this.preferencesService.getPreferencesByRole(role_id);
  }
}
