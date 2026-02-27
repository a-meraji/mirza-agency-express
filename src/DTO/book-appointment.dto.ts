import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class BookAppointmentDto {
  @Type(() => Date)
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
