import { Controller, Get, Post, Put, Patch, Delete, UseGuards, Request, Body, Param, ParseIntPipe } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('whatsapp')
@UseGuards(JwtAuthGuard)
export class WhatsAppController {
    constructor(private whatsappService: WhatsAppService) { }

    @Get('status')
    async getStatus(@Request() req) {
        console.log(`[WhatsApp] Status check request received for user: ${req.user.id}`);
        return this.whatsappService.getStatus(req.user.id);
    }

    @Post('connect')
    async connect(@Request() req) {
        return this.whatsappService.startSession(req.user.id);
    }

    @Delete('logout')
    async logout(@Request() req) {
        return this.whatsappService.logout(req.user.id);
    }

    @Get('settings')
    async getSettings(@Request() req) {

        return this.whatsappService.getSettings(req.user.id);
    }

    @Post('settings')
    async updateSettings(@Request() req, @Body() body) {
        return this.whatsappService.updateSettings(req.user.id, body);
    }

    @Get('chats')
    async getChats(@Request() req) {
        return this.whatsappService.getChats(req.user.id);
    }

    @Get('chats/:id/messages')
    async getMessages(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.whatsappService.getMessages(id, req.user.id);
    }

    @Post('send')
    async sendMessage(@Request() req, @Body() body: any) {
        return this.whatsappService.sendMessage(req.user.id, body);
    }

    @Patch('chats/:id/read')
    async markRead(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.whatsappService.markRead(id, req.user.id);
    }

    @Get('templates')
    async getTemplates(@Request() req) {
        return this.whatsappService.getTemplates(req.user.id);
    }

    @Post('templates')
    async createTemplate(@Request() req, @Body() body: any) {
        return this.whatsappService.createTemplate(req.user.id, body);
    }

    @Put('templates/:id')
    async updateTemplate(@Param('id', ParseIntPipe) id: number, @Request() req, @Body() body: any) {
        return this.whatsappService.updateTemplate(id, req.user.id, body);
    }

    @Delete('templates/:id')
    async deleteTemplate(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.whatsappService.deleteTemplate(id, req.user.id);
    }

    @Get('analytics')
    async getAnalytics(@Request() req) {
        return this.whatsappService.getAnalytics(req.user.id);
    }

    @Get('tags')
    async getTags(@Request() req) {
        return this.whatsappService.getTags(req.user.id);
    }

    @Get('contacts/:phone/tags')
    async getContactTags(@Param('phone') phone: string, @Request() req) {
        return this.whatsappService.getContactTags(phone, req.user.id);
    }

    @Post('contacts/:phone/tags')
    async addContactTag(@Param('phone') phone: string, @Body('tagId') tagId: number, @Request() req) {
        return this.whatsappService.addContactTag(phone, tagId, req.user.id);
    }

    @Delete('contacts/:phone/tags/:tagId')
    async removeContactTag(@Param('phone') phone: string, @Param('tagId', ParseIntPipe) tagId: number, @Request() req) {
        return this.whatsappService.removeContactTag(phone, tagId, req.user.id);
    }
}
