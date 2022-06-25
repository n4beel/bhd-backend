import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { ReportProposalService } from './report-proposal.service';

@Controller('report')
export class ReportProposalController {
  constructor(private readonly reportProposalService: ReportProposalService) {}

  @Get('')
  async getReports(@Query('page') page: string, @Query('limit') limit: string) {
    try {
      const res = await this.reportProposalService.getReports(
        parseInt(page),
        parseInt(limit),
      );
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Post('/createReport')
  async createReport(@Req() req: any) {
    try {
      const res = await this.reportProposalService.createReport(req.body);
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Post('/updateReport')
  async updateReport(@Req() req: any) {
    try {
      const res = await this.reportProposalService.updateReport(req.body);
      return { result: res };
    } catch (error) {
      return error;
    }
  }

  @Post('/deleteReport')
  async deleteReport(@Body('id') id: string) {
    try {
      const res = await this.reportProposalService.deleteReport(id);
      return { result: res };
    } catch (error) {
      return error;
    }
  }
}
