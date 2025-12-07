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
    },
    {
      id: 'group-admin',
      title: <FormattedMessage id="group-admin" />,
      type: 'group',
      children: [
        {
          id: 'add-movie',
          title: <FormattedMessage id="add-movie" />,
          type: 'item',
          url: '/movies/create'
        },
        {
          id: 'add-show',
          title: <FormattedMessage id="add-show" />,
          type: 'item',
          url: '/shows/create'
        },
        {
          id: 'delete-movie',
          title: <FormattedMessage id="delete-movie" />,
          type: 'item',
          url: '/movies/delete'
        },
        {
          id: 'delete-show',
          title: <FormattedMessage id="delete-show" />,
          type: 'item',
          url: '/shows/delete'
        }
      ]
    }
  ]
};

export default pages;
