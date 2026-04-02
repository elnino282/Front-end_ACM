/**
 * Sign Up Feature - Constants and Configuration
 */

import type { UserRole } from './types';

export const ROLE_OPTIONS: Array<{ value: UserRole; label: string; description: string }> = [
  {
    value: 'FARMER',
    label: 'Farmer',
    description: 'I want to sell agricultural products',
  },
  {
    value: 'BUYER',
    label: 'Buyer',
    description: 'I want to purchase agricultural products',
  },
];
