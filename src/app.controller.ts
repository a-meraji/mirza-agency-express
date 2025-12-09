import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateAppointmentDto } from './DTO/create-appointment.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-appointments')
  async createAppointments(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appService.createAppointments(createAppointmentDto);
  }
}
