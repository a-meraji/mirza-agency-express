import { IsDate } from 'class-validator';

export class CreateAppointmentDto {
  @IsDate({ each: true })
  dates: Date[];
}
