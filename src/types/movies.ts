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
