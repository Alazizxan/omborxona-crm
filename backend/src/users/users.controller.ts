import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/guards/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  // 🔹 ADMIN agent yaratadi
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('agent')
  createAgent(@Body() body: any) {
    return this.usersService.createAgent(body);
  }

  // 🔹 ADMIN barcha agentlarni ko‘radi
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAllAgents();
  }

  // 🔹 ADMIN agentni o‘chiradi
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.deleteAgent(id);
  }

  // 🔹 AGENT o‘z profilini ko‘radi
  @UseGuards(JwtAuthGuard)
  @Get('me')
  profile(@Req() req: any) {
    return this.usersService.findById(req.user.id);
  }
}
