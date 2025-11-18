'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Box, Stack, Typography, Card, CardMedia, Rating, Avatar } from '@mui/material';

// project import
import { moviesApi } from 'services/moviesApi';
import { IMovie } from 'types/movies';

export default function MovieDetail() {
  const [movie, setMovie] = React.useState<IMovie>();

  //Capture Route params
  const { id } = useParams();
  React.useEffect(() => {
    if (!id) return;
    //This would be data from our service apis (found in ../services) for now we can mock
    moviesApi
      .getByID(Number(id)) //0 for quality, 1 for bad with mocks.
      .then((response) => {
        setMovie(response);
        console.dir(response);
      })
      .catch((error) => console.error(error));
  }, [id]);

  //If Movie is undefined
  if (!movie) {
    return <div>movie was not found with id: {id ?? 'undefined'}</div>;
  }

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 1400
        //TODO: Ask them if they can give us backdrop data.
        // backgroundImage: `url(${show.backdropURL})`,
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
      }}
    >
      <Stack sx={{ p: 1, border: 'hidden' }} spacing={4}>
        {/* 4 total components*/}
        {/* #1 has Image Title Genre Genre2 Genre3 synopsis and rating*/}
        <Box sx={{ display: 'flex', gap: 3, backgroundColor: 'white' }}>
          {/* Component 1 box, poster*/}
          <Box>
            <Card sx={{ minWidth: 200 }}>
              <CardMedia
                component="img"
                //image={show.posterURL} // TODO: Ask them if they can give us poster data.
                alt={'name: ' + movie.title}
                sx={{
                  height: 300
                }}
              />
            </Card>
          </Box>

          {/* Component 1 box, Title Genre Rating synopsis stack*/}
          <Stack spacing={2} sx={{ padding: 4 }}>
            <Typography variant="h4" component="h1">
              {movie.title}
            </Typography>

            {/* Rating, votes, runtime, and returning,  */}
            <Typography>
              {/* Outer span is to ensure the whole Title:Value stays on one line, inner is to bold the Titles. */}
              <span style={{ whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 700 }}>Rating:</span> {movie.rating}/10
              </span>{' '}
              <span style={{ whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 700 }}>Box Office Revenue:</span> {movie.box_office}
              </span>{' '}
              <span style={{ whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 700 }}>Release Year:</span> {movie.release_year}
              </span>{' '}
              <span style={{ whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 700 }}>Runtime Minutes:</span> {movie.runtime_minutes}
              </span>{' '}
            </Typography>

            <Box sx={{ mt: 8 }}>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Placeholder for overview, not sure if they have that available in their database.
              </Typography>
            </Box>
          </Stack>

          {/*Component 1 box, Review Stars */}

          <Box sx={{ padding: 4 }}>
            <Rating name="movie-rating" value={Number(movie.rating)} precision={0.2} readOnly size="large" />
          </Box>
        </Box>

        {/* #4 has Reviews*/}
        <Box sx={{ backgroundColor: 'lightgrey', padding: 2 }}>
          Reviews are currently unimplemented. <br />
        </Box>
      </Stack>
    </Box>
  );
}
