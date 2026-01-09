import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, UseGuards, Request, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Get()
    findAll(@Request() req, @Query() query: any) {
        return this.appointmentsService.findAll(req.user.id, query);
    }

    @Get('today')
    getToday(@Request() req) {
        return this.appointmentsService.getToday(req.user.id);
    }

    @Get('stats')
    getStats(@Request() req) {
        return this.appointmentsService.getStats(req.user.id);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.appointmentsService.findOne(id, req.user.id);
    }

    @Post()
    create(@Request() req, @Body() data: any) {
        return this.appointmentsService.create(req.user.id, data);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() data: any) {
        return this.appointmentsService.update(id, req.user.id, data);
    }

    @Patch(':id/status')
    updateStatus(@Param('id', ParseIntPipe) id: number, @Request() req, @Body('status') status: string) {
        return this.appointmentsService.updateStatus(id, req.user.id, status);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.appointmentsService.remove(id, req.user.id);
    }

    @Get(':id/medical-record')
    getMedicalRecord(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.appointmentsService.getMedicalRecord(id, req.user.id);
    }

    @Post(':id/medical-record')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/medical-records',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    saveMedicalRecord(
        @Param('id', ParseIntPipe) id: number,
        @Request() req,
        @Body() data: any,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (file) {
            data.attachmentUrl = `/uploads/medical-records/${file.filename}`;
        }
        return this.appointmentsService.saveMedicalRecord(id, req.user.id, data);
    }

    @Post(':id/prescription')
    generatePrescription(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.appointmentsService.generatePrescription(id, req.user.id);
    }

    @Post(':id/prescription/send')
    sendPrescription(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() data: any) {
        return this.appointmentsService.sendPrescription(id, req.user.id, data);
    }
}
