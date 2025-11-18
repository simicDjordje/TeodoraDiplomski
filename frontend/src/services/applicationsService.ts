import api from '../utils/api';
import { ApplicationIn, ApplicationPublic, ApplicationUpdate, OrgDecision } from '../types';

export const applicationsService = {
  // User endpoints
  applyForEvent: async (application: ApplicationIn): Promise<any> => {
    const response = await api.post('/user/apply', application);
    return response.data;
  },

  getMyApplications: async (): Promise<ApplicationPublic[]> => {
    const response = await api.get('/user/mojaapliciranja');
    return response.data;
  },

  cancelApplication: async (applicationId: string): Promise<any> => {
    const response = await api.patch(`/user/applications/${applicationId}/cancel`);
    return response.data;
  },

  // Organisation endpoints
  getEventApplications: async (eventId: string): Promise<ApplicationPublic[]> => {
    const response = await api.get(`/org/OrganisationEventsApplication/${eventId}/applications`);
    return response.data;
  },

  getAllApplicationsForOrg: async (): Promise<ApplicationPublic[]> => {
    const response = await api.get('/org/GetAllAppl/all');
    return response.data;
  },

  updateApplicationStatus: async (
    applicationId: string,
    status: OrgDecision,
    extraNotes?: string
  ): Promise<any> => {
    const response = await api.patch(
      `/org/applications/${applicationId}/status/${status}`,
      extraNotes ? { extra_notes: extraNotes } : {}
    );
    return response.data;
  },
};

