// project import
import moviesPage from './movies';
import tvPage from './tv';

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [moviesPage, tvPage]
};

export default menuItems;
