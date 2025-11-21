import axios, { AxiosRequestConfig } from 'axios';
import { IShow } from 'types/tv';
import { IMovies, IMovie } from 'types/movies';

// next
import { getSession } from 'next-auth/react';

// ==============================|| ENVIRONMENT VALIDATION ||============================== //

if (!process.env.CREDENTIALS_API_URL) {
  throw new Error(
    'CREDENTIALS_API_URL environment variable is not set. ' +
      'Please add CREDENTIALS_API_URL to your .env and/or next.config.js file(s). ' +
      'Example: CREDENTIALS_API_URL=http://localhost:8008'
  );
}

if (!process.env.MOVIES_API_URL) {
  throw new Error(
    'MOVIES_API_URL environment variable is not set. ' +
      'Please add MESSAGES_WEB_API_URL to your .env and/or next.config.js file(s). ' +
      'Example: MESSAGES_WEB_API_URL=http://localhost:8000'
  );
}

if (!process.env.MOVIES_API_KEY) {
  throw new Error(
    'MOVIES_API_KEY environment variable is not set. ' +
      'Please add MOVIES_API_KEY to your .env and/or next.config.js file(s). ' +
      'Example: MOVIES_API_KEY=your-api-key-here'
  );
}

// ==============================|| CREDENTIALS SERVICE ||============================== //

const credentialsService = axios.create({ baseURL: process.env.CREDENTIALS_API_URL });

credentialsService.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.token.accessToken) {
      config.headers['Authorization'] = `Bearer ${session?.token.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

credentialsService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      const { baseURL, url, data } = error.config;
      console.error('Connection refused. The Auth/Web API server may be down. Attempting to connect to: ');
      console.error({ baseURL, url, data });
      return Promise.reject({
        message: 'Connection refused.'
      });
    } else if (error.response?.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    } else if (error.response?.status === 401 && typeof window !== 'undefined' && !window.location.href.includes('/login')) {
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

// ==============================|| MESSAGES SERVICE ||============================== //

const messagesService = axios.create({ baseURL: process.env.MESSAGES_WEB_API_URL });

messagesService.interceptors.request.use(
  async (config) => {
    config.headers['X-API-Key'] = process.env.MESSAGES_WEB_API_KEY;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

messagesService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      const { baseURL, url, data } = error.config;
      console.error('Connection refused. The Messages API server may be down. Attempting to connect to: ');
      console.error({ baseURL, url, data });
      return Promise.reject({
        message: 'Connection refused.'
      });
    } else if (error.response?.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

// ==============================|| MOVIE SERVICE ||============================== //

const moviesService = axios.create({ baseURL: process.env.MOVIES_API_URL });

moviesService.interceptors.request.use(
  async (config) => {
    config.headers['X-API-Key'] = process.env.MOVIES_API_KEY;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

moviesService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      const { baseURL, url, data } = error.config;
      console.error('Connection refused. The Messages API server may be down. Attempting to connect to: ');
      console.error({ baseURL, url, data });
      return Promise.reject({
        message: 'Connection refused.'
      });
    } else if (error.response?.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

const mockMovieService = {
  get: (): IMovies => {
    return {
      success: true,
      message: 'string',
      data: {
        data: [
          {
            movie_id: 0,
            title: 'Cool Movie',
            release_year: 1980,
            runtime_minutes: 101,
            rating: '8.6',
            box_office: '$123,456,789',
            director_id: 0,
            country_id: 0
          },
          {
            movie_id: 1,
            title: 'Bad Movie',
            release_year: 2024,
            runtime_minutes: 126,
            rating: '4.3',
            box_office: '$123',
            director_id: 0,
            country_id: 0
          }
        ]
      },
      pagination: {
        limit: 5,
        offset: 0,
        totalCount: 2,
        hasNext: false,
        hasPrevious: false
      }
    };
  },

  //TODO: MATCH TO API.
  //TODO: This currently does not match the API response format for the movie API we were given, as the get movie by id route does not exist. We have messaged them.
  getByID: (id: number): IMovie | undefined => {
    switch (id) {
      case 0:
        return {
          movie_id: 0,
          title: 'Cool Movie',
          release_year: 1980,
          runtime_minutes: 101,
          rating: '8.6',
          box_office: '$123,456,789',
          director_id: 0,
          country_id: 0
        };
      case 1:
        return {
          movie_id: 1,
          title: 'Bad Movie',
          release_year: 2024,
          runtime_minutes: 126,
          rating: '4.3',
          box_office: '$123',
          director_id: 0,
          country_id: 0
        };
    }
  }
};

// ==============================|| MOCK TV SERVICE ||============================== //

const tvService = axios.create({ baseURL: process.env.TV_API_URL });

tvService.interceptors.request.use(
  async (config) => {
    config.headers['X-API-Key'] = process.env.TV_API_KEY;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

tvService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      const { baseURL, url, data } = error.config;
      console.error('Connection refused. The Messages API server may be down. Attempting to connect to: ');
      console.error({ baseURL, url, data });
      return Promise.reject({
        message: 'Connection refused.'
      });
    } else if (error.response?.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

const mockTVService = {
  get: (): IShow[] => {
    return [
      {
        iD: 0,
        name: 'Quality Show',
        originalName: 'Good Show',
        firstAirDate: '2020-11-14',
        lastAirDate: '2025-11-14',
        seasons: 5,
        episodes: 25,
        status: 'Returning Series',
        genres: ['Drama'],
        overview: 'A pretty good show',
        popularity: 98,
        tMDbRating: 8.6,
        voteCount: 45,
        posterURL: 'https://image.tmdb.org/t/p/w500/wtQIgqEQEIQnNqLVGTShUf7qLap.jpg',
        backdropURL: 'https://image.tmdb.org/t/p/w500/iKfYhpMqcpJgXqciWZOIZRRJDF6.jpg',
        creators: ['Me', 'You'],
        networks: ['NBC'],
        studios: ['Bones'],
        cast: [
          {
            name: 'Ana Garibaldi',
            character: 'Gladys Guerra',
            profileUrl: 'https://image.tmdb.org/t/p/w500/mTiTouoWJPqgdFWmdbzljUniDHH.jpg'
          },
          {
            name: 'string',
            character: 'string',
            profileUrl: 'string'
          }
        ]
      },
      {
        iD: 1,
        name: 'Bad Show',
        originalName: 'Stinker',
        firstAirDate: '2024-11-14',
        lastAirDate: '2025-11-14',
        seasons: 1,
        episodes: 8,
        status: 'Returning Series',
        genres: ['Horror', 'Romance'],
        overview: 'a real stinker of a show',
        popularity: 10,
        tMDbRating: 12,
        voteCount: 4,
        posterURL: 'https://image.tmdb.org/t/p/w500/abeH7n5pcuQcwYcTxG6DTZvXLP1.jpg',
        backdropURL: 'https://image.tmdb.org/t/p/w500/tQqbbxBAdW2ql8vbOqMOJbtSQ7O.jpg',
        creators: ['string'],
        networks: ['string'],
        studios: ['string'],
        cast: [
          {
            name: 'string',
            character: 'string',
            profileUrl: 'string'
          }
        ]
      }
    ];
  },

  //Uses same shows from above, only valid IDs are 0 and 1 right now.
  getByID: (id: number): IShow | undefined => {
    switch (id) {
      case 0:
        return {
          iD: 0,
          name: 'Quality Show',
          originalName: 'Good Show',
          firstAirDate: '2020-11-14',
          lastAirDate: '2025-11-14',
          seasons: 5,
          episodes: 25,
          status: 'Returning Series',
          genres: ['Drama'],
          overview: 'A pretty good show',
          popularity: 98,
          tMDbRating: 8.6,
          voteCount: 45,
          posterURL: 'https://image.tmdb.org/t/p/w500/wtQIgqEQEIQnNqLVGTShUf7qLap.jpg',
          backdropURL: 'https://image.tmdb.org/t/p/w500/iKfYhpMqcpJgXqciWZOIZRRJDF6.jpg',
          creators: ['Me', 'You'],
          networks: ['NBC'],
          studios: ['Bones'],
          cast: [
            {
              name: 'Ana Garibaldi',
              character: 'Gladys Guerra',
              profileUrl: 'https://image.tmdb.org/t/p/w500/mTiTouoWJPqgdFWmdbzljUniDHH.jpg'
            }
          ]
        };

      case 1:
        return {
          iD: 1,
          name: 'Bad Show',
          originalName: 'Stinker',
          firstAirDate: '2024-11-14',
          lastAirDate: '2025-11-14',
          seasons: 1,
          episodes: 8,
          status: 'Returning Series',
          genres: ['Horror', 'Romance'],
          overview: 'a real stinker of a show',
          popularity: 10,
          tMDbRating: 3,
          voteCount: 4,
          posterURL: 'https://image.tmdb.org/t/p/w500/abeH7n5pcuQcwYcTxG6DTZvXLP1.jpg',
          backdropURL: 'https://image.tmdb.org/t/p/w500/tQqbbxBAdW2ql8vbOqMOJbtSQ7O.jpg',
          creators: ['string'],
          networks: ['string'],
          studios: ['string'],
          cast: [
            {
              name: 'Actor',
              character: 'Character',
              profileUrl: 'string'
            },
            {
              name: 'Actor2',
              character: 'Character2',
              profileUrl: 'string'
            },
            {
              name: 'Actor3',
              character: 'Character3',
              profileUrl: 'string'
            },
            {
              name: 'Actor4',
              character: 'Character4',
              profileUrl: 'string'
            }
          ]
        };

      default:
        return undefined;
    }
  }
};

// ==============================|| EXPORTS ||============================== //

export default credentialsService; // Maintain backward compatibility
export { credentialsService, messagesService, mockMovieService, mockTVService, moviesService, tvService };

// Credentials service helpers
export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await credentialsService.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await credentialsService.post(url, { ...config });

  return res.data;
};

// Messages service helpers
export const messagesFetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await messagesService.get(url, { ...config });

  return res.data;
};

export const messagesFetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await messagesService.post(url, { ...config });

  return res.data;
};
