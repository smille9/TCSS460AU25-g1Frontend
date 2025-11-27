import { tvApi } from 'services/tvApi';
import { moviesApi } from 'services/moviesApi';

type MoviesApiFunction = typeof moviesApi.search | typeof moviesApi.searchByFilter | typeof moviesApi.getByID;
type TvApiFunction = typeof tvApi.search;

export interface IFilterMethod {
  movie: IFilterMethodParams[];
  tv: IFilterMethodParams[];
}

export interface IFilterMethodParams {
  param: string;
  label: string;
  type: 'text' | 'number' | 'select';
  required: boolean;
  options?: string[];
  function: MoviesApiFunction | TvApiFunction;
}

export const filterMethods: IFilterMethod = {
  movie: [
    {
      param: 'q',
      label: 'Name',
      type: 'text',
      required: true,
      function: moviesApi.search
    },
    {
      param: 'mpaRating',
      label: 'MPAA Rating',
      type: 'select',
      required: false,
      options: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
      function: moviesApi.searchByFilter
    },
    {
      param: 'yearMin',
      label: 'Year (Min)',
      type: 'number',
      required: false,
      function: moviesApi.searchByFilter
    },
    {
      param: 'yearMax',
      label: 'Year (Max)',
      type: 'number',
      required: false,
      function: moviesApi.searchByFilter
    },
    {
      param: 'genre',
      label: 'Genre',
      type: 'text',
      required: false,
      function: moviesApi.searchByFilter
    },
    {
      param: 'director',
      label: 'Director',
      type: 'text',
      required: false,
      function: moviesApi.searchByFilter
    },
    {
      param: 'actor',
      label: 'Actor',
      type: 'text',
      required: false,
      function: moviesApi.searchByFilter
    },
    {
      param: 'limit',
      label: 'Limit',
      type: 'number',
      required: false,
      function: moviesApi.searchByFilter
    },
    {
      param: 'offset',
      label: 'Offset',
      type: 'number',
      required: false,
      function: moviesApi.searchByFilter
    }
  ],
  tv: [
    {
      param: 'name',
      label: 'Name',
      type: 'text',
      required: false,
      function: tvApi.search
    },
    {
      param: 'genre',
      label: 'Genre',
      type: 'text',
      required: false,
      function: tvApi.search
    },
    {
      param: 'network',
      label: 'Network',
      type: 'text',
      required: false,
      function: tvApi.search
    },
    {
      param: 'castMember',
      label: 'Cast Member',
      type: 'text',
      required: false,
      function: tvApi.search
    },
    {
      param: 'status',
      label: 'Status',
      type: 'select',
      required: false,
      options: ['Running', 'Ended', 'To Be Determined'],
      function: tvApi.search
    },
    {
      param: 'minrating',
      label: 'Minimum Rating',
      type: 'number',
      required: false,
      function: tvApi.search
    },
    {
      param: 'limit',
      label: 'Limit',
      type: 'number',
      required: false,
      function: tvApi.search
    },
    {
      param: 'offset',
      label: 'Offset',
      type: 'number',
      required: false,
      function: tvApi.search
    }
  ]
};

export type FilterType = 'movie' | 'tv';
