import { mockTVService, tvService } from 'utils/axios';

export const tvApi = {
  search: (config: { params: { name: string } }) => tvService.get('/series', config),
  getByID: (id: number) => Promise.resolve(mockTVService.getByID(id)),
  create: (payload: any) => tvService.post('/series', payload)
};
