import { useRouter } from 'next/navigation';

import { ListItem, ListItemAvatar, ListItemButton, ListItemText, Avatar } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';

// project import
import { IMovieWithPoster } from 'types/movies';

export function MovieListItem({ movie }: { movie: IMovieWithPoster }) {
  const router = useRouter();

  function onItemClick(movie: IMovieWithPoster) {
    router.push(`/movies/${movie.movie_id}`);
  }

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => onItemClick(movie)}>
        <ListItemAvatar>
          {movie.posterUrl ? (
            <Avatar src={movie.posterUrl} alt={movie.title}>
              <MovieIcon />
            </Avatar>
          ) : (
            <Avatar>
              <MovieIcon />
            </Avatar>
          )}
        </ListItemAvatar>
        <ListItemText
          primary={movie.title}
          secondary={movie.rating}
          slotProps={{
            secondary: { color: 'gray' }
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}
