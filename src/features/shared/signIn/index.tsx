/**
 * SignIn - Main container component
 * Orchestrates sign-in functionality by composing sub-components with business logic
 */

import type { SignInProps } from "./types";
import { useSignIn } from "./hooks/useSignIn";
import { SignInHeader } from "./components/SignInHeader";
import { GoogleSignInButton } from "./components/GoogleSignInButton";
import { SignInForm } from "./components/SignInForm";


export function SignIn({ onSignIn }: SignInProps) {
    const {
        email,
        password,
        keepLoggedIn,
        showPassword,
        isLoading,
        setEmail,
        setPassword,
        handleSubmit,
        handleGoogleSignIn,
        toggleShowPassword,
        toggleKeepLoggedIn,
    } = useSignIn({ onSignIn });

    return (
        <div
            className="bg-white relative min-h-screen flex items-center justify-center"
            data-name="a.1 Sign in"
        >
            <div className="w-[410px] relative">
                <SignInHeader />

                <GoogleSignInButton onClick={handleGoogleSignIn} />

                <SignInForm
                    email={email}
                    password={password}
                    keepLoggedIn={keepLoggedIn}
                    showPassword={showPassword}
                    isLoading={isLoading}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onToggleKeepLoggedIn={toggleKeepLoggedIn}
                    onToggleShowPassword={toggleShowPassword}
                    onSubmit={handleSubmit}
                />


            </div>
        </div>
    );
}
