/**
 * Sign Up Business Logic Hook
 * Manages form state, validation, and API integration
 * Matches Sign In hook pattern
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { SignUpFormSchema, type SignUpFormData, type SignUpProps } from '../types';

export function useSignUp({ onSignUp }: SignUpProps) {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpFormSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      role: 'FARMER',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  });

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSignUp(values);
    } catch (error) {
      console.error('Sign up error:', error);
    }
  });

  const handleGoogleSignUp = () => {
    toast.info('Google Sign Up', {
      description: 'Google OAuth integration coming soon!',
    });
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return {
    form,
    showPassword,
    showConfirmPassword,
    handleSubmit,
    handleGoogleSignUp,
    toggleShowPassword,
    toggleShowConfirmPassword,
  };
}
