import { mockMovieService, moviesService } from 'utils/axios';

export const moviesApi = {
  search: (config: { params: { q: string } }) => moviesService.get('/api/v1/movies/search', config),
  getByID: (id: number) => Promise.resolve(mockMovieService.getByID(id))
};
