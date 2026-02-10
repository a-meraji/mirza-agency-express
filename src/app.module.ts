import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from './models/appointment.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://merajiamin1997:mica0CZ5kXamWwbN@cluster0.zplywlb.mongodb.net/?appName=Cluster0',
    ),
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
