import { moviesApi } from "services/moviesApi";
import { tvApi } from "services/tvApi";

export const searchMappings = {
  default: {
    /* Search by name by default */
    tv: (query: string) => tvApi.search({ params: { name: query } }),
    movie: (query: string) => moviesApi.search({ params: { q: query } })
  },
  title: {
    tv: (query: string) => searchMappings.default.tv(query),
    movie: (query: string) => searchMappings.default.movie(query)
  },
  actor: {
    tv: (query: string) => tvApi.search({ params: { castMember: query } }),
    movie: (query: string) => moviesApi.searchByFilter({ params: { actor: query } })
  },
  genre: {
    tv: (query: string) => tvApi.search({ params: { genre: query } }),
    movie: (query: string) => moviesApi.searchByFilter({ params: { genre: query } })
  },
  network: {
    tv: (query: string) => tvApi.search({ params: { network: query } }),
    movie: (query: string) => searchMappings.default.movie(query)
  },
  director: {
    tv: (query: string) => searchMappings.default.tv(query),
    movie: (query: string) => moviesApi.searchByFilter({ params: { director: query } })
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
