/**
 * Sign Up Header Component
 * Displays "Create Account" title and subtitle
 * Matches Sign In header styling exactly
 */

export function SignUpHeader() {
  return (
    <div className="mb-[48px]">
      <p
        className="font-['DM_Sans:Bold',sans-serif] font-bold leading-[56px] text-[#2b3674] text-[36px] tracking-[-0.72px] mb-2"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        Create Account
      </p>
      <p
        className="font-['DM_Sans:Regular',sans-serif] font-normal leading-none text-[#a3aed0] text-[16px] tracking-[-0.32px]"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        Enter your details to create your account!
      </p>
    </div>
  );
}
