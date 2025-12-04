'use client';

import { useState, useEffect } from 'react';
import { Box, Button, Stack } from '@mui/material';
import MovieShowCard from 'components/MovieShowCard/MovieShowCard';
import { tvApi } from 'services/tvApi';
import { IShow } from 'types/tv';

const SHOW_ROUTE: string = '/shows/'; // /shows/[slug]
const MIN_RATING: number = 7.9; // minimum rating to use as filter
const NUM_PER_PAGE: number = 20;

export default function FeaturedShowsView() {
  const [shows, setShows] = useState<IShow[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);

  useEffect(() => {
    tvApi
      .search({ params: { minRating: MIN_RATING, limit: NUM_PER_PAGE, offset: 0 } })
      .then((response) => {
        setShows(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function getMoreShows() {
    const offset = pageNum * NUM_PER_PAGE;
    tvApi
      .search({ params: { minRating: MIN_RATING, limit: NUM_PER_PAGE, offset: offset } })
      .then((response) => {
        setShows((prev) => [...prev, ...response.data.data]);
        setPageNum(pageNum + 1);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const showMoreShows = () => getMoreShows();

  const noMoreShows = false; // FIXME

  return (
    <>
      <Stack>
        <h2 style={{ marginBottom: '1px' }}>Top Shows</h2>
        <div style={{ marginBottom: '16px' }}>TMDb 7.9 or Higher</div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          {shows.map((entry) => (
            <MovieShowCard
              key={entry.iD}
              name={entry.name}
              subtext={`Rating: ${entry.tMDbRating}`}
              imgUrl={entry.posterURL}
              link={SHOW_ROUTE + entry.iD}
            />
          ))}
        </Box>
        <Button onClick={showMoreShows} disabled={noMoreShows}>
          Show More
        </Button>
      </Stack>
    </>
  );
}
