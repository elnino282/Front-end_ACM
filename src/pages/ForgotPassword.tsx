import { forgotPassword } from '@/api/auth';
import { useI18n } from '@/hooks/useI18n';
import { useMutation } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

export function ForgotPasswordPage() {
    const { t } = useI18n();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: forgotPassword,
    });

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            await mutateAsync(email.trim());
        } finally {
            setSubmitted(true);
        }
    };

    return (
        <div className="bg-white relative min-h-screen flex items-center justify-center">
            <div className="w-[410px] relative">
                <div className="mb-[32px]">
                    <p
                        className="font-['DM_Sans:Bold',sans-serif] font-bold leading-[56px] text-[#2b3674] text-[36px] tracking-[-0.72px] mb-2"
                        style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                        {t('auth.forgotPassword.title')}
                    </p>
                    <p
                        className="font-['DM_Sans:Regular',sans-serif] font-normal leading-none text-[#a3aed0] text-[16px] tracking-[-0.32px]"
                        style={{ fontVariationSettings: "'opsz' 14" }}
                    >
                        {t('auth.forgotPassword.subtitle')}
                    </p>
                </div>

                {submitted ? (
                    <div className="mb-[16px]">
                        <p
                            className="font-['DM_Sans:Regular',sans-serif] font-normal text-[#2b3674] text-[14px] leading-[20px]"
                            style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                            {t('auth.forgotPassword.successMessage')}
                        </p>
                        <Link
                            to="/sign-in"
                            className="inline-block mt-[12px] font-['DM_Sans:Bold',sans-serif] font-bold text-[#3ba55d] text-[14px] hover:underline"
                            style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                            {t('auth.forgotPassword.backToSignIn')}
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-[24px]">
                            <label
                                htmlFor="email"
                                className="font-['DM_Sans:Medium',sans-serif] font-medium leading-none text-[#2b3674] text-[14px] tracking-[-0.28px] mb-[11px]"
                                style={{ fontVariationSettings: "'opsz' 14" }}
                            >
                                <span style={{ fontVariationSettings: "'opsz' 14" }}>{t('auth.forgotPassword.email')}</span>
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
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('auth.forgotPassword.emailPlaceholder')}
                                    className="w-full h-full px-[24px] rounded-[16px] border border-[#e0e5f2] border-solid font-['DM_Sans:Regular',sans-serif] font-normal text-[14px] text-[#2b3674] placeholder:text-[#a3aed0] tracking-[-0.28px] focus:outline-none focus:border-[#3ba55d] disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ fontVariationSettings: "'opsz' 14" }}
                                    disabled={isPending}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending || !email.trim()}
                            className="w-full bg-[#3ba55d] h-[54px] rounded-[16px] flex items-center justify-center px-[8px] py-[10px] hover:bg-[#2F9E44] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#3ba55d]"
                        >
                            <p
                                className="font-['DM_Sans:Bold',sans-serif] font-bold leading-none text-[14px] text-center text-white tracking-[-0.28px]"
                                style={{ fontVariationSettings: "'opsz' 14" }}
                            >
                                {isPending ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.sendResetLink')}
                            </p>
                        </button>

                        <p
                            className="font-['DM_Sans:Regular',sans-serif] font-normal leading-[26px] text-[#2b3674] text-[14px] text-center tracking-[-0.28px] mt-[28px]"
                            style={{ fontVariationSettings: "'opsz' 14" }}
                        >
                            {t('auth.forgotPassword.rememberedPassword')}{' '}
                            <Link
                                to="/sign-in"
                                className="font-['DM_Sans:Bold',sans-serif] font-bold text-[#3ba55d] cursor-pointer hover:underline"
                                style={{ fontVariationSettings: "'opsz' 14" }}
                            >
                                {t('auth.signIn.signInButton')}
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
