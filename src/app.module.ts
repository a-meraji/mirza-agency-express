import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from './models/appointment.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mirza'),
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
