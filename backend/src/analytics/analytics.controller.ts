import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/guards/roles.decorator';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private service: AnalyticsService) { }

  @Roles('ADMIN')
  @Get('dashboard')
  dashboard() {
    return this.service.dashboard();
  }

  


  @Roles('ADMIN')
  @Get('top-agents')
  topAgents() {
    return this.service.topAgents();
  }
}
