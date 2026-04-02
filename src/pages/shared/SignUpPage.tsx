/**
 * Sign Up Page
 * Composition-only: delegates all logic to useSignUpPage hook
 */

import { SignUp } from '@/features/shared/signUp';
import { useSignUpPage } from './hooks';

export function SignUpPage() {
  const { isAuthenticated, handleSignUp } = useSignUpPage();

  // Don't render signup if already authenticated (redirect will happen via hook)
  if (isAuthenticated) {
    return null;
  }

  return <SignUp onSignUp={handleSignUp} />;
}
