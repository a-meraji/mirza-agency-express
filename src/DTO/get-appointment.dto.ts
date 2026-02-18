import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GetAppointmentDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  date?: Date;
}
