'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Box, Stack, Typography, Chip, Card, CardMedia, Rating, Avatar } from '@mui/material';

// project import
import { tvApi } from 'services/tvApi';
import { IShow, ActorObj } from 'types/tv';
import { NoShow } from 'components/TVListItem';
import { WatchlistToggle } from 'components/WatchlistToggle';

export default function TvDetail() {
  const [show, setShow] = React.useState<IShow | undefined>(undefined);

  //Capture Route params
  const { id } = useParams();
  React.useEffect(() => {
    if (!id) return;
    tvApi
      .getByID(Number(id))
      .then((response) => {
        setShow(response.data.data);
        console.dir(response);
      })
      .catch((error) => console.error(error));
  }, [id]);

  //If show is undefined, show empty container
  if (!show) {
    return <NoShow />;
  }

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 1400,
        backgroundImage: `url(${show.backdropURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
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
                image={show.posterURL}
                alt={'name: ' + show.name + '. Original Name: ' + show.originalName}
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
                {show.name} ({show.originalName})
              </Typography>
              <WatchlistToggle id={show.iD} type="tv" />
            </Box>

            {/* Genres*/}
            <Stack direction="row" spacing={1}>
              {show.genres?.map((genre) => (
                <Chip key={genre} label={genre} size="medium" />
              ))}
            </Stack>
            {/* Rating, votes, runtime, and returning,  */}

            <Typography>
              {/* Outer span is to ensure the whole Title:Value stays on one line, inner is to bold the Titles. */}
              <span style={{ whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 700 }}>Rating:</span> {show.tMDbRating}/10
              </span>{' '}
              <span style={{ whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 700 }}>Votes:</span> {show.voteCount}
              </span>{' '}
              <span style={{ whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 700 }}>Runtime:</span> {show.firstAirDate} &rarr; {show.lastAirDate}
              </span>{' '}
              <span style={{ whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 700 }}>Status:</span> {show.status}
              </span>{' '}
              <span style={{ whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 700 }}>Seasons:</span> {show.seasons} <span style={{ fontWeight: 700 }}>Episodes:</span>{' '}
                {show.episodes}
              </span>
            </Typography>

            <Box sx={{ mt: 8 }}>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {show.overview}
              </Typography>
            </Box>
          </Stack>

          {/*Component 1 box, Review Stars */}

          <Box sx={{ padding: 4 }}>
            <Rating name="show-rating" value={show.tMDbRating / 2} precision={0.2} readOnly size="large" />
          </Box>
        </Box>

        {/* #2 has Actors with their icons... */}
        <Box
          sx={{
            backgroundColor: 'lightgrey',
            padding: 2
          }}
        >
          <Stack direction="row" spacing={7} sx={{ padding: 2 }}>
            {show.cast?.map((actor: ActorObj) => (
              <Stack key={actor.name} direction="column" spacing={1} alignItems="center">
                <Avatar src={actor.profileUrl} alt={actor.name} sx={{ width: 60, height: 60 }} />
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
            backgroundColor: 'lightgrey',
            padding: 2
          }}
        >
          <Stack direction="row" spacing={7}>
            <Typography>Created by {show.creators?.join(', ')}</Typography>

            <Stack>
              <span style={{ whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 700 }}>Network(s):</span> {show.networks?.join(', ')}
              </span>
              <span style={{ whiteSpace: 'nowrap' }}>
                <span style={{ fontWeight: 700 }}>Studio(s):</span> {show.studios?.join(', ')}
              </span>
            </Stack>
          </Stack>
        </Box>

        {/* #4 has Reviews*/}
        <Box sx={{ backgroundColor: 'lightgrey', padding: 2 }}>
          Reviews are currently unimplemented. <br />
        </Box>
      </Stack>
    </Box>
  );
}