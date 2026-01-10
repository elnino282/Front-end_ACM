/**
 * Business logic and state management for SignIn feature
 * 
 * This hook handles the sign-in form state and delegates API work to AuthContext.
 */

import { useState } from "react";
import { toast } from "sonner";
import type { SignInProps } from "../types";
import { INITIAL_FORM_STATE, MESSAGES } from "../constants";

interface UseSignInProps {
    onSignIn: SignInProps['onSignIn'];
}

export function useSignIn({ onSignIn }: UseSignInProps) {
    const [email, setEmail] = useState(INITIAL_FORM_STATE.email);
    const [password, setPassword] = useState(INITIAL_FORM_STATE.password);
    const [keepLoggedIn, setKeepLoggedIn] = useState(
        INITIAL_FORM_STATE.keepLoggedIn,
    );
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedEmail = email.trim();

        // Validate form inputs
        if (!trimmedEmail || !password) {
            toast.error("Validation Error", {
                description: "Please enter your email and password",
            });
            return;
        }

        setIsLoading(true);
        try {
            await onSignIn(trimmedEmail, password, keepLoggedIn);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        toast.info(MESSAGES.googleSignIn.title, {
            description: MESSAGES.googleSignIn.description,
        });
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const toggleKeepLoggedIn = () => {
        setKeepLoggedIn((prev) => !prev);
    };

    return {
        // Form state
        email,
        password,
        keepLoggedIn,
        showPassword,
        isLoading,

        // State setters
        setEmail,
        setPassword,

        // Handlers
        handleSubmit,
        handleGoogleSignIn,
        toggleShowPassword,
        toggleKeepLoggedIn,
    };
}
