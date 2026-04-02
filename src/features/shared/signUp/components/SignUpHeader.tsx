/**
 * Sign Up Header Component
 * Enterprise-grade header with icon and improved typography
 */

import { useI18n } from "@/hooks/useI18n";
import { Leaf } from "lucide-react";

export function SignUpHeader() {
  const { t } = useI18n();
  
  return (
    <div className="text-center mb-6">
      {/* Brand Icon */}
      <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-50 rounded-2xl mb-4">
        <Leaf className="w-7 h-7 text-emerald-600" />
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight mb-2">
        {t('auth.signUp.title')}
      </h1>

      {/* Subtitle */}
      <p className="text-slate-500 text-sm sm:text-base">
        {t('auth.signUp.subtitle')}
      </p>
    </div>
  );
}
