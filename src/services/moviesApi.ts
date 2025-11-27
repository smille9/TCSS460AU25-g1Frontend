import { mockMovieService, moviesService } from 'utils/axios';

export const moviesApi = {
  search: (config: { params: { q: string } }) => moviesService.get('/api/v1/movies/search', config),
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
  getByID: (id: number) => Promise.resolve(mockMovieService.getByID(id))
};
