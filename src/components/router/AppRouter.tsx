import { createBrowserRouter, Outlet } from 'react-router-dom';
import LandingPage from '../landing-page/LandingPage';
import SettingsPage from '../settings-page/SettingsPage';
import WeekMenuPage from '../week-menu-page/WeekMenuPage';
import ROUTE from './RoutingConstants';
import Navbar from '../navbar/Navbar';
import FoundDishPage from '../found-dish-page/FoundDishPage';

const appRouter = createBrowserRouter([
  {
    path: ROUTE.LANDING,
    element: (
      <>
        <Outlet /> <Navbar />
      </>
    ),
    children: [
      {
        path: ROUTE.LANDING,
        element: <LandingPage />
      },
      {
        path: ROUTE.SETTINGS,
        element: <SettingsPage />
      },
      {
        path: ROUTE.WEEK_MENU,
        element: <WeekMenuPage />
      },
      {
        path: ROUTE.FOUND_DISH,
        element: <FoundDishPage />
      }
    ]
  }
]);

export default appRouter;
