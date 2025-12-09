import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateAppointmentDto } from './DTO/create-appointment.dto';
import { BookAppointmentDto } from './DTO/book-appointment.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-appointments')
  async createAppointments(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appService.createAppointments(createAppointmentDto);
  }

  @Post('book-appointment')
  async bookAppointment(@Body() bookAppointmentDto: BookAppointmentDto) {
    return this.appService.bookAppointment(bookAppointmentDto);
  }
}
