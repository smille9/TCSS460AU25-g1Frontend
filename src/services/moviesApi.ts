import { mockMovieService } from 'utils/axios';

export const moviesApi = {
  getAll: () => Promise.resolve(mockMovieService.get()),
  getByID: (id: number) => Promise.resolve(mockMovieService.getByID(id))
};
