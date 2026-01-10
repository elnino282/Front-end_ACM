/**
 * SignInForm - Main sign-in form with email, password, and actions
 */

import { Link } from "react-router-dom";
import { FORM_CONFIG } from "../constants";

// SVG path data for icons
const EYE_ICON_PATH = "M10 4.16663C5.83334 4.16663 2.27501 6.73329 0.833344 10.4166C2.27501 14.1 5.83334 16.6666 10 16.6666C14.1667 16.6666 17.725 14.1 19.1667 10.4166C17.725 6.73329 14.1667 4.16663 10 4.16663ZM10 14.5833C7.70001 14.5833 5.83334 12.7166 5.83334 10.4166C5.83334 8.11663 7.70001 6.24996 10 6.24996C12.3 6.24996 14.1667 8.11663 14.1667 10.4166C14.1667 12.7166 12.3 14.5833 10 14.5833ZM10 7.91663C8.61668 7.91663 7.50001 9.03329 7.50001 10.4166C7.50001 11.8 8.61668 12.9166 10 12.9166C11.3833 12.9166 12.5 11.8 12.5 10.4166C12.5 9.03329 11.3833 7.91663 10 7.91663Z";
const CHECKMARK_PATH = "M6.00001 11.17L1.83001 7L0.410011 8.41L6.00001 14L18 2.00001L16.59 0.590012L6.00001 11.17Z";

interface SignInFormProps {
    email: string;
    password: string;
    keepLoggedIn: boolean;
    showPassword: boolean;
    isLoading?: boolean;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onToggleKeepLoggedIn: () => void;
    onToggleShowPassword: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

export function SignInForm({
    email,
    password,
    keepLoggedIn,
    showPassword,
    isLoading = false,
    onEmailChange,
    onPasswordChange,
    onToggleKeepLoggedIn,
    onToggleShowPassword,
    onSubmit,
}: SignInFormProps) {
    return (
        <form onSubmit={onSubmit}>
            {/* Email Field */}
            <div className="mb-[24px]">
                <label
                    htmlFor="email"
                    className="font-['DM_Sans:Medium',sans-serif] font-medium leading-none text-[#2b3674] text-[14px] tracking-[-0.28px] mb-[11px]"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                >
                    <span style={{ fontVariationSettings: "'opsz' 14" }}>Email</span>
                    <span
                        className="text-[#4318ff]"
                        style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                        *
                    </span>
                </label>
                <div className="relative h-[50px] w-full">
                    <input
                        type="email"
                        id="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => onEmailChange(e.target.value)}
                        placeholder={FORM_CONFIG.emailPlaceholder}
                        className="w-full h-full px-[24px] rounded-[16px] border border-[#e0e5f2] border-solid font-['DM_Sans:Regular',sans-serif] font-normal text-[14px] text-[#2b3674] placeholder:text-[#a3aed0] tracking-[-0.28px] focus:outline-none focus:border-[#3ba55d] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontVariationSettings: "'opsz' 14" }}
                        disabled={isLoading}
                        required
                    />
                </div>
            </div>

            {/* Password Field */}
            <div className="mb-[33px]">
                <label
                    htmlFor="password"
                    className="font-['DM_Sans:Medium',sans-serif] font-medium leading-none text-[#2b3674] text-[14px] tracking-[-0.28px] mb-[11px]"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                >
                    <span style={{ fontVariationSettings: "'opsz' 14" }}>Password</span>
                    <span
                        className="text-[#4318ff]"
                        style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                        *
                    </span>
                </label>
                <div className="relative h-[50px] w-full">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        placeholder={FORM_CONFIG.passwordPlaceholder}
                        className="w-full h-full px-[24px] rounded-[16px] border border-[#e0e5f2] border-solid font-['DM_Sans:Regular',sans-serif] font-normal text-[14px] text-[#2b3674] placeholder:text-[#a3aed0] tracking-[-0.28px] focus:outline-none focus:border-[#3ba55d] disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontVariationSettings: "'opsz' 14" }}
                        disabled={isLoading}
                        required
                    />
                    <button
                        type="button"
                        onClick={onToggleShowPassword}
                        className="absolute right-[18px] top-1/2 -translate-y-1/2"
                        aria-pressed={showPassword}
                    >
                        <svg
                            className="w-[20px] h-[20px]"
                            fill="none"
                            preserveAspectRatio="none"
                            viewBox="0 0 20 20"
                        >
                            <g clipPath="url(#clip0_155_1021)">
                                <g></g>
                                <path d={EYE_ICON_PATH} fill="#A3AED0" />
                            </g>
                            <defs>
                                <clipPath id="clip0_155_1021">
                                    <rect fill="white" height="20" width="20" />
                                </clipPath>
                            </defs>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Checkbox and Forgot Password */}
            <div className="flex items-center justify-between mb-[52px]">
                <label className="flex items-center gap-[11px] cursor-pointer">
                    <input
                        type="checkbox"
                        id="keepLoggedIn"
                        className="sr-only peer"
                        checked={keepLoggedIn}
                        onChange={onToggleKeepLoggedIn}
                        disabled={isLoading}
                    />
                    <div
                        className={`w-[18px] h-[18px] rounded-[2px] border border-solid flex items-center justify-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#3ba55d]/30 ${keepLoggedIn
                            ? "bg-[#3ba55d] border-[#3ba55d]"
                            : "bg-white border-[#e0e5f2]"
                            }`}
                    >
                        {keepLoggedIn && (
                            <svg
                                className="w-[16px] h-[16px]"
                                fill="none"
                                preserveAspectRatio="none"
                                viewBox="0 0 16 16"
                            >
                                <g>
                                    <path d={CHECKMARK_PATH} fill="white" />
                                </g>
                            </svg>
                        )}
                    </div>
                    <span
                        className="font-['DM_Sans:Regular',sans-serif] font-normal leading-[20px] text-[#2b3674] text-[14px] tracking-[-0.28px]"
                        style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                        Keep me logged in
                    </span>
                </label>
                <Link
                    to="/forgot-password"
                    className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[20px] text-[#3ba55d] text-[14px] tracking-[-0.28px] hover:underline"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                >
                    Forget password?
                </Link>
            </div>

            {/* Sign In Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#3ba55d] h-[54px] rounded-[16px] flex items-center justify-center px-[8px] py-[10px] hover:bg-[#2F9E44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#3ba55d]"
            >
                <p
                    className="font-['DM_Sans:Bold',sans-serif] font-bold leading-none text-[14px] text-center text-white tracking-[-0.28px]"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                >
                    {isLoading ? "Signing In..." : "Sign In"}
                </p>
            </button>

            {/* Not Registered */}
            <p
                className="font-['DM_Sans:Regular',sans-serif] font-normal leading-[26px] text-[#2b3674] text-[14px] text-center tracking-[-0.28px] mt-[28px]"
                style={{ fontVariationSettings: "'opsz' 14" }}
            >
                Not registered yet?{" "}
                <Link
                    to="/sign-up"
                    className="font-['DM_Sans:Bold',sans-serif] font-bold text-[#3ba55d] cursor-pointer hover:underline"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                >
                    Create an Account
                </Link>
            </p>
        </form>
    );
}
