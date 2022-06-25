import { Module } from '@nestjs/common';
import { ReportProposalController } from './report-proposal.controller';
import { ReportProposalService } from './report-proposal.service';

@Module({
  controllers: [ReportProposalController],
  providers: [ReportProposalService]
})
export class ReportProposalModule {}
