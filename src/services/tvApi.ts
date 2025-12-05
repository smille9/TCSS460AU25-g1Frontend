import { tvService } from 'utils/axios';

export const tvApi = {
  search: (config: {
    params: {
      name?: string;
      genre?: string;
      network?: string;
      castMember?: string;
      status?: string;
      minRating?: number;
      limit?: number;
      offset?: number;
    };
  }) => tvService.get('/series', config),
  getByID: (id: number) => tvService.get(`/series/${id}`),
  create: (payload: any) => tvService.post('/series', payload)
};
