// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import LiveTvIcon from '@mui/icons-material/LiveTv';

// type
import { NavItemType } from 'types/menu';

// icons
const icons = { LiveTvIcon };

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const samplePage: NavItemType = {
  id: 'tv',
  title: <FormattedMessage id="Television Watchlist" />,
  type: 'group',
  url: '/shows',
  icon: icons.LiveTvIcon
};

export default samplePage;
