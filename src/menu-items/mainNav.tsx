// type
import { FormattedMessage } from 'react-intl';
import { NavItemType } from 'types/menu';

const pages: NavItemType = {
  id: 'main-pages',
  title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: 'browse-movies',
      title: <FormattedMessage id="browse-movies" />,
      type: 'item',
      url: '/movies'
    },
    {
      id: 'browse-tv',
      title: <FormattedMessage id="browse-shows" />,
      type: 'item',
      url: '/shows'
    },
    {
      id: 'search',
      title: <FormattedMessage id="search" />,
      type: 'item',
      url: '/search'
    },
    {
      id: 'tv-shows-watchlist',
      title: <FormattedMessage id="tv-shows-watchlist" />,
      type: 'item',
      url: '/shows-watchlist'
    },
    {
      id: 'movies-watchlist',
      title: <FormattedMessage id="movies-watchlist" />,
      type: 'item',
      url: '/movies-watchlist'
    }
  ]
};

export default pages;
