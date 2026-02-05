import { Controller, Post, Body, Get, UseGuards, Request, Patch, Param, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async register(@Body() createUserDto: Prisma.UserCreateInput) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = await this.usersService.create(createUserDto);
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll(@Request() req) {
        if (req.user.role !== 'ADMIN') {
            throw new ForbiddenException('Admin access required');
        }
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: any, @Request() req) {
        if (req.user.role !== 'ADMIN') {
            throw new ForbiddenException('Admin access required');
        }
        return this.usersService.update(id, data);
    }
}
