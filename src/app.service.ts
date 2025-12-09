import { Injectable } from '@nestjs/common';
import { Appointment, AppointmentDocument } from './models/appointment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from './DTO/create-appointment.dto';
import { BookAppointmentDto } from './DTO/book-appointment.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async createAppointments(createAppointmentDto: CreateAppointmentDto) {
    try {
      // Delete appointments with dates before today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await this.appointmentModel.deleteMany({ date: { $lt: today } });

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

  async bookAppointment(bookAppointmentDto: BookAppointmentDto) {
    try {
      const { date, services, email, phoneNumber, description } =
        bookAppointmentDto;
      const appointment = await this.appointmentModel.findOneAndUpdate(
        { date, isBooked: false },
        { $set: { email, phoneNumber, description, services, isBooked: true } },
        { new: true },
      );

      if (!appointment) {
        return {
          status: 404,
          message: 'appointment not found',
          data: null,
        };
      }

      return {
        status: 200,
        message: 'appointment booked successfully',
        data: appointment,
      };
    } catch (error) {
      console.log('an error occurs in bookAppointment: ', error);
      return {
        status: 500,
        message: 'error occur while booking appointment',
        data: null,
      };
    }
  }
}
