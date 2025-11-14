import axios, { AxiosRequestConfig } from 'axios';
import { IShow } from 'types/tv';
import { IMovies } from 'types/movies'

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

if (!process.env.MESSAGES_WEB_API_URL) {
  throw new Error(
    'MESSAGES_WEB_API_URL environment variable is not set. ' +
      'Please add MESSAGES_WEB_API_URL to your .env and/or next.config.js file(s). ' +
      'Example: MESSAGES_WEB_API_URL=http://localhost:8000'
  );
}

if (!process.env.MESSAGES_WEB_API_KEY) {
  throw new Error(
    'MESSAGE_WEB_API_KEY environment variable is not set. ' +
      'Please add MESSAGE_WEB_API_KEY to your .env and/or next.config.js file(s). ' +
      'Example: MESSAGE_WEB_API_KEY=your-api-key-here'
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

// ==============================|| MOCK MOVIE SERVICE ||============================== //

const mockMovieService = {
  get: (): IMovies => {
    return {
      success: true,
      message: 'string',
      data: {
        data: [
          {
            movie_id: 0,
            title: 'string',
            release_year: 0,
            runtime_minutes: 0,
            rating: 'string',
            box_office: 'string',
            director_id: 0,
            country_id: 0
          },
          {
            movie_id: 0,
            title: 'string',
            release_year: 0,
            runtime_minutes: 0,
            rating: 'string',
            box_office: 'string',
            director_id: 0,
            country_id: 0
          }
        ]
      },
      pagination: {
        limit: 0,
        offset: 0,
        totalCount: 2,
        hasNext: true,
        hasPrevious: true
      }
    };
  }
};

// ==============================|| MOCK TV SERVICE ||============================== //

const mockTVService = {
  get: (): IShow[] => {
    return [
      {
        iD: 0,
        name: 'string',
        originalName: 'string',
        firstAirDate: '2025-11-14',
        lastAirDate: '2025-11-14',
        seasons: 0,
        episodes: 0,
        status: 'Returning Series',
        genres: ['string'],
        overview: 'string',
        popularity: 0,
        tMDbRating: 0,
        voteCount: 0,
        posterURL: 'string',
        backdropURL: 'string',
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
      },
      {
        iD: 1,
        name: 'string',
        originalName: 'string',
        firstAirDate: '2025-11-14',
        lastAirDate: '2025-11-14',
        seasons: 0,
        episodes: 0,
        status: 'Returning Series',
        genres: ['string'],
        overview: 'string',
        popularity: 0,
        tMDbRating: 0,
        voteCount: 0,
        posterURL: 'string',
        backdropURL: 'string',
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
  }
};

// ==============================|| EXPORTS ||============================== //

export default credentialsService; // Maintain backward compatibility
export { credentialsService, messagesService, mockMovieService, mockTVService };

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
