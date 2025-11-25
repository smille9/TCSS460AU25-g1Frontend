'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MovieIcon from '@mui/icons-material/Movie';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Divider, List, CircularProgress } from '@mui/material';

// project import
import { IMovieWithPoster } from 'types/movies';
import { MovieListItem } from 'components/MovieListItem';
import { NoShow } from 'components/TVListItem';
import useUser from 'hooks/useUser';
import { moviesApi } from 'services/moviesApi';

export default function MoviesList() {
  const [movies, setMovies] = React.useState<IMovieWithPoster[]>([]);
  const [loading, setLoading] = React.useState(true);
  const user = useUser();
  const userEmail = user && typeof user !== 'boolean' ? user.email : null;

  React.useEffect(() => {
    if (!userEmail) {
      setLoading(false);
      return;
    }

    const getWatchlist = async () => {
      try {
        const response = await fetch('/api/watchlist/movies');
        if (!response.ok) throw new Error('Failed to fetch watchlist');

        const movieIDs = await response.json();
        if (!movieIDs || movieIDs.length === 0) {
          setMovies([]);
          setLoading(false);
          return;
        }

        // Fetch both movies and posters in parallel
        const [mResponses, pResponses] = await Promise.all([
          Promise.all(movieIDs.map((id: number) => moviesApi.getByID({ params: { movieId: id } }))),
          Promise.all(movieIDs.map((id: number) => moviesApi.getPosterByID(id)))
        ]);

        const moviesData = mResponses.map((response) => response.data.data.data[0]);
        const postersData = pResponses.map((response) => response.data.data.posterUrl);

        // Combine movies with their posters
        const moviesWithPosters: IMovieWithPoster[] = moviesData.map((movie, index) => ({
          ...movie,
          posterUrl: postersData[index]
        }));
        console.log('Movies with posters combined:', moviesWithPosters);
        setMovies(moviesWithPosters);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        setLoading(false);
      }
    };

    getWatchlist();
  }, [userEmail]);
  console.log('Movies with posters:', movies);
  const moviesAsComponents = movies.map((movie, index, movies) => (
    <React.Fragment key={'movie list item: ' + index}>
      <MovieListItem movie={movie} />
      {index < movies.length - 1 && (
        <Divider
          sx={(theme) => ({
            borderColor: 'grey.A800',
            ...theme.applyStyles('dark', {
              borderColor: '#555555'
            })
          })}
          variant="middle"
          component="li"
        />
      )}
    </React.Fragment>
  ));

  if (loading) {
    return (
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container component="main" maxWidth="md">
        <Box sx={{ marginTop: 8, textAlign: 'center' }}>
          <Typography>Please sign in to view your watchlist</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <MovieIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Your Movies Watchlist
        </Typography>
        <Box sx={{ mt: 1 }}>
          <List>{moviesAsComponents.length ? moviesAsComponents : <NoShow />}</List>
        </Box>
      </Box>
    </Container>
  );
}
