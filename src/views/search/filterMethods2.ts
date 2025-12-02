import { moviesApi } from 'services/moviesApi';
import { tvApi } from 'services/tvApi';

/** Filter categories: 'movie' and 'tv' */
export type FilterType = 'movie' | 'tv';

/** HTML input types */
type inputType = 'text' | 'number' | 'select' | 'radio';

/** Describes contents of filter methods for different categories: movies and tv shows */
export interface IFilterMethod {
  movie: IFilterMethodParams[];
  tv: IFilterMethodParams[];
}

/** Fields describing a specific filter parameter */
export interface IFilterMethodParams {
  filter: string;
  label: string;
  type: inputType;
  required: boolean;
  options?: string[];
}

/** Pagination filters */
interface paginationQueries {
  limit?: number;
  offset?: number;
}

/** Describes specific filter queries for movies to be passed in */
interface movieFilterQueries {
  mpaRating?: string;
  genre?: string;
  yearMin?: number;
  yearMax?: number;
}

interface tvFilterQueries {
  genre?: string;
  network?: string;
  status?: string;
  minRating?: string;
}

/**
 * MAIN search mappings for the SEARCH-BY method
 * Secondary filter parameters can be passed in here
 */
export const searchMappings = {
  default: {
    /* Search by name by default */
    tv: (query: string, optFilters?: tvFilterQueries, pagination?: paginationQueries) =>
      tvApi.search({ params: { name: query, ...optFilters, ...pagination } }),
    movie: (query: string, optFilters?: movieFilterQueries, pagination?: paginationQueries) =>
      moviesApi.search({ params: { q: query, ...optFilters, ...pagination } })
  },
  title: {
    tv: (query: string, optFilters?: tvFilterQueries, pagination?: paginationQueries) =>
      searchMappings.default.tv(query, optFilters, pagination),
    movie: (query: string, optFilters?: movieFilterQueries, pagination?: paginationQueries) =>
      searchMappings.default.movie(query, optFilters, pagination)
  },
  actor: {
    tv: (query: string, optFilters?: tvFilterQueries, pagination?: paginationQueries) =>
      tvApi.search({ params: { castMember: query, ...optFilters, ...pagination } }),
    movie: (query: string, optFilters?: movieFilterQueries, pagination?: paginationQueries) =>
      moviesApi.searchByFilter({ params: { actor: query, ...optFilters, ...pagination } })
  },
  director: {
    tv: (query: string, optFilters?: tvFilterQueries, pagination?: paginationQueries) =>
      searchMappings.default.tv(query, optFilters, pagination),
    movie: (query: string, optFilters?: movieFilterQueries, pagination?: paginationQueries) =>
      moviesApi.searchByFilter({ params: { director: query, ...optFilters, ...pagination } })
  }
};

/**
 * Represent "primary" search methods that affect
 * what the main search box contents should query
 */
export const searchByMethods: IFilterMethod = {
  movie: [
    {
      filter: 'title',
      label: 'Title',
      type: 'text',
      required: true
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
      filter: 'actor',
      label: 'Actor',
      type: 'text',
      required: false
    }
  ]
};

/**
 * Filters specific to movies
 */
export const movieFilters: IFilterMethodParams[] = [
  {
    filter: 'mpaRating',
    label: 'MPAA Rating',
    type: 'radio',
    required: false,
    options: ['Any', 'G', 'PG', 'PG-13', 'R', 'NC-17', 'NR', 'Not Rated']
  },
  {
    filter: 'genre',
    label: 'Genre',
    type: 'text',
    required: false
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
  }
];

/**
 * Filters specific to TV shows
 */
export const tvFilters: IFilterMethodParams[] = [
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
    filter: 'status',
    label: 'Status',
    type: 'select',
    required: false,
    options: ['Returning Series', 'Cancelled']
  },
  {
    filter: 'minRating',
    label: 'Minimum Rating',
    type: 'number',
    required: false
  }
];
