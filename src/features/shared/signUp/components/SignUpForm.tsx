/**
 * Sign Up Form Component
 * Compact single-column layout matching Sign In style
 */

import { useI18n } from "@/hooks/useI18n";
import { Eye, EyeOff } from "lucide-react";
import type { BaseSyntheticEvent } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import type { SignUpFormData } from "../types";
import { RoleSelector } from "./RoleSelector";

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
  const { t } = useI18n();
  const {
    register,
    control,
    formState: { errors, isSubmitting },
  } = form;

  const inputClass = (hasError: boolean) => `
    w-full h-12 px-4 rounded-xl border text-sm text-slate-700 placeholder:text-slate-400
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500
    disabled:bg-slate-50 disabled:text-slate-400
    ${hasError ? "border-red-300" : "border-slate-200 hover:border-slate-300"}
  `;

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md mx-auto space-y-4">
      {/* Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {t('auth.signUp.fullName')}<span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          autoComplete="name"
          placeholder={t('auth.signUp.fullNamePlaceholder')}
          className={inputClass(!!errors.fullName)}
          disabled={isSubmitting}
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {t('auth.signUp.email')}<span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          type="email"
          id="email"
          autoComplete="email"
          placeholder={t('auth.signUp.emailPlaceholder')}
          className={inputClass(!!errors.email)}
          disabled={isSubmitting}
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {t('auth.signUp.phoneNumber')}{" "}
          <span className="text-slate-400 font-normal">({t('common.optional')})</span>
        </label>
        <input
          type="tel"
          id="phoneNumber"
          autoComplete="tel"
          placeholder={t('auth.signUp.phoneNumberPlaceholder')}
          className={inputClass(!!errors.phoneNumber)}
          disabled={isSubmitting}
          {...register("phoneNumber")}
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-xs text-red-500">
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
            selectedRole={field.value ?? "FARMER"}
            onRoleChange={field.onChange}
            onBlur={field.onBlur}
            errorMessage={errors.role?.message}
          />
        )}
      />

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {t('auth.signUp.password')}<span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="new-password"
            placeholder={t('auth.signUp.passwordPlaceholder')}
            className={`${inputClass(!!errors.password)} pr-12`}
            disabled={isSubmitting}
            {...register("password")}
          />
          <button
            type="button"
            onClick={onToggleShowPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            aria-label={showPassword ? t('auth.signIn.hidePassword') : t('auth.signIn.showPassword')}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-slate-700 mb-1.5"
        >
          {t('auth.signUp.confirmPassword')}<span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            autoComplete="new-password"
            placeholder={t('auth.signUp.confirmPasswordPlaceholder')}
            className={`${inputClass(!!errors.confirmPassword)} pr-12`}
            disabled={isSubmitting}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={onToggleShowConfirmPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            aria-label={showConfirmPassword ? t('auth.signIn.hidePassword') : t('auth.signIn.showPassword')}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="pt-2">
        <Controller
          control={control}
          name="termsAccepted"
          render={({ field: { onChange, value, ref } }) => (
            <div className="flex items-start gap-3">
              <button
                type="button"
                ref={ref}
                onClick={() => onChange(!value)}
                disabled={isSubmitting}
                style={{
                  backgroundColor: value === true ? "#10b981" : "#ffffff",
                  borderColor: value === true ? "#10b981" : errors.termsAccepted ? "#f87171" : "#cbd5e1",
                }}
                className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 hover:border-slate-400"
                aria-checked={value === true}
                role="checkbox"
              >
                {value === true && (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#ffffff"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <span
                className="text-sm text-slate-600 leading-relaxed cursor-pointer"
                onClick={() => onChange(!value)}
              >
                {t('auth.signUp.termsPrefix')}{" "}
                <Link
                  to="/terms"
                  className="text-emerald-600 font-medium hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t('auth.signUp.termsLink')}
                </Link>{" "}
                {t('common.and')}{" "}
                <Link
                  to="/privacy"
                  className="text-emerald-600 font-medium hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t('auth.signUp.privacyLink')}
                </Link>
                <span className="text-red-500 ml-0.5">*</span>
              </span>
            </div>
          )}
        />
        {errors.termsAccepted && (
          <p className="mt-1 text-xs text-red-500 ml-8">
            {errors.termsAccepted.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full h-12 rounded-xl font-semibold text-sm text-white mt-2
          flex items-center justify-center gap-2 transition-all
          focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
          ${isSubmitting ? "bg-emerald-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}
        `}
      >
        {isSubmitting && (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {isSubmitting ? t('auth.signUp.creatingAccount') : t('auth.signUp.createAccount')}
      </button>

      {/* Sign In Link */}
      <p className="text-sm text-slate-600 text-center pt-4">
        {t('auth.signUp.hasAccount')}{" "}
        <Link
          to="/sign-in"
          className="text-emerald-600 font-semibold hover:underline"
        >
          {t('auth.signUp.signIn')}
        </Link>
      </p>
    </form>
  );
}
