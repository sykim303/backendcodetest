import { Controller, Get } from '@nestjs/common';
import { BusService } from './bus.service';

@Controller('bus')
export class BusController {
  constructor(private readonly busService: BusService) {}

  @Get()
  async getBusStopInfo() {
    return await this.busService.getBusStopInfo();
  }
}
