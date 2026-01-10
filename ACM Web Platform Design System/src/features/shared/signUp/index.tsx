/**
 * Sign Up Main Container Component
 * Assembles all sub-components with exact spacing
 * Matches Sign In layout structure
 */

import { SignUpProps } from './types';
import { useSignUp } from './hooks/useSignUp';
import { SignUpHeader } from './components/SignUpHeader';
import { GoogleSignUpButton } from './components/GoogleSignUpButton';
import { SignUpForm } from './components/SignUpForm';

export function SignUp({ onSignUp }: SignUpProps) {
  const {
    form,
    showPassword,
    showConfirmPassword,
    handleSubmit,
    handleGoogleSignUp,
    toggleShowPassword,
    toggleShowConfirmPassword,
  } = useSignUp({ onSignUp });

  return (
    <div className="bg-white relative min-h-screen flex items-center justify-center py-[40px] px-[20px]">
      <div className="w-[410px] relative">
        <SignUpHeader />
        
        <GoogleSignUpButton onClick={handleGoogleSignUp} />
        
        <SignUpForm
          form={form}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          onToggleShowPassword={toggleShowPassword}
          onToggleShowConfirmPassword={toggleShowConfirmPassword}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
