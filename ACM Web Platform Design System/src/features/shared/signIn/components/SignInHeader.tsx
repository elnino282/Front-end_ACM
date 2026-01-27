/**
 * SignInHeader - Header section with title and subtitle
 */

import { useI18n } from '@/hooks/useI18n';

export function SignInHeader() {
    const { t } = useI18n();
    
    return (
        <div className="mb-[48px]">
            <p
                className="font-['DM_Sans:Bold',sans-serif] font-bold leading-[56px] text-[#2b3674] text-[36px] tracking-[-0.72px] mb-2"
                style={{ fontVariationSettings: "'opsz' 14" }}
            >
                {t('auth.signIn.title')}
            </p>
            <p
                className="font-['DM_Sans:Regular',sans-serif] font-normal leading-none text-[#a3aed0] text-[16px] tracking-[-0.32px]"
                style={{ fontVariationSettings: "'opsz' 14" }}
            >
                {t('auth.signIn.subtitle')}
            </p>
        </div>
    );
}
