'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Stack } from '@mui/material';
import MovieShowCard from 'components/MovieShowCard/MovieShowCard';
import { moviesApi } from 'services/moviesApi';
import { IMovieDetailed } from 'types/movies';

const MOVIE_ROUTE: string = '/movies/'; // /movies/[slug]
const RECENT_SHOW_BY_DEFAULT = 10;
const RECENT_SHOW_MORE_COUNT = 20;

export default function FeaturedFilmsView() {
  const [recentFilms, setRecentFilms] = useState<IMovieDetailed[]>([]);
  const [recentFilmsSliced, setRecentFilmsSliced] = useState<IMovieDetailed[]>([]);
  const [recentFilmCardCount, setRecentFilmCardCount] = useState<number>(RECENT_SHOW_BY_DEFAULT);

  const [grossingFilms, setGrossingFilms] = useState<IMovieDetailed[]>([]);

  useEffect(() => {
    moviesApi
      .getRecent()
      .then((response) => {
        setRecentFilms(response.data.data.data);
        setRecentFilmsSliced(response.data.data.data.slice(0, RECENT_SHOW_BY_DEFAULT));
      })
      .catch((error) => {
        console.error(error);
      });

    moviesApi
      .getTopGrossing({ params: { limit: 10, offset: 0 } })
      .then((response) => {
        setGrossingFilms(response.data.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const showMoreRecentFilms = () => {
    const total = recentFilmCardCount + RECENT_SHOW_MORE_COUNT;
    setRecentFilmCardCount(total);
    setRecentFilmsSliced(recentFilms.slice(0, total));
  };

  const allRecentFilmsDisplayed = recentFilmCardCount >= recentFilms.length;

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  };

  return (
    <>
      <Stack>
        <h2>Recently Released</h2>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          {recentFilmsSliced.map((entry) => (
            <MovieShowCard
              key={entry.movie_id}
              name={entry.title}
              subtext={`Director: ${entry.director_name}`}
              imgUrl={entry.poster_url}
              link={MOVIE_ROUTE + entry.movie_id}
            />
          ))}
        </Box>
        <Button onClick={showMoreRecentFilms} disabled={allRecentFilmsDisplayed}>
          Show More
        </Button>
      </Stack>
      <Stack>
        <h2>Top Grossing</h2>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          {grossingFilms.map((entry) => (
            <MovieShowCard
              key={entry.movie_id}
              name={entry.title}
              subtext={`Box Office: ${formatCurrency(parseFloat(entry.box_office))}`}
              imgUrl={entry.poster_url}
              link={MOVIE_ROUTE + entry.movie_id}
            />
          ))}
        </Box>
      </Stack>
    </>
  );
}
