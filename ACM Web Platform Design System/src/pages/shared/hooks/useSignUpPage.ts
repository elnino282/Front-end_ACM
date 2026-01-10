/**
 * Page-level hook for SignUp page
 * Handles navigation, redirects, and orchestrates the sign-up flow
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth';
import { useAuthSignUp } from '@/entities/session';
import type { SignUpFormData } from '@/features/shared/signUp/types';

export function useSignUpPage() {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const signUpMutation = useAuthSignUp();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

            if (from && from !== '/sign-up') {
                navigate(from, { replace: true });
            } else {
                navigate(`/${user.role}/dashboard`, { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate, location]);

    const handleSignUp = async (formData: SignUpFormData) => {
        try {
            const email = formData.email.trim();
            const fullName = formData.fullName.trim();
            const phone = formData.phoneNumber.trim();

            // Call the sign up API
            await signUpMutation.mutateAsync({
                username: email,
                email,
                fullName,
                phone: phone.length ? phone : undefined,
                password: formData.password,
                role: formData.role,
            });

            // Show success message
            toast.success('Account created successfully!', {
                description: `Welcome, ${formData.fullName}!`,
            });

            // Redirect back to sign in after successful registration
            navigate('/sign-in', { replace: true });
        } catch (error: any) {
            // Handle API errors
            const errorMessage =
                error?.response?.data?.message || error?.message || 'Failed to create account';

            toast.error('Sign Up Failed', {
                description: errorMessage,
            });

            console.error('Sign up error:', error);
        }
    };

    return {
        isAuthenticated,
        handleSignUp,
    };
}
