import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @Type(() => Date)
  @IsDate({ each: true })
  dates: Date[];
}
