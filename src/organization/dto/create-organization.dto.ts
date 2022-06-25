import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateReportProposalDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  website: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  policy: string;

  @IsNotEmpty()
  image: string;
}
