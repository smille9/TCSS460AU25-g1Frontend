// type
import { FormattedMessage } from 'react-intl';
import { NavItemType } from 'types/menu';

const pages: NavItemType = {
  id: 'main-pages',
  title: <FormattedMessage id="pages" />,
  type: 'group',
  children: [
    {
      id: 'watchlist',
      title: <FormattedMessage id="watchlist" />,
      type: 'item',
      url: '/watchlist'
    },
    {
      id: 'tv-shows',
      title: <FormattedMessage id="tv-shows" />,
      type: 'item',
      url: '/shows'
    },
    {
      id: 'movies',
      title: <FormattedMessage id="movies" />,
      type: 'item',
      url: '/movies'
    }
  ]
};

export default pages;
