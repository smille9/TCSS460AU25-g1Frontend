// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import MovieIcon from '@mui/icons-material/Movie';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { MovieIcon };

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const samplePage: NavItemType = {
  id: 'movies',
  title: <FormattedMessage id="Movie Watchlist" />,
  type: 'group',
  url: '/movies',
  icon: icons.MovieIcon
};

export default samplePage;
