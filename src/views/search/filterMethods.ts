import { moviesApi } from "services/moviesApi";
import { tvApi } from "services/tvApi";

export const searchMappings = {
  default: {
    /* Search by name by default */
    tv: (query: string, pagination?: { limit?: number; offset?: number }) => tvApi.search({ params: { name: query, ...pagination } }),
    movie: (query: string, pagination?: { limit?: number; offset?: number }) => moviesApi.search({ params: { q: query, ...pagination } })
  },
  title: {
    tv: (query: string, pagination?: { limit?: number; offset?: number }) => searchMappings.default.tv(query, pagination),
    movie: (query: string, pagination?: { limit?: number; offset?: number }) => searchMappings.default.movie(query, pagination)
  },
  actor: {
    tv: (query: string, pagination?: { limit?: number; offset?: number }) => tvApi.search({ params: { castMember: query, ...pagination } }),
    movie: (query: string, pagination?: { limit?: number; offset?: number }) =>
      moviesApi.searchByFilter({ params: { actor: query, ...pagination } })
  },
  genre: {
    tv: (query: string, pagination?: { limit?: number; offset?: number }) => tvApi.search({ params: { genre: query, ...pagination } }),
    movie: (query: string, pagination?: { limit?: number; offset?: number }) =>
      moviesApi.searchByFilter({ params: { genre: query, ...pagination } })
  },
  network: {
    tv: (query: string, pagination?: { limit?: number; offset?: number }) => tvApi.search({ params: { network: query, ...pagination } }),
    movie: (query: string, pagination?: { limit?: number; offset?: number }) => searchMappings.default.movie(query, pagination)
  },
  director: {
    tv: (query: string, pagination?: { limit?: number; offset?: number }) => searchMappings.default.tv(query, pagination),
    movie: (query: string, pagination?: { limit?: number; offset?: number }) => moviesApi.searchByFilter({ params: { director: query, ...pagination } })
  }
};

export interface IFilterMethod {
  movie: IFilterMethodParams[];
  tv: IFilterMethodParams[];
}

export interface IFilterMethodParams {
  filter: string;
  label: string;
  type: 'text' | 'number' | 'select';
  required: boolean;
  options?: string[];
}

export const filterMethods: IFilterMethod = {
  movie: [
    {
      filter: 'title',
      label: 'Title',
      type: 'text',
      required: true
    },
    {
      filter: 'mpaRating',
      label: 'MPAA Rating',
      type: 'select',
      required: false,
      options: ['G', 'PG', 'PG-13', 'R', 'NC-17']
    },
    {
      filter: 'yearMin',
      label: 'Year (Min)',
      type: 'number',
      required: false
    },
    {
      filter: 'yearMax',
      label: 'Year (Max)',
      type: 'number',
      required: false
    },
    {
      filter: 'genre',
      label: 'Genre',
      type: 'text',
      required: false
    },
    {
      filter: 'director',
      label: 'Director',
      type: 'text',
      required: false
    },
    {
      filter: 'actor',
      label: 'Actor',
      type: 'text',
      required: false
    }
  ],
  tv: [
    {
      filter: 'title',
      label: 'Title',
      type: 'text',
      required: false
    },
    {
      filter: 'genre',
      label: 'Genre',
      type: 'text',
      required: false
    },
    {
      filter: 'network',
      label: 'Network',
      type: 'text',
      required: false
    },
    {
      filter: 'actor',
      label: 'Actor',
      type: 'text',
      required: false
    },
    {
      filter: 'status',
      label: 'Status',
      type: 'select',
      required: false,
      options: ['Running', 'Ended', 'To Be Determined']
    },
    {
      filter: 'minrating',
      label: 'Minimum Rating',
      type: 'number',
      required: false
    }
  ]
};

export type FilterType = 'movie' | 'tv';
