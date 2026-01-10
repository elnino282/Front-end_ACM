/**
 * Role Selector Component
 * Custom radio buttons for Farmer/Buyer selection
 * Matches Sign In styling patterns
 */

import type { UserRole } from '../types';
import { ROLE_OPTIONS } from '../constants';

interface RoleSelectorProps {
  name: string;
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onBlur?: () => void;
  errorMessage?: string;
}

export function RoleSelector({
  name,
  selectedRole,
  onRoleChange,
  onBlur,
  errorMessage,
}: RoleSelectorProps) {
  const labelId = `${name}-label`;
  const errorId = `${name}-error`;

  return (
    <div className="mb-[24px]">
      <p
        id={labelId}
        className="font-['DM_Sans:Medium',sans-serif] font-medium leading-none text-[#2b3674] text-[14px] tracking-[-0.28px] mb-[11px]"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        <span>I am a</span>
        <span className="text-[#4318ff]">*</span>
      </p>
      <div
        className="flex flex-col gap-[12px]"
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={errorMessage ? errorId : undefined}
        aria-invalid={!!errorMessage}
      >
        {ROLE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-[12px] cursor-pointer group"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedRole === option.value}
              onChange={() => onRoleChange(option.value)}
              onBlur={onBlur}
              className="sr-only"
            />
            {/* Custom Radio Button */}
            <div
              className={`w-[18px] h-[18px] rounded-full border-2 border-solid flex items-center justify-center flex-shrink-0 mt-[1px] transition-colors group-focus-within:ring-2 group-focus-within:ring-[#3ba55d]/30 ${
                selectedRole === option.value
                  ? 'border-[#3ba55d] bg-white'
                  : 'border-[#e0e5f2] bg-white'
              }`}
            >
              {selectedRole === option.value && (
                <div className="w-[10px] h-[10px] rounded-full bg-[#3ba55d]" />
              )}
            </div>
            
            {/* Label and Description */}
            <div className="flex-1">
              <p
                className="font-['DM_Sans:Medium',sans-serif] font-medium leading-[20px] text-[#2b3674] text-[14px] tracking-[-0.28px]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {option.label}
              </p>
              <p
                className="font-['DM_Sans:Regular',sans-serif] font-normal leading-[18px] text-[#a3aed0] text-[12px] tracking-[-0.24px] mt-[2px]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {option.description}
              </p>
            </div>
          </label>
        ))}
      </div>
      {errorMessage && (
        <p
          id={errorId}
          className="mt-[8px] text-[12px] text-[#E53E3E] font-['DM_Sans:Regular',sans-serif]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
