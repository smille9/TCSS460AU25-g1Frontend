// project import
import moviesPage from './movies';
import tvPage from './tv';
import tvDetailPage from './tvdetail'

// types
import { NavItemType } from 'types/menu';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [moviesPage, tvPage, tvDetailPage]
};

export default menuItems;
