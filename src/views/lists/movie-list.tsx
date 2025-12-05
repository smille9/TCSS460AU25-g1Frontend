'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import MovieIcon from '@mui/icons-material/Movie';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { CircularProgress, Stack } from '@mui/material';

// project import
import { IMovieDetailed, IMovieWithPoster } from 'types/movies';
import useUser from 'hooks/useUser';
import { moviesApi } from 'services/moviesApi';
import SearchCard from 'components/SearchCard/SearchCard';

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

        // Fetch movies (poster_url is already included in response)
        const moviePromises = movieIDs.map((id: number) => moviesApi.getByID({ params: { movieId: id } }));
        const responses = await Promise.all(moviePromises);
        const moviesData = responses.map((response) => response.data.data.data[0]);

        setMovies(moviesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        setLoading(false);
      }
    };

    getWatchlist();
  }, [userEmail]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch('/api/watchlist/movies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, action: 'remove' })
      });

      if (response.ok) {
        setMovies((prevMovies) => prevMovies.filter((movie) => movie.movie_id !== id));
      } else {
        console.error('Failed to delete movie from watchlist');
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

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
        <Box sx={{ mt: 3, width: '100%' }}>
          {movies.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Your movies watchlist is empty
              </Typography>
            </Box>
          ) : (
            <Stack direction="column" gap={2}>
              {movies.map((movie) => (
                <SearchCard
                  key={movie.movie_id}
                  contentId={movie.movie_id}
                  contentType="movie"
                  contentData={movie as IMovieDetailed}
                  onDelete={handleDelete}
                  showDelete={true}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </Container>
  );
}
