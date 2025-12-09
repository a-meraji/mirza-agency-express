import { IsDate, IsString } from 'class-validator';

export class BookAppointmentDto {
  @IsDate()
  date: Date;

  @IsString({ each: true })
  services: string[];

  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  description: string;
}
