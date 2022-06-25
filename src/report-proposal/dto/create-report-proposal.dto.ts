import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
import { Asset } from '../enums/asset.enum';
import { Severity } from '../enums/severity.enum';
import { Status } from '../enums/status.enum';

export class CreateReportProposalDto {
  @IsNotEmpty()
  asset: string;

  @IsNotEmpty()
  asset_type: Asset;

  @IsNotEmpty()
  issues: string[];

  @IsNotEmpty()
  severity: Severity;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  impact: string;

  @IsNotEmpty()
  status: Status;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  created_at: Date;
}
