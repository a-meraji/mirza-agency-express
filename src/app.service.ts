import { Injectable } from '@nestjs/common';
import { Appointment, AppointmentDocument } from './models/appointment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from './DTO/create-appointment.dto';
import { BookAppointmentDto } from './DTO/book-appointment.dto';
import { GetAppointmentDto } from './DTO/get-appointment.dto';

@Injectable()
export class AppService {
  private readonly telegramBotToken =
    '7523098986:AAHT5Fhqux114HI3cdOxpfBx2O3yuZNURF4';
  private readonly telegramChatId = '621542051';

  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  private async sendTelegramMessage(message: string): Promise<void> {
    try {
      const url = `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`;
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.telegramChatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });
    } catch (error) {
      console.log('Error sending Telegram message:', error);
    }
  }

  async createAppointments(createAppointmentDto: CreateAppointmentDto) {
    try {
      // Delete appointments with dates before today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      await this.appointmentModel.deleteMany({ date: { $lt: today } });

      const appointments = createAppointmentDto.dates.map((date) => ({
        date,
        description: null,
        phoneNumber: null,
        email: null,
        name: null,
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
      const { date, services, email, phoneNumber, description, name } =
        bookAppointmentDto;
      const appointment = await this.appointmentModel.findOneAndUpdate(
        { date, isBooked: false },
        {
          $set: {
            email,
            phoneNumber,
            description,
            services,
            name,
            isBooked: true,
          },
        },
        { new: true },
      );

      if (!appointment) {
        return {
          status: 404,
          message: 'appointment not found',
          data: null,
        };
      }

      // Send Telegram notification
      const appointmentDateTime = new Date(appointment.date);
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      const formattedDate = appointmentDateTime.toLocaleDateString(
        'en-US',
        dateOptions,
      );
      const formattedTime = appointmentDateTime.toLocaleTimeString(
        'en-US',
        timeOptions,
      );

      const telegramMessage = `🔔 New Booking Received! 🔔


👤 Client: ${name}
📧 Email: ${email}
📱 Phone: ${phoneNumber}

📅 Appointment: ${formattedDate}
⏰ Time: ${formattedTime}

✅ Services: ${services?.join(', ') || 'None'}

📝 Notes: ${description || 'None'}`;

      await this.sendTelegramMessage(telegramMessage);

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

  async getAppointments(getAppointmentDto: GetAppointmentDto) {
    try {
      const { date } = getAppointmentDto;
      if (date) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        const appointments = await this.appointmentModel.find(
          {
            date: { $gte: startDate, $lt: endDate },
          },
          {
            _id: 0,
            date: 1,
            name: 0,
            isBooked: 1,
            email: 0,
            phoneNumber: 0,
            description: 0,
            services: 0,
          },
        );
        return {
          status: 200,
          message: 'appointments fetched successfully',
          data: appointments,
        };
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const appointments = await this.appointmentModel
        .find(
          {
            date: { $gte: today, $lt: tomorrow },
          },
          {
            _id: 0,
            date: 1,
            name: 0,
            isBooked: 1,
            email: 0,
            phoneNumber: 0,
            description: 0,
            services: 0,
          },
        )
        .sort({ date: 1 });
      return {
        status: 200,
        message: 'appointments fetched successfully',
        data: appointments,
      };
    } catch (error) {
      console.log('an error occurs in getAppointments: ', error);
      return {
        status: 500,
        message: 'error occur while fetching appointments',
        data: null,
      };
    }
  }
}
