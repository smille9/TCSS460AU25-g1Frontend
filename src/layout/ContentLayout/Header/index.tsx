'use state';
//import useConfig from 'hooks/useConfig';
import { Menu, MenuItem, Stack } from '@mui/material';
import Link from 'next/link';
import styles from './Header.module.css';
import pages from 'menu-items/mainNav';
import Profile from 'layout/DashboardLayout/Header/HeaderContent/Profile';
import { useState, MouseEvent } from 'react';

export default function Header() {
  //const { mode } = useConfig(); // can use for light/dark theming
  const regularItems = pages.children?.filter((item) => item.type === 'item') || [];
  const adminGroup = pages.children?.find((item) => item.id === 'group-admin');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <Link href="/" className={`${styles.link} ${styles.siteNameLink}`}>
          CouchMouse
        </Link>
      </Stack>

      <Stack direction="row" alignItems="center">
        {regularItems.map((item) => (
          <Link key={item.id} href={item.url || '#'} className={styles.link}>
            {item.title}
          </Link>
        ))}

        {adminGroup && adminGroup.children && (
          <>
            <span className={styles.link} onClick={handleClick} style={{ cursor: 'pointer' }}>
              {adminGroup.title}
            </span>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              PaperProps={{
                sx: {
                  backgroundColor: '#262626',
                  color: 'white',
                  mt: 0.5
                }
              }}
            >
              {adminGroup.children.map((child) => (
                <MenuItem
                  key={child.id}
                  onClick={handleClose}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <Link
                    href={child.url || '#'}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      width: '100%'
                    }}
                  >
                    {child.title}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </>
        )}

        <Profile />
      </Stack>
    </Stack>
  );
}
