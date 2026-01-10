/**
 * Page-level hook for SignIn page
 * Handles navigation, redirects, and orchestrates the sign-in flow
 */

import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth, type AuthError } from '@/features/auth';

/**
 * Map auth error types to user-friendly toast messages
 */
function getErrorToast(error: AuthError): { title: string; description: string } {
    switch (error.type) {
        case 'invalid_credentials':
            return {
                title: 'Invalid credentials',
                description: 'Please check your email and password.',
            };
        case 'user_locked':
            return {
                title: 'Account locked',
                description: 'Your account is locked. Please contact support.',
            };
        case 'role_missing':
            return {
                title: 'No role assigned',
                description: 'Your account has no role assigned. Please contact support.',
            };
        case 'api_not_found':
            return {
                title: 'Server unavailable',
                description: 'The login service is not responding. Is the backend running on port 8080?',
            };
        case 'network_error':
            return {
                title: 'Connection failed',
                description: 'Cannot reach the server. Please check your network connection.',
            };
        case 'server_error':
        default:
            return {
                title: 'Login failed',
                description: error.message || 'An unexpected error occurred. Please try again.',
            };
    }
}

export function useSignInPage() {
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Track if we've already performed the redirect to prevent infinite loops
    const hasRedirected = useRef(false);

    // Redirect if already authenticated (only once)
    useEffect(() => {
        if (isAuthenticated && user && user.role && !hasRedirected.current) {
            hasRedirected.current = true;
            const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

            if (from && from !== '/sign-in') {
                navigate(from, { replace: true });
            } else {
                navigate(`/${user.role}/dashboard`, { replace: true });
            }
        }
        
        // Reset the redirect flag if user logs out
        if (!isAuthenticated) {
            hasRedirected.current = false;
        }
    }, [isAuthenticated, user, navigate, location]);

    /**
     * Handle sign-in form submission.
     * Uses email + password based login.
     * 
     * @param email - User email
     * @param password - User password
     * @param rememberMe - Whether to persist session
     */
    const handleSignIn = async (email: string, password: string, rememberMe: boolean) => {
        const result = await login(email, password, rememberMe);

        if (result.success) {
            // Mark as redirected to prevent useEffect from also navigating
            hasRedirected.current = true;
            
            toast.success('Welcome back!', {
                description: `Signed in as ${email}`,
            });

            // Use redirectTo from backend response, falling back to stored path or role-based route
            const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

            if (from && from !== '/sign-in') {
                navigate(from, { replace: true });
            } else if (result.redirectTo && result.redirectTo !== '/') {
                // Use the redirectTo path from backend ("/buyer" or "/farmer")
                navigate(`${result.redirectTo}/dashboard`, { replace: true });
            } else if (user?.role) {
                navigate(`/${user.role}/dashboard`, { replace: true });
            } else {
                // Fallback to home
                navigate('/', { replace: true });
            }
        } else if (result.error) {
            const { title, description } = getErrorToast(result.error);
            toast.error(title, { description });
        }
    };

    return {
        isAuthenticated,
        handleSignIn,
    };
}
