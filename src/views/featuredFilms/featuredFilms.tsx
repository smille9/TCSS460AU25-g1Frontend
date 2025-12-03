'use client';

import { Grid2, Stack } from '@mui/material';
import MovieShowCard from 'components/MovieShowCard';

export default function FeaturedFilmsView() {
  return (
    <>
      <Stack>
        <h2>Recently Released</h2>
        <Grid2>
          <MovieShowCard />
        </Grid2>
      </Stack>
      <Stack>
        <h2>Top Grossing</h2>
      </Stack>
    </>
  );
}
