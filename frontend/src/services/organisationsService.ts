import api from '../utils/api';
import { OrganisationPublic, OrganisationIn } from '../types';

export const organisationsService = {
  // Public endpoints
  getAllOrganisations: async (): Promise<OrganisationPublic[]> => {
    const response = await api.get('/public/organisations/');
    return response.data;
  },

  getOrganisationById: async (orgId: string): Promise<OrganisationPublic> => {
    const response = await api.get(`/public/organisations/${orgId}`);
    return response.data;
  },

  getOrganisationByUsername: async (username: string): Promise<OrganisationPublic[]> => {
    const response = await api.get(`/public/organisations/by-username/${username}`);
    return response.data;
  },

  registerOrganisation: async (org: OrganisationIn): Promise<any> => {
    const response = await api.post('/public/organisations/register', org);
    return response.data;
  },

  getOrgStats: async (organisationId: string): Promise<any> => {
    const response = await api.get(`/public/organisations/statiiiiistika/${organisationId}/stats`);
    return response.data;
  },

  getOrgReviews: async (orgId: string): Promise<any> => {
    const response = await api.get(`/public/organisations/org/${orgId}/reviews`);
    return response.data;
  },

  getOrgAvgRating: async (orgId: string): Promise<any> => {
    const response = await api.get(`/public/organisations/org/${orgId}/avg-rating`);
    return response.data;
  },

  // Organisation endpoints (authenticated)
  getMe: async (): Promise<OrganisationPublic> => {
    const response = await api.get('/org/me');
    return response.data;
  },
};

