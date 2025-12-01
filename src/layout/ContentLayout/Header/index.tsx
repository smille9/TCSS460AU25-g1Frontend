//import useConfig from 'hooks/useConfig';
import { Stack } from '@mui/material';
import Link from 'next/link';
import styles from './Header.module.css';
import pages from 'menu-items/mainNav';

export default function Header() {
  //const { mode } = useConfig(); // can use for light/dark theming

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
        {pages.children?.map((item) => (
          <Link key={item.id} href={item.url || '#'} className={styles.link}>
            {item.title}
          </Link>
        ))}
      </Stack>
    </Stack>
  );
}