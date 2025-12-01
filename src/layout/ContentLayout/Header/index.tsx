//import useConfig from 'hooks/useConfig';
import { Stack } from '@mui/material';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  //const { mode } = useConfig();
  const tempItems = ['Favorites', 'Reviews', 'Watchlist', 'TV Shows', 'Movies'];

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        backgroundColor: '#262626',
        fontWeight: 'bold'
      }}
    >
      <Stack>
        <Link href="#" className={`${styles.link} ${styles.siteNameLink}`}>
          CouchMouse
        </Link>
      </Stack>

      <Stack direction="row" alignItems="center">
        {tempItems.map((item) => (
          <Link key={item} href="#" className={styles.link}>
            {item}
          </Link>
        ))}
      </Stack>
    </Stack>
  );
}