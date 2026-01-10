import { useMemo, useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPassword } from '@/api/auth';

const EYE_ICON_PATH =
    'M10 4.16663C5.83334 4.16663 2.27501 6.73329 0.833344 10.4166C2.27501 14.1 5.83334 16.6666 10 16.6666C14.1667 16.6666 17.725 14.1 19.1667 10.4166C17.725 6.73329 14.1667 4.16663 10 4.16663ZM10 14.5833C7.70001 14.5833 5.83334 12.7166 5.83334 10.4166C5.83334 8.11663 7.70001 6.24996 10 6.24996C12.3 6.24996 14.1667 8.11663 14.1667 10.4166C14.1667 12.7166 12.3 14.5833 10 14.5833ZM10 7.91663C8.61668 7.91663 7.50001 9.03329 7.50001 10.4166C7.50001 11.8 8.61668 12.9166 10 12.9166C11.3833 12.9166 12.5 11.8 12.5 10.4166C12.5 9.03329 11.3833 7.91663 10 7.91663Z';

export function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formError, setFormError] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const resetMutation = useMutation({
        mutationFn: resetPassword,
    });

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setFormError('');

        if (!token) {
            setFormError('Reset link is missing or invalid.');
            return;
        }
        if (newPassword.length < 8) {
            setFormError('Password must be at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setFormError('Passwords do not match.');
            return;
        }

        try {
            await resetMutation.mutateAsync({
                token,
                newPassword,
                confirmPassword,
            });
            setSubmitted(true);
        } catch {
            setFormError('This reset link is invalid or expired.');
        }
    };

    // Simplified: no token validation query, just check if token exists
    const noToken = !token;

    return (
        <div className="bg-white relative min-h-screen flex items-center justify-center">
            <div className="w-[410px] relative">
                <div className="mb-[32px]">
                    <p
                        className="font-['DM_Sans:Bold',sans-serif] font-bold leading-[56px] text-[#2b3674] text-[36px] tracking-[-0.72px] mb-2"
                        style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                        Reset Password
                    </p>
                    <p
                        className="font-['DM_Sans:Regular',sans-serif] font-normal leading-none text-[#a3aed0] text-[16px] tracking-[-0.32px]"
                        style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                        Create a strong new password to secure your account.
                    </p>
                </div>

                {submitted ? (
                    <div className="mb-[16px]">
                        <p
                            className="font-['DM_Sans:Regular',sans-serif] font-normal text-[#2b3674] text-[14px] leading-[20px]"
                            style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                            Your password has been reset. Please sign in again.
                        </p>
                        <Link
                            to="/sign-in"
                            className="inline-block mt-[12px] font-['DM_Sans:Bold',sans-serif] font-bold text-[#3ba55d] text-[14px] hover:underline"
                            style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                            Go to Sign In
                        </Link>
                    </div>
                ) : noToken ? (
                    <div className="mb-[16px]">
                        <p
                            className="font-['DM_Sans:Regular',sans-serif] font-normal text-[#2b3674] text-[14px] leading-[20px]"
                            style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                            Reset link is missing. Please use the link from your email.
                        </p>
                        <Link
                            to="/forgot-password"
                            className="inline-block mt-[12px] font-['DM_Sans:Bold',sans-serif] font-bold text-[#3ba55d] text-[14px] hover:underline"
                            style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                            Request a new link
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-[24px]">
                            <label
                                htmlFor="newPassword"
                                className="font-['DM_Sans:Medium',sans-serif] font-medium leading-none text-[#2b3674] text-[14px] tracking-[-0.28px] mb-[11px]"
                                style={{ fontVariationSettings: "'opsz' 14" }}
                            >
                                <span style={{ fontVariationSettings: "'opsz' 14" }}>New Password</span>
                                <span
                                    className="text-[#4318ff]"
                                    style={{ fontVariationSettings: "'opsz' 14" }}
                                >
                                    *
                                </span>
                            </label>
                            <div className="relative h-[50px] w-full">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="w-full h-full px-[24px] rounded-[16px] border border-[#e0e5f2] border-solid font-['DM_Sans:Regular',sans-serif] font-normal text-[14px] text-[#2b3674] placeholder:text-[#a3aed0] tracking-[-0.28px] focus:outline-none focus:border-[#3ba55d] disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ fontVariationSettings: "'opsz' 14" }}
                                    disabled={resetMutation.isPending}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-[18px] top-1/2 -translate-y-1/2"
                                    aria-pressed={showPassword}
                                >
                                    <svg
                                        className="w-[20px] h-[20px]"
                                        fill="none"
                                        preserveAspectRatio="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <g clipPath="url(#clip0_reset_eye)">
                                            <g></g>
                                            <path d={EYE_ICON_PATH} fill="#A3AED0" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_reset_eye">
                                                <rect fill="white" height="20" width="20" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="mb-[24px]">
                            <label
                                htmlFor="confirmPassword"
                                className="font-['DM_Sans:Medium',sans-serif] font-medium leading-none text-[#2b3674] text-[14px] tracking-[-0.28px] mb-[11px]"
                                style={{ fontVariationSettings: "'opsz' 14" }}
                            >
                                <span style={{ fontVariationSettings: "'opsz' 14" }}>Confirm Password</span>
                                <span
                                    className="text-[#4318ff]"
                                    style={{ fontVariationSettings: "'opsz' 14" }}
                                >
                                    *
                                </span>
                            </label>
                            <div className="relative h-[50px] w-full">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="w-full h-full px-[24px] rounded-[16px] border border-[#e0e5f2] border-solid font-['DM_Sans:Regular',sans-serif] font-normal text-[14px] text-[#2b3674] placeholder:text-[#a3aed0] tracking-[-0.28px] focus:outline-none focus:border-[#3ba55d] disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ fontVariationSettings: "'opsz' 14" }}
                                    disabled={resetMutation.isPending}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-[18px] top-1/2 -translate-y-1/2"
                                    aria-pressed={showConfirmPassword}
                                >
                                    <svg
                                        className="w-[20px] h-[20px]"
                                        fill="none"
                                        preserveAspectRatio="none"
                                        viewBox="0 0 20 20"
                                    >
                                        <g clipPath="url(#clip0_reset_confirm_eye)">
                                            <g></g>
                                            <path d={EYE_ICON_PATH} fill="#A3AED0" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_reset_confirm_eye">
                                                <rect fill="white" height="20" width="20" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {formError ? (
                            <p
                                className="font-['DM_Sans:Regular',sans-serif] font-normal text-[#d14343] text-[13px] mb-[16px]"
                                style={{ fontVariationSettings: "'opsz' 14" }}
                            >
                                {formError}
                            </p>
                        ) : null}

                        <button
                            type="submit"
                            disabled={resetMutation.isPending}
                            className="w-full bg-[#3ba55d] h-[54px] rounded-[16px] flex items-center justify-center px-[8px] py-[10px] hover:bg-[#2F9E44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#3ba55d]"
                        >
                            <p
                                className="font-['DM_Sans:Bold',sans-serif] font-bold leading-none text-[14px] text-center text-white tracking-[-0.28px]"
                                style={{ fontVariationSettings: "'opsz' 14" }}
                            >
                                {resetMutation.isPending ? 'Updating...' : 'Reset Password'}
                            </p>
                        </button>

                        <p
                            className="font-['DM_Sans:Regular',sans-serif] font-normal leading-[26px] text-[#2b3674] text-[14px] text-center tracking-[-0.28px] mt-[28px]"
                            style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                            Remembered your password?{' '}
                            <Link
                                to="/sign-in"
                                className="font-['DM_Sans:Bold',sans-serif] font-bold text-[#3ba55d] cursor-pointer hover:underline"
                                style={{ fontVariationSettings: "'opsz' 14" }}
                            >
                                Sign In
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
