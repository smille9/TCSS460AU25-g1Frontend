import { moviesService } from 'utils/axios';

export const moviesApi = {
  search: (config: { params: { q: string } }) => moviesService.get('/api/v1/movies/search', config),
  getByID: (config: { params: { movieId: number } }) => moviesService.get('/api/v1/movies/search/id', config),
  getPosterByID: (id: number) => moviesService.get(`/api/v1/movies/${id}/poster`)
};
