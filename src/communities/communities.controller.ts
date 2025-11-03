import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { CommunitiesService } from './communities.service';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  // 🔹 POST /communities/create
  @Post('create')
  async createCommunity(@Body() body: any) {
    const { userId, name, desc, region_id, preferences } = body;
    return this.communitiesService.createCommunity(userId, { name, desc, region_id, preferences });
  }

  // 🔹 GET /communities
  @Get()
  async getAllCommunities() {
    return this.communitiesService.getAllCommunities();
  }

  // 🔹 GET /communities/user/:userId
  @Get('user/:userId')
  async getUserCommunities(@Param('userId') userId: string) {
    return this.communitiesService.getUserCommunities(userId);
  }
}
