import { moviesService } from 'utils/axios';

export const moviesApi = {
  search: (config: { params: { q: string; limit?: number; offset?: number } }) => moviesService.get('/api/v1/movies/search', config),
  searchByFilter: (config: {
    params: {
      mpaRating?: string;
      yearMin?: number;
      yearMax?: number;
      genre?: string;
      director?: string;
      actor?: string;
      limit?: number;
      offset?: number;
    };
  }) => moviesService.get('/api/v1/movies', config),
  getByID: (config: { params: { movieId: number } }) => moviesService.get('/api/v1/movies/search/id', config),
  getPosterByID: (id: number) => moviesService.get(`/api/v1/movies/${id}/poster`),
  create: (payload: any) => moviesService.post('/api/v1/movies', payload),
  getRecent: () => moviesService.get('/api/v1/movies/recent'),
  getTopGrossing: (config: { params: { limit?: number; offset?: number } }) => moviesService.get('/api/v1/movies/top-grossing', config),
  createDirector: (name: string) => moviesService.post('/api/v1/directors', { name }),
  getDirecrtors: (config: { params: { name: string; limit?: number; offset?: number } }) =>
    moviesService.get('/api/v1/directors/search', config)
};
