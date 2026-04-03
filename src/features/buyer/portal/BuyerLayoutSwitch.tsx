import { Outlet } from 'react-router-dom';
import { BuyerPublicLayout } from './BuyerPublicLayout';
import { BuyerPortalWithShell } from './BuyerPortalWithShell';
import { useBuyerLayoutMode } from './hooks/useBuyerLayoutMode';

/**
 * BuyerLayoutSwitch — renders either PublicLayout or AppShell
 * based on the user's saved layout preference.
 * Toggle button is embedded in both layout headers.
 */
export function BuyerLayoutSwitch() {
  const { mode, toggle } = useBuyerLayoutMode();

  if (mode === 'shell') {
    return <BuyerPortalWithShell onLayoutToggle={toggle} layoutMode={mode} />;
  }

  return <BuyerPublicLayout onLayoutToggle={toggle} layoutMode={mode} />;
}
