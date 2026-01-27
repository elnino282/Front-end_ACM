/**
 * Sign Up Main Container Component
 * Enterprise-grade card layout with subtle gradient background
 */

import { GoogleSignUpButton } from "./components/GoogleSignUpButton";
import { SignUpForm } from "./components/SignUpForm";
import { SignUpHeader } from "./components/SignUpHeader";
import { useSignUp } from "./hooks/useSignUp";
import type { SignUpProps } from "./types";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center py-8 px-4">
      {/* Centered Card Container */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8">
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
