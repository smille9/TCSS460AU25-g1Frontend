export interface IMovie {
  movie_id: number;
  title: string;
  release_year: number;
  runtime_minutes: number;
  rating: string;
  box_office: string;
  director_id: number;
  country_id: number;
}
export interface IMovies {
  success: boolean;
  message: string;
  data: {
    data: IMovie[];
  };
  pagination: {
    limit: number;
    offset: number;
    totalCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
export interface IMovieWithPoster extends IMovie {
  posterUrl: string;
  backdropUrl: string;
}

export interface IPoster {
  posterUrl: string;
  backdropUrl: string;
}

/** Unofficial interface based on response data (group has not updated their docs) */
export interface IMovieDetailed extends IMovieWithPoster {
  overview: string;
  genres: string;
  director_name: string;
  budget: string;
  studios: string;
  collection: string;
  original_title: string;
  poster_url: string;
  backdrop_url: string;
}

export interface IMoviesDetailed {
  success: boolean;
  message: string;
  data: {
    data: IMovieDetailed[];
  };
  pagination: {
    limit: number;
    offset: number;
    totalCount: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
