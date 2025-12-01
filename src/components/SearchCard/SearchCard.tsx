import { Box, Stack, Divider } from '@mui/material';
import Link from 'next/link';
import styles from './SearchCard.module.css';
import { IShow } from 'types/tv';
import { IMovieDetailed } from 'types/movies';

interface SearchCardProps {
  contentId: number;
  contentType: 'movie' | 'tv';
  contentData: IShow | IMovieDetailed;
}

export default function SearchCard({ contentId, contentType, contentData }: SearchCardProps) {
  // all data common to both movies and tv results
  const normalizedData = {
    title: '',
    genres: '',
    posterUrl: '#',
    imgAltText: ''
  };
  let detailsRoute: string;

  // set the route depending on the type
  if (contentType == 'movie') {
    detailsRoute = `/movies/${contentId}`;
  } else if (contentType == 'tv') {
    detailsRoute = `/shows/${contentId}`;
  } else {
    detailsRoute = '#';
  }

  if (contentType === 'tv') {
    let data = contentData as IShow;
    normalizedData.title = data.name;
    normalizedData.genres = data.genres.join(', ');
    normalizedData.posterUrl = data.posterURL;
    normalizedData.imgAltText = `Poster of ${data.name}`;
  } else {
    let data = contentData as IMovieDetailed;
    normalizedData.title = data.title;
    normalizedData.genres = data.genres;
    normalizedData.posterUrl = data.posterUrl;
    normalizedData.imgAltText = `Poster of ${data.title}`;
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
        <Box sx={{
            width: '96px'
          }}
        >
          <Link href={detailsRoute}>
            <img src={normalizedData.posterUrl} alt={normalizedData.imgAltText} width={96} />
          </Link>
        </Box>
        <Stack>
          <Box>
            <h2>
              <Link href={detailsRoute} className={styles.cardLink}>
                {contentType === 'tv' && normalizedData.title}
                {contentType === 'movie' && `${normalizedData.title} (${(contentData as IMovieDetailed).release_year})`}
              </Link>
            </h2>
          </Box>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" variant="middle" sx={{ backgroundColor: 'white' }} flexItem />}
            spacing={2}
          >
            <span>{normalizedData.genres}</span>
            {contentType === 'movie' ? (
              <span>{(contentData as IMovieDetailed).runtime_minutes} minutes</span>
            ) : (
              <span>{(contentData as IShow).seasons} Seasons</span>
            )}
          </Stack>
          {contentType === 'movie' && <Box>Director: {(contentData as IMovieDetailed).director_name}</Box>}
          {contentType === 'tv' && <Box>Networks: {(contentData as IShow).networks.join(', ')}</Box>}
        </Stack>
      </Stack>
    </Box>
  );
}
