import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema()
export class Appointment {
  @Prop()
  services: string[];

  @Prop()
  date: Date;

  @Prop()
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  description: string;

  @Prop()
  isBooked: boolean;

  @Prop()
  name: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
