import { mockMovieService } from 'utils/axios';

export const moviesApi = {
  getAll: () => Promise.resolve(mockMovieService.get())
};
