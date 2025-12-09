import { IsDate, IsOptional } from 'class-validator';

export class GetAppointmentDto {
  @IsDate()
  @IsOptional()
  date?: Date;
}
