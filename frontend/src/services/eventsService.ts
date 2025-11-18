import api from '../utils/api';
import { EventPublic, EventIn, EventUpdate } from '../types';

export const eventsService = {
  // Public endpoints
  getAllEvents: async (): Promise<EventPublic[]> => {
    const response = await api.get('/public/events/all');
    return response.data;
  },

  getEventById: async (eventId: string): Promise<EventPublic> => {
    const response = await api.get(`/public/events/${eventId}`);
    return response.data;
  },

  getUpcomingEvents: async (): Promise<EventPublic[]> => {
    const response = await api.get('/public/events/upcoming');
    return response.data;
  },

  getEventsThisWeek: async (): Promise<EventPublic[]> => {
    const response = await api.get('/public/events/this-week');
    return response.data;
  },

  getEventsThisMonth: async (): Promise<EventPublic[]> => {
    const response = await api.get('/public/events/this-month');
    return response.data;
  },

  filterEvents: async (filters: {
    category?: string;
    tags?: string[];
    location?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<EventPublic[]> => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.tags) filters.tags.forEach(tag => params.append('tags', tag));
    if (filters.location) params.append('location', filters.location);
    if (filters.date_from) params.append('date_from', filters.date_from);
    if (filters.date_to) params.append('date_to', filters.date_to);

    const response = await api.get(`/public/events/filter?${params.toString()}`);
    return response.data;
  },

  getEventsByLocation: async (city: string): Promise<EventPublic[]> => {
    const response = await api.get(`/public/events/location/${city}`);
    return response.data;
  },

  getEventsByOrganisation: async (username: string): Promise<EventPublic[]> => {
    const response = await api.get(`/public/events/by-org/${username}`);
    return response.data;
  },

  getAllCategories: async (): Promise<string[]> => {
    const response = await api.get('/public/events/categories');
    return response.data;
  },

  // User endpoints
  getNearbyEvents: async (): Promise<EventPublic[]> => {
    const response = await api.get('/user/nearby_events');
    return response.data;
  },

  // Organisation endpoints
  createEvent: async (event: EventIn): Promise<any> => {
    const response = await api.post('/org/events/create', event);
    return response.data;
  },

  getMyEvents: async (): Promise<EventPublic[]> => {
    const response = await api.get('/org/events/my');
    return response.data;
  },

  updateEvent: async (eventId: string, update: EventUpdate): Promise<any> => {
    const response = await api.patch(`/org/events/update/${eventId}`, update);
    return response.data;
  },

  deleteEvent: async (eventId: string): Promise<any> => {
    const response = await api.delete(`/org/events/delete/${eventId}`);
    return response.data;
  },

  getEventHistory: async (): Promise<EventPublic[]> => {
    const response = await api.get('/org/history');
    return response.data;
  },
};

