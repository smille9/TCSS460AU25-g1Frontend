import { mockTVService } from 'utils/axios';

export const tvApi = {
  getAll: () => Promise.resolve(mockTVService.get()),
  getByID: (id: number) => Promise.resolve(mockTVService.getByID(id))
};
