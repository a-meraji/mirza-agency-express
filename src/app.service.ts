import { Injectable } from '@nestjs/common';
import { Appointment, AppointmentDocument } from './models/appointment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from './DTO/create-appointment.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async createAppointments(createAppointmentDto: CreateAppointmentDto) {
    try {
      const appointments = createAppointmentDto.date.map((date) => ({
        date,
        description: null,
        phoneNumber: null,
        email: null,
        services: [],
        isBooked: false,
      }));

      const createdAppointments =
        await this.appointmentModel.insertMany(appointments);

      return {
        status: 201,
        message: 'appointments created successfully',
        data: createdAppointments,
      };
    } catch (error) {
      console.log('an error occurs in createAppointments: ', error);
      return {
        status: 500,
        message: 'error occur while creating appointments',
        data: null,
      };
    }
  }
}
