import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventDto } from '../dto/events.dto';
import { Event } from '../models/events.models';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('EventsController', () => {
  let app: INestApplication;
  let controller: EventsController;
  let mockEvents: Event[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
    }).compile();

    app = module.createNestApplication();
    controller = module.get<EventsController>(EventsController);

    // Mock the controller's events data
    mockEvents = [];
    for (let i = 0; i < 5; i++) {
      const fakeEvent = {
        title: faker.company.name(),
        description: faker.lorem.sentence(),
        date: faker.date.soon(),
        category: faker.lorem.word(),
        id: i + 1,
      };
      mockEvents.push(fakeEvent);
    }

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /events', () => {
    it('should create a new event', async () => {
      const newEvent: EventDto = {
        title: 'New Event',
        description: 'Event description',
        date: new Date('2025-01-13'),
        category: 'Category 1',
        id: mockEvents.length + 1,
      };

      const response = await request(app.getHttpServer())
        .post('/events')
        .send(newEvent)
        .expect(201);

      expect(response.body.title).toBe(newEvent.title);
      expect(response.body.description).toBe(newEvent.description);
      expect(response.body.date).toBe(newEvent.date.toISOString());
      expect(response.body.category).toBe(newEvent.category);
    });
  });

  describe('GET /events', () => {
    it('should return paginated events', async () => {
      const response = await request(app.getHttpServer())
        .get('/events')
        .query({ page: 1, pageSize: 5 })
        .expect(200);

      expect(response.body.data.length).toBe(5);
    });
  });

  describe('GET /events/:id', () => {
    it('should return a single event by id', async () => {
      const eventId = 1;
      const response = await request(app.getHttpServer())
        .get(`/events/${eventId}`)
        .expect(200);

      expect(response.body.id).toBe(eventId);
    });

    it('should return 404 if event is not found', async () => {
      const eventId = 999;
      await request(app.getHttpServer()).get(`/events/${eventId}`).expect(404);
    });
  });

  describe('PUT /events/:id', () => {
    it('should update an event', async () => {
      const eventId = 1;
      const updatedEvent: EventDto = {
        title: 'Updated Event',
        description: 'Updated description',
        date: new Date('2025-01-15'),
        category: 'Updated Category',
        id: eventId,
      };

      const response = await request(app.getHttpServer())
        .put(`/events/${eventId}`)
        .send(updatedEvent)
        .expect(200);

      expect(response.body.title).toBe(updatedEvent.title);
      expect(response.body.description).toBe(updatedEvent.description);
      expect(response.body.date).toBe(updatedEvent.date.toISOString());
      expect(response.body.category).toBe(updatedEvent.category);
    });

    it('should return 404 if event is not found', async () => {
      const eventId = 999;
      const updatedEvent: EventDto = {
        title: 'Updated Event',
        description: 'Updated description',
        date: new Date('2025-01-15'),
        category: 'Updated Category',
        id: eventId,
      };

      await request(app.getHttpServer())
        .put(`/events/${eventId}`)
        .send(updatedEvent)
        .expect(404);
    });
  });

  describe('DELETE /events/:id', () => {
    it('should delete an event', async () => {
      const eventId = 1;
      await request(app.getHttpServer())
        .delete(`/events/${eventId}`)
        .expect(200);
    });

    it('should return 404 if event is not found', async () => {
      const eventId = 999;
      await request(app.getHttpServer())
        .delete(`/events/${eventId}`)
        .expect(404);
    });
  });

  describe('POST /events/search', () => {
    it('should search events by key', async () => {
      const searchKey = 'Event';
      const response = await request(app.getHttpServer())
        .post('/events/search')
        .query({ key: searchKey })
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0); // Should return events containing 'Event' in title or category
    });

    it('should return paginated results if no search key is provided', async () => {
      const response = await request(app.getHttpServer())
        .post('/events/search')
        .query({ key: '' })
        .expect(200);

      expect(response.body.length).toBe(5); // Should return paginated results
    });
  });
});
