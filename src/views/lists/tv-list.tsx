'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { CircularProgress, Stack } from '@mui/material';

// project import
import { tvApi } from 'services/tvApi';
import { IShow } from 'types/tv';
import useUser from 'hooks/useUser';
import SearchCard from 'components/SearchCard/SearchCard';

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

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch('/api/watchlist/tv', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, action: 'remove' })
      });

      if (response.ok) {
        // Remove the show from local state
        setShows((prevShows) => prevShows.filter((show) => show.iD !== id));
      } else {
        console.error('Failed to delete show from watchlist');
      }
    } catch (error) {
      console.error('Error deleting show:', error);
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
          <LiveTvIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Your TV Shows Watchlist
        </Typography>
        <Box sx={{ mt: 3, width: '100%' }}>
          {shows.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Your TV shows watchlist is empty
              </Typography>
            </Box>
          ) : (
            <Stack direction="column" gap={2}>
              {shows.map((show) => (
                <SearchCard
                  key={show.iD}
                  contentId={show.iD}
                  contentType="tv"
                  contentData={show}
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