/**
 * Sign Up Form Component
 * Main form with all input fields
 * Matches Sign In form styling exactly
 */

import type { BaseSyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { Controller, type UseFormReturn } from 'react-hook-form';
import type { SignUpFormData } from '../types';
import { RoleSelector } from './RoleSelector';

// SVG path data for icons
const EYE_ICON_PATH = "M10 4.16663C5.83334 4.16663 2.27501 6.73329 0.833344 10.4166C2.27501 14.1 5.83334 16.6666 10 16.6666C14.1667 16.6666 17.725 14.1 19.1667 10.4166C17.725 6.73329 14.1667 4.16663 10 4.16663ZM10 14.5833C7.70001 14.5833 5.83334 12.7166 5.83334 10.4166C5.83334 8.11663 7.70001 6.24996 10 6.24996C12.3 6.24996 14.1667 8.11663 14.1667 10.4166C14.1667 12.7166 12.3 14.5833 10 14.5833ZM10 7.91663C8.61668 7.91663 7.50001 9.03329 7.50001 10.4166C7.50001 11.8 8.61668 12.9166 10 12.9166C11.3833 12.9166 12.5 11.8 12.5 10.4166C12.5 9.03329 11.3833 7.91663 10 7.91663Z";
const CHECKMARK_PATH = "M6.00001 11.17L1.83001 7L0.410011 8.41L6.00001 14L18 2.00001L16.59 0.590012L6.00001 11.17Z";

interface SignUpFormProps {
  form: UseFormReturn<SignUpFormData>;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onToggleShowPassword: () => void;
  onToggleShowConfirmPassword: () => void;
  onSubmit: (event?: BaseSyntheticEvent) => void;
}

export function SignUpForm({
  form,
  showPassword,
  showConfirmPassword,
  onToggleShowPassword,
  onToggleShowConfirmPassword,
  onSubmit,
}: SignUpFormProps) {
  const {
    register,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = form;

  const termsAccepted = watch('termsAccepted');

  const inputClassName = (hasError: boolean, hasTrailingIcon = false) =>
    [
      'w-full h-full px-[24px] rounded-[16px] border border-solid font-[\'DM_Sans:Regular\',sans-serif] font-normal text-[14px] text-[#2b3674] placeholder:text-[#a3aed0] tracking-[-0.28px] focus:outline-none',
      hasTrailingIcon ? 'pr-[52px]' : '',
      hasError ? 'border-[#E53E3E] focus:border-[#E53E3E]' : 'border-[#e0e5f2] focus:border-[#3ba55d]',
      isSubmitting ? 'opacity-70 cursor-not-allowed' : '',
    ]
      .filter(Boolean)
      .join(' ');

  return (
    <form onSubmit={onSubmit} className="w-full">
      {/* Full Name Field */}
      <div className="mb-[24px]">
        <label
          htmlFor="fullName"
          className="font-['DM_Sans:Medium',sans-serif] font-medium leading-none text-[#2b3674] text-[14px] tracking-[-0.28px] mb-[11px]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <span>Full Name</span>
          <span className="text-[#4318ff]">*</span>
        </label>
        <div className="relative h-[50px] w-full">
          <input
            type="text"
            id="fullName"
            autoComplete="name"
            placeholder="John Doe"
            className={inputClassName(!!errors.fullName)}
            style={{ fontVariationSettings: "'opsz' 14" }}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            disabled={isSubmitting}
            {...register('fullName')}
          />
        </div>
        {errors.fullName && (
          <p
            id="fullName-error"
            className="mt-[8px] text-[12px] text-[#E53E3E] font-['DM_Sans:Regular',sans-serif]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="mb-[24px]">
        <label
          htmlFor="email"
          className="font-['DM_Sans:Medium',sans-serif] font-medium leading-none text-[#2b3674] text-[14px] tracking-[-0.28px] mb-[11px]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <span>Email</span>
          <span className="text-[#4318ff]">*</span>
        </label>
        <div className="relative h-[50px] w-full">
          <input
            type="email"
            id="email"
            autoComplete="email"
            placeholder="john.doe@example.com"
            className={inputClassName(!!errors.email)}
            style={{ fontVariationSettings: "'opsz' 14" }}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={isSubmitting}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p
            id="email-error"
            className="mt-[8px] text-[12px] text-[#E53E3E] font-['DM_Sans:Regular',sans-serif]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone Number Field */}
      <div className="mb-[24px]">
        <label
          htmlFor="phoneNumber"
          className="font-['DM_Sans:Medium',sans-serif] font-medium leading-none text-[#2b3674] text-[14px] tracking-[-0.28px] mb-[11px]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <span>Phone Number</span>
        </label>
        <div className="relative h-[50px] w-full">
          <input
            type="tel"
            id="phoneNumber"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+84 123 456 789"
            className={inputClassName(!!errors.phoneNumber)}
            style={{ fontVariationSettings: "'opsz' 14" }}
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
            disabled={isSubmitting}
            {...register('phoneNumber')}
          />
        </div>
        {errors.phoneNumber && (
          <p
            id="phoneNumber-error"
            className="mt-[8px] text-[12px] text-[#E53E3E] font-['DM_Sans:Regular',sans-serif]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      {/* Role Selector */}
      <Controller
        control={control}
        name="role"
        render={({ field }) => (
          <RoleSelector
            name={field.name}
            selectedRole={field.value ?? 'FARMER'}
            onRoleChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={errors.role?.message}
          />
        )}
      />

      {/* Password Field */}
      <div className="mb-[24px]">
        <label
          htmlFor="password"
          className="font-['DM_Sans:Medium',sans-serif] font-medium leading-none text-[#2b3674] text-[14px] tracking-[-0.28px] mb-[11px]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <span>Password</span>
          <span className="text-[#4318ff]">*</span>
        </label>
        <div className="relative h-[50px] w-full">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            className={inputClassName(!!errors.password, true)}
            style={{ fontVariationSettings: "'opsz' 14" }}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            disabled={isSubmitting}
            {...register('password')}
          />
          <button
            type="button"
            onClick={onToggleShowPassword}
            className="absolute right-[18px] top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
            aria-label="Toggle password visibility"
            aria-pressed={showPassword}
          >
            <svg
              className="w-[20px] h-[20px]"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 20 20"
            >
              <g clipPath="url(#clip0_password)">
                <g></g>
                <path d={EYE_ICON_PATH} fill="#A3AED0" />
              </g>
              <defs>
                <clipPath id="clip0_password">
                  <rect fill="white" height="20" width="20" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
        {errors.password && (
          <p
            id="password-error"
            className="mt-[8px] text-[12px] text-[#E53E3E] font-['DM_Sans:Regular',sans-serif]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="mb-[24px]">
        <label
          htmlFor="confirmPassword"
          className="font-['DM_Sans:Medium',sans-serif] font-medium leading-none text-[#2b3674] text-[14px] tracking-[-0.28px] mb-[11px]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <span>Confirm Password</span>
          <span className="text-[#4318ff]">*</span>
        </label>
        <div className="relative h-[50px] w-full">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            className={inputClassName(!!errors.confirmPassword, true)}
            style={{ fontVariationSettings: "'opsz' 14" }}
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            disabled={isSubmitting}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={onToggleShowConfirmPassword}
            className="absolute right-[18px] top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
            aria-label="Toggle confirm password visibility"
            aria-pressed={showConfirmPassword}
          >
            <svg
              className="w-[20px] h-[20px]"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 20 20"
            >
              <g clipPath="url(#clip0_confirm_password)">
                <g></g>
                <path d={EYE_ICON_PATH} fill="#A3AED0" />
              </g>
              <defs>
                <clipPath id="clip0_confirm_password">
                  <rect fill="white" height="20" width="20" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
        {errors.confirmPassword && (
          <p
            id="confirmPassword-error"
            className="mt-[8px] text-[12px] text-[#E53E3E] font-['DM_Sans:Regular',sans-serif]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms and Conditions Checkbox */}
      <div className="mb-[33px]">
        <label className="flex items-start gap-[11px] cursor-pointer">
          <input
            type="checkbox"
            id="termsAccepted"
            className="sr-only peer"
            disabled={isSubmitting}
            aria-invalid={!!errors.termsAccepted}
            aria-describedby={errors.termsAccepted ? 'termsAccepted-error' : undefined}
            {...register('termsAccepted')}
          />
          <div
            className={`w-[18px] h-[18px] rounded-[2px] border border-solid flex items-center justify-center transition-colors flex-shrink-0 mt-[1px] peer-focus-visible:ring-2 peer-focus-visible:ring-[#3ba55d]/30 ${termsAccepted
              ? 'bg-[#3ba55d] border-[#3ba55d]'
              : 'bg-white border-[#e0e5f2]'
              }`}
          >
            {termsAccepted && (
              <svg
                className="w-[16px] h-[16px]"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path d={CHECKMARK_PATH} fill="white" />
              </svg>
            )}
          </div>
          <span
            className="font-['DM_Sans:Regular',sans-serif] font-normal leading-[20px] text-[#2b3674] text-[14px] tracking-[-0.28px]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            I agree to the{' '}
            <span className="font-['DM_Sans:Bold',sans-serif] font-bold text-[#3ba55d] hover:underline">
              Terms and Conditions
            </span>{' '}
            and{' '}
            <span className="font-['DM_Sans:Bold',sans-serif] font-bold text-[#3ba55d] hover:underline">
              Privacy Policy
            </span>
            <span className="text-[#4318ff]">*</span>
          </span>
        </label>
        {errors.termsAccepted && (
          <p
            id="termsAccepted-error"
            className="mt-[8px] text-[12px] text-[#E53E3E] font-['DM_Sans:Regular',sans-serif]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {errors.termsAccepted.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#3ba55d] h-[54px] rounded-[16px] flex items-center justify-center gap-[10px] px-[8px] py-[10px] hover:bg-[#2F9E44] transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#3ba55d]"
        aria-busy={isSubmitting}
      >
        {isSubmitting && (
          <span className="w-[16px] h-[16px] border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
        )}
        <span
          className="font-['DM_Sans:Bold',sans-serif] font-bold leading-none text-[14px] text-center text-white tracking-[-0.28px]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </span>
      </button>

      {/* Already have account link */}
      <p
        className="font-['DM_Sans:Regular',sans-serif] font-normal leading-[26px] text-[#2b3674] text-[14px] text-center tracking-[-0.28px] mt-[28px]"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        Already have an account?{' '}
        <Link
          to="/sign-in"
          className="font-['DM_Sans:Bold',sans-serif] font-bold text-[#3ba55d] cursor-pointer hover:underline"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          Sign In
        </Link>
      </p>
    </form>
  );
}
