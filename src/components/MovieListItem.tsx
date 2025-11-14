import { useRouter } from 'next/navigation';

import { ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';

// project import
import { IMovie } from 'types/movies';

export function MovieListItem({ movie }: { movie: IMovie }) {
  const router = useRouter();

  // function onItemClick(msg: IMessage) {
  //   console.dir(msg);
  // }

  // function onItemClick({ name }: IMessage) {
  //   router.push('/messages/msgParam/' + name);
  // }

  // function onItemClick(msg: IMessage) {
  //   router.push('/messages/msgQuery?msg=' + JSON.stringify(msg));
  // }

  function onItemClick(movie: IMovie) {
    router.push('[ROUTE TO Movie DETAIL PAGE]');
  }

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => onItemClick(movie)}>
        <ListItemAvatar>{/*movie.poster*/}</ListItemAvatar>
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