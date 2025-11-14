'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import EmailIcon from '@mui/icons-material/Email';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Divider, List } from '@mui/material';

// project import
import { moviesApi } from 'services/moviesApi';
import { IMovie } from 'types/movies';
import { MovieListItem } from 'components/MovieListItem';
import { NoShow } from 'components/TVListItem';

export default function MessagesList() {
  // maybe i can make the list a toggle for movies and tv?
  const [shows, setMovies] = React.useState<IMovie[]>([]);

  React.useEffect(() => {
    //This would be data from our service apis (found in ../services) for now we can mock
    moviesApi
      .getAll()
      .then((response) => {
        setMovies(response.data.data);
        console.dir(response);
      })
      .catch((error) => console.error(error));
  }, []);

  const showsAsComponents = shows.map((movie, index, movies) => (
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
          <EmailIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Movies
        </Typography>
        <Box sx={{ mt: 1 }}>
          <List>{showsAsComponents.length ? showsAsComponents : <NoShow />}</List>
        </Box>
      </Box>
    </Container>
  );
}
