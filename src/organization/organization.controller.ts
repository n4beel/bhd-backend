import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post('/createOrganization')
  async createOrganization(@Req() req: any) {
    try {
      const res = await this.orgService.createOrganization(req.body);
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Post('/updateOrganization')
  async updateOrganization(@Req() req: any) {
    try {
      const res = await this.orgService.updateOrganization(req.body);
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Post('/deleteOrganization')
  async deleteOrganization(@Body('id') id: string) {
    try {
      const res = await this.orgService.deleteOrganization(id);
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Get('/getUserInvites')
  async getUserInvites(@Query('user') user: string) {
    try {
      const res = await this.orgService.getUserInvites(user);
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Post('/sendInvite')
  async sendInvite(@Req() req: any) {
    try {
      const res = await this.orgService.sendInvite(req.body);
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Post('/acceptInvite')
  async acceptInvite(@Req() req: any) {
    try {
      const res = await this.orgService.acceptInvite(req.body);
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Post('/rejectInvite')
  async rejectInvite(@Req() req: any) {
    try {
      const res = await this.orgService.rejectInvite(req.body);
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Post('/removeMember')
  async removeMember(@Req() req: any) {
    try {
      const res = await this.orgService.removeMember(req.body);
      return { result: res };
    } catch (error) {
      return error;
    }
  }
}
