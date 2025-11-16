export interface IShow {
  iD: number;
  name: string;
  originalName: string;
  firstAirDate: string; //2025-11-14
  lastAirDate: string; //2025-11-14
  seasons: number;
  episodes: number;
  status: string;
  genres: string[];
  overview: string;
  popularity: number;
  tMDbRating: number;
  voteCount: number;
  posterURL: string;
  backdropURL: string;
  creators: string[];
  networks: string[];
  studios: string[];
  cast: ActorObj[];
}

export interface ActorObj {
  name: string;
  character: string;
  profileUrl: string;
}