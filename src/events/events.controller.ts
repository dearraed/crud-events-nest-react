import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EventDto } from '../dto/events.dto';
import { Event } from '../models/events.models';
import { faker } from '@faker-js/faker';
import { log } from 'console';

@Controller('events')
export class EventsController {
  private events: Event[]; // Declare the 'users' property
  private page: number;
  private pageSize: number;

  constructor() {
    this.events = [];
    this.page = 1;
    this.pageSize = 5;

    for (let index = 0; index < 30; index++) {
      const company = faker.company.buzzNoun();
      const fakeEvent = {
        title: `Event of : ${company}`,
        description: `Description of : ${company}`,
        date: faker.date.soon(),
        category: `category ${((index + 1) % 10) + 1}`,
        id: index + 1,
      };
      this.events.push(fakeEvent);
    }
  }

  @Post()
  Add(@Body() body: EventDto) {
    const newEvent = { ...body, id: this.events.length + 1 };
    this.events.push(newEvent);
    return newEvent;
  }

  @Get()
  FindAll(@Query('page') page, @Query('pageSize') pageSize) {
    this.page = parseInt(page);
    this.pageSize = parseInt(pageSize);
    const data = this.paginateEvents();

    return {
      data: data.paginatedEvents,
      total: data.totalEvents,
    };
  }

  @Get('/:id')
  FindOne(@Param() { id }) {
    const event = this.events.find((event) => event.id === parseInt(id));

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  @Put('/:id')
  Update(@Param('id') id: string, @Body() body: EventDto) {
    const index = this.events.findIndex((event) => event.id === parseInt(id));
    if (index == -1) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    this.events[index] = body;
    return this.events.find((user) => user.id === parseInt(id));
  }

  @Delete('/:id')
  Delete(@Param() params) {
    const index = this.events.findIndex(
      (event) => event.id === parseInt(params.id),
    );

    if (index == -1) {
      throw new NotFoundException(`Event with ID ${params.id} not found`);
    }
    this.events = this.events.filter((user) => user.id !== parseInt(params.id));
    return this.events;
  }

  @Post('/search')
  @HttpCode(200) // Explicitly set the HTTP status to 200 OK
  Search(@Query('key') key) {
    const escapedTerm = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Create a case-insensitive regex for a partial match
    const regex = new RegExp(escapedTerm, 'i');

    if (key.length) {
      return this.events.filter(
        (event) => regex.test(event.title) || regex.test(event.category),
      );
    } else {
      const data = this.paginateEvents();
      return data.paginatedEvents;
    }
  }

  paginateEvents = () => {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    const paginatedEvents = this.events.slice(startIndex, endIndex);
    const totalEvents = this.events.length;

    return {
      paginatedEvents,
      totalEvents,
    };
  };
}
