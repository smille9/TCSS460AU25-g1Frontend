'use client';

import { Box, Stack } from '@mui/material';
import MovieShowCard from 'components/MovieShowCard/MovieShowCard';
import { testData } from './temp';

const MOVIE_ROUTE: string = '/movies/'; // /movies/[slug]

export default function FeaturedFilmsView() {
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
          <MovieShowCard
            name="Dune"
            subtext="Director: Some Guy"
            imgUrl="https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg"
            link={MOVIE_ROUTE + '#'}
          />
          {testData.map((entry) => (
            <MovieShowCard
              key={entry.movie_id}
              name={entry.title}
              subtext={`Director: ${entry.director_name}`}
              imgUrl={entry.poster_url}
              link={MOVIE_ROUTE + entry.movie_id}
            />
          ))}
        </Box>
      </Stack>
      <Stack>
        <h2>Top Grossing</h2>
      </Stack>
    </>
  );
}
