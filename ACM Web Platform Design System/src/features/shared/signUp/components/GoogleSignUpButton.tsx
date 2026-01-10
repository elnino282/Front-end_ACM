/**
 * Google Sign Up Button Component
 * OAuth integration with separator
 * Matches Sign In Google button styling
 */

interface GoogleSignUpButtonProps {
  onClick: () => void;
}

export function GoogleSignUpButton({ onClick }: GoogleSignUpButtonProps) {
  return (
    <>
      {/* Google Sign Up Button */}
      <button
        type="button"
        onClick={onClick}
        className="mb-[52px] bg-[#f4f7fe] h-[54px] rounded-[16px] flex items-center justify-center gap-[12px] w-full px-[8px] py-[10px] hover:bg-[#e9eef9] transition-colors"
      >
        <div className="w-[19px] h-[19px] flex-shrink-0 relative">
          <svg
            className="absolute left-0 top-0 w-[19px] h-[19px]"
            fill="none"
            viewBox="0 0 19 19"
          >
            <g clipPath="url(#clip0_2007_5136)">
              <path d="M18.1713 8.36788H17.5001V8.33329H10.0001V11.6666H14.7096C14.0225 13.6069 12.1763 15 10.0001 15C7.23882 15 5.00007 12.7612 5.00007 9.99996C5.00007 7.23871 7.23882 4.99996 10.0001 4.99996C11.2746 4.99996 12.4342 5.48079 13.3171 6.26621L15.6742 3.90913C14.1859 2.52204 12.1951 1.66663 10.0001 1.66663C5.39799 1.66663 1.66675 5.39788 1.66675 9.99996C1.66675 14.602 5.39799 18.3333 10.0001 18.3333C14.6022 18.3333 18.3334 14.602 18.3334 9.99996C18.3334 9.44121 18.2759 8.89579 18.1713 8.36788Z" fill="#4285F4" />
              <path d="M2.6275 6.12121L5.36542 8.12913C6.10625 6.29496 7.90042 4.99996 10.0004 4.99996C11.2754 4.99996 12.4346 5.48079 13.3175 6.26621L15.6746 3.90913C14.1863 2.52204 12.1954 1.66663 10.0004 1.66663C6.79917 1.66663 4.02334 3.47371 2.6275 6.12121Z" fill="#34A853" />
              <path d="M10.0004 18.3333C12.1525 18.3333 14.1083 17.5095 15.5871 16.1712L13.0079 13.9875C12.1431 14.6279 11.0864 15.0008 10.0004 15C7.83294 15 5.99211 13.6179 5.29878 11.6891L2.58211 13.7829C3.96044 16.4816 6.76044 18.3333 10.0004 18.3333Z" fill="#FBBC05" />
              <path d="M18.1713 8.36796H17.5V8.33337H10V11.6667H14.7096C14.3809 12.5902 13.7889 13.3972 13.0067 13.9879L13.0079 13.9871L15.5871 16.1709C15.4046 16.3363 18.3333 14.1667 18.3333 10C18.3333 9.44129 18.2758 8.89587 18.1713 8.36796Z" fill="#EA4335" />
            </g>
            <defs>
              <clipPath id="clip0_2007_5136">
                <rect
                  width="18"
                  height="18"
                  fill="white"
                  transform="translate(0.5 0.5)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>
        <p
          className="font-['DM_Sans:Medium',sans-serif] font-medium leading-none text-[14px] text-center text-[#2b3674] tracking-[-0.28px]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          Sign up with Google
        </p>
      </button>

      {/* Separator "or" */}
      <div className="flex items-center gap-[24px] mb-[33px]">
        <div className="flex-1 h-[1px] bg-[#e0e5f2]" />
        <p
          className="font-['DM_Sans:Regular',sans-serif] font-normal leading-none text-[#a3aed0] text-[14px] tracking-[-0.28px]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          or
        </p>
        <div className="flex-1 h-[1px] bg-[#e0e5f2]" />
      </div>
    </>
  );
}
