import { useRouter } from 'next/navigation';

import CommentsDisabledIcon from '@mui/icons-material/CommentsDisabled';
import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';

// project import
import { IShow } from 'types/tv';

export function TVListItem({ show }: { show: IShow }) {
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

  function onItemClick(show: IShow) {
    router.push('[ROUTE TO SHOW DETAIL PAGE]');
  }

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => onItemClick(show)}>
        <ListItemAvatar>
          <Avatar alt="Poster" src={show.posterURL} />
        </ListItemAvatar>
        <ListItemText
          primary={show.name}
          secondary={show.tMDbRating}
          slotProps={{
            secondary: { color: 'gray' }
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export function NoShow() {
  return (
    <ListItem>
      <ListItemAvatar>
        <CommentsDisabledIcon />
      </ListItemAvatar>
      <ListItemText primary="No Elements" />
    </ListItem>
  );
}
