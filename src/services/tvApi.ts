import { mockTVService } from 'utils/axios';

export const tvApi = {
  getAll: () => Promise.resolve(mockTVService.get()),
  getById: (id: number) => Promise.resolve(mockTVService.getById(id))
};
