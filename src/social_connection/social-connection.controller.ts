import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { SocialConnectionService } from './social-connection.service';

@Controller('connections')
export class SocialConnectionController {
  constructor(private readonly socialConnectionService: SocialConnectionService) {}

  // Kirim permintaan pertemanan
  @Post('add')
  async sendFriendRequest(@Body() body: { userAId: string; userBId: string }) {
    return this.socialConnectionService.sendFriendRequest(body.userAId, body.userBId);
  }

  // Lihat semua koneksi
  @Get(':userId')
  async getConnections(@Param('userId') userId: string) {
    return this.socialConnectionService.getFriendList(userId);
  }

  // Update status koneksi (terima / blok)
  @Patch(':connectionId')
  async updateStatus(
    @Param('connectionId') connectionId: string,
    @Body() body: { status: 'accepted' | 'blocked' },
  ) {
    return this.socialConnectionService.updateConnectionStatus(connectionId, body.status);
  }

  // Hapus pertemanan
  @Delete(':connectionId')
  async removeConnection(@Param('connectionId') connectionId: string) {
    return this.socialConnectionService.removeConnection(connectionId);
  }
}
