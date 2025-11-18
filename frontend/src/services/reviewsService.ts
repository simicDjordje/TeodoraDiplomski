import api from '../utils/api';
import { ReviewUserToOrgIn, ReviewOrgToUserIn } from '../types';

export const reviewsService = {
  // User endpoints
  createUserToOrgReview: async (
    eventId: string,
    review: ReviewUserToOrgIn
  ): Promise<any> => {
    const response = await api.post(`/user/reviews/user-to-org/${eventId}`, review);
    return response.data;
  },

  // Organisation endpoints
  createOrgToUserReview: async (
    eventId: string,
    userId: string,
    review: ReviewOrgToUserIn
  ): Promise<any> => {
    const response = await api.post(`/org/org/${eventId}/rate-user/${userId}`, review);
    return response.data;
  },
};

