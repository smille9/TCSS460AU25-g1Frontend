'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Divider, List, CircularProgress } from '@mui/material';

// project import
import { tvApi } from 'services/tvApi';
import { IShow } from 'types/tv';
import { NoShow, TVListItem } from 'components/TVListItem';
import useUser from 'hooks/useUser';

export default function TVList() {
  const [shows, setShows] = React.useState<IShow[]>([]);
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
        const response = await fetch('/api/watchlist/tv');

        if (!response.ok) {
          throw new Error('Failed to fetch TV watchlist');
        }

        const showIDs = await response.json();

        if (!showIDs || showIDs.length === 0) {
          setShows([]);
          setLoading(false);
          return;
        }

        const showPromises = showIDs.map((id: number) => tvApi.getByID(id));
        const responses = await Promise.all(showPromises);
        const showsData = responses.map((response) => response.data.data);

        setShows(showsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching TV watchlist:', error);
        setLoading(false);
      }
    };

    getWatchlist();
  }, [userEmail]);

  const showsAsComponents = shows.map((show, index, shows) => (
    <React.Fragment key={'show list item: ' + index}>
      <TVListItem show={show} />
      {index < shows.length - 1 && (
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
          <LiveTvIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Your TV Shows Watchlist
        </Typography>
        <Box sx={{ mt: 1 }}>
          <List>{showsAsComponents.length ? showsAsComponents : <NoShow />}</List>
        </Box>
      </Box>
    </Container>
  );
}