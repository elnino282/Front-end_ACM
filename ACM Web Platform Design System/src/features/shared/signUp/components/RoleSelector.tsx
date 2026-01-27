/**
 * Role Selector Component
 * Compact horizontal style for narrow form
 */

import { ShoppingBag, Tractor } from "lucide-react";
import { ROLE_OPTIONS } from "../constants";
import type { UserRole } from "../types";

interface RoleSelectorProps {
  name: string;
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onBlur?: () => void;
  errorMessage?: string;
}

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  FARMER: <Tractor className="w-4 h-4" />,
  BUYER: <ShoppingBag className="w-4 h-4" />,
};

export function RoleSelector({
  name,
  selectedRole,
  onRoleChange,
  onBlur,
  errorMessage,
}: RoleSelectorProps) {
  return (
    <div>
      <p className="text-sm font-medium text-slate-700 mb-2">
        I am a<span className="text-red-500 ml-0.5">*</span>
      </p>

      <div className="grid grid-cols-2 gap-2" role="radiogroup">
        {ROLE_OPTIONS.map((option) => {
          const isSelected = selectedRole === option.value;
          return (
            <label
              key={option.value}
              className={`
                relative flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all
                ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-slate-200 hover:border-slate-300"
                }
              `}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onRoleChange(option.value)}
                onBlur={onBlur}
                className="sr-only"
              />

              <div
                className={`mb-1 ${isSelected ? "text-emerald-600" : "text-slate-400"}`}
              >
                {ROLE_ICONS[option.value]}
              </div>

              <span
                className={`text-xs font-semibold ${isSelected ? "text-emerald-700" : "text-slate-700"}`}
              >
                {option.label}
              </span>

              {isSelected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </label>
          );
        })}
      </div>

      {errorMessage && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
