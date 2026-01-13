import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContactResponseDto, UpdateContactStatusDto } from './dto/contact.dto';

@ApiTags('Contacts')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('contacts')
export class ContactsController {
    constructor(private contactsService: ContactsService) { }

    @Get()
    @ApiOperation({ summary: 'جلب جميع جهات الاتصال', description: 'عرض قائمة بجميع المرضى وجهات الاتصال المسجلة' })
    @ApiResponse({ status: 200, description: 'تم جلب القائمة بنجاح', type: [ContactResponseDto] })
    async findAll(@Request() req) {
        return this.contactsService.findAll(req.user.id);
    }

    @Get('search/national-id/:id')
    @ApiOperation({ summary: 'البحث بالرقم الوطني', description: 'البحث عن مريض محدد باستخدام رقمه الوطني' })
    @ApiParam({ name: 'id', description: 'الرقم الوطني' })
    @ApiResponse({ status: 200, description: 'تم العثور على المريض', type: ContactResponseDto })
    @ApiResponse({ status: 404, description: 'المريض غير موجود' })
    async findByNationalId(@Param('id') id: string, @Request() req) {
        return this.contactsService.findByNationalId(req.user.id, id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'تفاصيل جهة اتصال', description: 'جلب بيانات مريض محدد مع سجلاته الطبية ومواعيده' })
    @ApiParam({ name: 'id', description: 'معرف جهة الاتصال' })
    @ApiResponse({ status: 200, description: 'تم جلب التفاصيل بنجاح', type: ContactResponseDto })
    async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.contactsService.findOne(id, req.user.id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'تحديث حالة جهة اتصال', description: 'تغيير حالة المريض (نشط، غير نشط، إلخ)' })
    @ApiParam({ name: 'id', description: 'معرف جهة الاتصال' })
    @ApiBody({ type: UpdateContactStatusDto })
    @ApiResponse({ status: 200, description: 'تم تحديث الحالة بنجاح' })
    async updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: string,
        @Request() req,
    ) {
        return this.contactsService.updateStatus(id, req.user.id, status);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'حذف جهة اتصال', description: 'إزالة بيانات المريض من النظام' })
    @ApiParam({ name: 'id', description: 'معرف جهة الاتصال' })
    @ApiResponse({ status: 200, description: 'تم الحذف بنجاح' })
    async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.contactsService.delete(id, req.user.id);
    }
}

