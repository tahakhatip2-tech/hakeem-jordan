import { Module, forwardRef } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { WhatsAppController } from './whatsapp.controller';
import { AiService } from './ai.service';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
  imports: [forwardRef(() => AppointmentsModule)],
  providers: [WhatsAppService, AiService],
  controllers: [WhatsAppController],
  exports: [WhatsAppService],
})
export class WhatsAppModule { }
