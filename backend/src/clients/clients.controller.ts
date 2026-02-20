

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
    constructor(private service: ClientsService) { }

    @Post()
    create(@Body() body: any) {
        return this.service.create(body);
    }

    @Get()
    findAll(@Query('search') search?: string) {
        return this.service.findAll(search);
    }
}