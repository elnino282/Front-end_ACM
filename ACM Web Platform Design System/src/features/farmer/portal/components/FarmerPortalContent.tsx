import { Outlet } from 'react-router-dom';

/**
 * Renders child routes using React Router v6 Outlet
 * All route definitions are now in AppRoutes for proper nested routing
 */
export function FarmerPortalContent() {
  return <Outlet />;
}



