import { Box, Stack, Divider } from '@mui/material';
import Link from 'next/link';
import styles from './SearchCard.module.css';

interface SearchCardProps {
  title: string;
  year: number;
  genres: string;
  parental: string;
  runtime: number;
  director: string;
  posterImg: string;
  imgAltText: string;
  contentId: number;
  contentType: 'movie' | 'tv';
}

export default function SearchCard({
  title,
  year,
  genres,
  parental,
  runtime,
  director,
  posterImg,
  imgAltText,
  contentId,
  contentType
}: SearchCardProps) {
  let detailsRoute: string;

  if (contentType == 'movie') {
    detailsRoute = `/movies/${contentId}`;
  } else if (contentType == 'tv') {
    detailsRoute = `/show/${contentId}`;
  } else {
    detailsRoute = '#';
  }

  return (
    <Box
      sx={{
        color: '#efefef',
        backgroundColor: '#262626',
        borderRadius: '24px',
        border: '1px solid #595959',
        padding: '16px'
      }}
    >
      <Stack direction="row" gap="8px">
        <Box>
          <Link href={detailsRoute}>
            <img src={posterImg} alt={imgAltText} width={96} />
          </Link>
        </Box>
        <Stack>
          <Box>
            <h2>
              <Link href={detailsRoute} className={styles.cardLink}>
                {title} ({year})
              </Link>
            </h2>
          </Box>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" variant="middle" sx={{ backgroundColor: 'white' }} flexItem />}
            spacing={2}
          >
            <span>{genres}</span>
            <span>Rated {parental}</span>
            <span>{runtime} minutes</span>
          </Stack>
          <Box>Director: {director}</Box>
        </Stack>
      </Stack>
    </Box>
  );
}
