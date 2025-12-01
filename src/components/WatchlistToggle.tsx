import * as React from 'react';
import { IconButton, CircularProgress } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface WatchlistToggleProps {
  id: number;
  type: 'movies' | 'tv';
  onToggle?: (isFavorited: boolean) => void;
}

export function WatchlistToggle({ id, type, onToggle }: WatchlistToggleProps) {
  const [isFavorited, setIsFavorited] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true);

  // Check if item is in watchlist on mount
  React.useEffect(() => {
    const checkWatchlist = async () => {
      try {
        const response = await fetch(`/api/watchlist/${type}`);
        if (response.ok) {
          const watchlist = await response.json();
          setIsFavorited(watchlist.includes(id));
        }
      } catch (error) {
        console.error('Error checking watchlist:', error);
      } finally {
        setLoading(false);
      }
    };

    checkWatchlist();
  }, [id, type]);

  const handleToggle = async () => {
    const action = isFavorited ? 'remove' : 'add';

    try {
      setLoading(true);
      const response = await fetch(`/api/watchlist/${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action })
      });

      if (response.ok) {
        const newFavoritedState = !isFavorited;
        setIsFavorited(newFavoritedState);
        onToggle?.(newFavoritedState);
      } else {
        console.error('Failed to update watchlist');
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <IconButton disabled>
        <CircularProgress size={24} />
      </IconButton>
    );
  }

  return (
    <IconButton
      onClick={handleToggle}
      aria-label={isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}
      size="large"
      sx={{
        color: isFavorited ? 'red' : 'grey.500',
        '&:hover': {
          color: 'red'
        }
      }}
    >
      {isFavorited ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
    </IconButton>
  );
}