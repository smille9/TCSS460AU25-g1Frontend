'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Box, Stack, Typography, Card, CardMedia, Rating, Chip, Avatar } from '@mui/material';

// project import
import { moviesApi } from 'services/moviesApi';
import { IMovieDetailed } from 'types/movies';
import { WatchlistToggle } from 'components/WatchlistToggle';

type Actor = {
  name: string;
  character: string;
};

export default function MovieDetail() {
  const [movie, setMovie] = React.useState<IMovieDetailed>(); // using detailed response (API docs not updated)
  const [isLoading, setIsLoading] = React.useState(true);

  //Helpers to parse responses
  const parseSemicolonSeparatedString = (seperatedString?: string) =>
    seperatedString
      ?.split(';')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  const convertStringToMonetaryAmount = (numberString?: string) => {
    if (!numberString) {
      return 'Not Found';
    }
    const amount = parseFloat(numberString);
    const formattedAmountString = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);

    return formattedAmountString;
  };

  //Capture Route params
  const { id } = useParams();
  React.useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    moviesApi
      .getByID({ params: { movieId: Number(id) } })
      .then((response) => {
        setMovie(response.data.data.data[0]);
        console.dir(response);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [id]);

  //Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Movie was not found with id: {id ?? 'undefined'}</div>;
  }

  //Parse response actors JSON string into an array
  let movieCast: Actor[] = [];
  try {
    movieCast = JSON.parse(movie.actors ?? '[]');
  } catch {
    movieCast = [];
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        backgroundColor: '#1f1f1f'
      }}
    >
      <Box
        sx={{
          p: 3,
          maxWidth: 1400,
          backgroundImage: `url(${movie.backdrop_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Stack sx={{ p: 1, border: 'hidden' }} spacing={4}>
          {/* 4 total components*/}
          {/* #1 has Image Title Genre Genre2 Genre3 synopsis and rating*/}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              backgroundColor: '#262626',
              border: '2px',
              borderRadius: '24px',
              borderColor: '#595959',
              borderStyle: 'solid'
            }}
          >
            {/* Component 1 box, poster*/}
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '20px' }}>
              <Card sx={{ minWidth: 200 }}>
                <CardMedia
                  component="img"
                  image={movie.poster_url}
                  alt={'name: ' + movie.title}
                  sx={{
                    height: 300
                  }}
                />
              </Card>
            </Box>

            {/* Component 1 box, Title Genre Rating synopsis stack*/}
            <Stack spacing={2} sx={{ padding: 4, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
                  {movie.title}
                </Typography>
                <WatchlistToggle id={movie.movie_id} type="movies" />
              </Box>

              {/*Genres*/}
              <Stack direction="row" spacing={1}>
                {parseSemicolonSeparatedString(movie.genres).map((genre) => (
                  <Chip key={genre} label={genre} size="medium" />
                ))}
              </Stack>

              {/* Rating, votes, runtime, and returning,  */}
              <Typography>
                {/* Outer span is to ensure the whole Title:Value stays on one line, inner is to bold the Titles. */}
                <span style={{ whiteSpace: 'nowrap' }}>
                  <span style={{ fontWeight: 700 }}>Rating:</span> {movie.rating ? `$${movie.rating}/10` : 'Unrated'}
                </span>{' '}
                <span style={{ whiteSpace: 'nowrap' }}>
                  <span style={{ fontWeight: 700 }}>Box Office Revenue:</span> {convertStringToMonetaryAmount(movie.box_office)}
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
                  {movie.overview}
                </Typography>
              </Box>
            </Stack>

            {/*Component 1 box, Review Stars */}

            <Box sx={{ padding: 4 }}>
              <Rating name="movie-rating" value={Number(movie.rating)} precision={0.2} readOnly size="large" />
            </Box>
          </Box>

          {/* #2 has Actors with no icon */}

          <Box
            sx={{
              backgroundColor: '#262626',
              padding: 2,
              border: '2px',
              borderRadius: '24px',
              borderColor: '#595959',
              borderStyle: 'solid'
            }}
          >
            <Stack direction="row" spacing={7} sx={{ padding: 2 }}>
              {movieCast.map((actor: Actor) => (
                <Stack key={actor.name} direction="column" spacing={1} alignItems="center">
                  <Avatar alt={actor.name} sx={{ width: 60, height: 60 }} />
                  <Typography variant="subtitle1" align="center">
                    {actor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {actor.character}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          {/* #3 has Directors, Country Companies Studios and other information */}

          <Box
            sx={{
              backgroundColor: '#262626',
              padding: 2,
              border: '2px',
              borderRadius: '24px',
              borderColor: '#595959',
              borderStyle: 'solid'
            }}
          >
            <Stack direction="row" spacing={7}>
              <Typography>Directed by {movie.director_name}</Typography>

              <Stack>
                <span>
                  <span style={{ fontWeight: 700 }}>Studio(s):</span> {parseSemicolonSeparatedString(movie.studios).join(', ')}
                </span>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}