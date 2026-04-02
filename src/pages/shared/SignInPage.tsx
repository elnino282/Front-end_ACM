/**
 * Sign In Page
 * Composition-only: delegates all logic to useSignInPage hook
 */

import { SignIn } from '@/features/shared/signIn';
import { useSignInPage } from './hooks';

export function SignInPage() {
  const { isAuthenticated, handleSignIn } = useSignInPage();

  // Don't render signin if already authenticated (redirect will happen via hook)
  if (isAuthenticated) {
    return null;
  }

  return <SignIn onSignIn={handleSignIn} />;
}