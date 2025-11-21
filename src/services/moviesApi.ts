import { moviesService } from 'utils/axios';

export const moviesApi = {
  search: (config: { params: { q: string } }) => moviesService.get('/api/v1/movies/search', config)
};
