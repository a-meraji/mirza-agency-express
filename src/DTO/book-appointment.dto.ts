import { IsDate, IsOptional, IsString } from 'class-validator';

export class BookAppointmentDto {
  @IsDate()
  date: Date;

  @IsString()
  name: string;

  @IsString({ each: true })
  services: string[];

  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  description?: string;
}
