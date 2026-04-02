/**
 * Password Policy - Frontend validation utilities.
 * Must match backend rules in PasswordPolicy.java for consistency.
 * 
 * Rules:
 * - Minimum 8 characters
 * - Maximum 64 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character (@$!%*?&)
 */

export const PASSWORD_RULES = {
    minLength: 8,
    maxLength: 64,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
    specialChars: '@$!%*?&',
} as const;

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;

export interface PasswordValidationResult {
    valid: boolean;
    errors: string[];
}

/**
 * Validate a password against the policy.
 * Returns a list of specific error messages for each failed rule.
 */
export function validatePassword(password: string): PasswordValidationResult {
    const errors: string[] = [];
    
    if (!password) {
        errors.push('Password is required');
        return { valid: false, errors };
    }
    
    if (password.length < PASSWORD_RULES.minLength) {
        errors.push(`At least ${PASSWORD_RULES.minLength} characters`);
    }
    
    if (password.length > PASSWORD_RULES.maxLength) {
        errors.push(`Maximum ${PASSWORD_RULES.maxLength} characters`);
    }
    
    if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('At least 1 uppercase letter');
    }
    
    if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('At least 1 lowercase letter');
    }
    
    if (PASSWORD_RULES.requireNumber && !/\d/.test(password)) {
        errors.push('At least 1 number');
    }
    
    if (PASSWORD_RULES.requireSpecial && !/[@$!%*?&]/.test(password)) {
        errors.push(`At least 1 special character (${PASSWORD_RULES.specialChars})`);
    }
    
    return { valid: errors.length === 0, errors };
}

/**
 * Get password strength score (0-4).
 * 0: Very weak, 1: Weak, 2: Fair, 3: Strong, 4: Very strong
 */
export function getPasswordStrength(password: string): number {
    if (!password || password.length === 0) return 0;
    
    let score = 0;
    
    // Length contribution
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    
    return Math.min(score, 4);
}

export const PASSWORD_STRENGTH_LABELS = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'] as const;
