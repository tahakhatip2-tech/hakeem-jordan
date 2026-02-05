import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { PatientAuthGuard } from './patient-auth.guard';
import { PatientAppointmentController } from './patient-appointment.controller';
import { PatientAppointmentService } from './patient-appointment.service';
import { PatientNotificationController } from './patient-notification.controller';
import { PatientNotificationService } from './patient-notification.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'super-secret-key-hakeem-jordan-2026',
            signOptions: { expiresIn: '30d' },
        }),
    ],
    controllers: [PatientController, PatientAppointmentController, PatientNotificationController],
    providers: [PatientService, PatientAppointmentService, PatientNotificationService, PatientAuthGuard],
    exports: [PatientService, PatientAppointmentService, PatientNotificationService],
})
export class PatientModule { }
