// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

/**
 * FSD Layer Hierarchy (top → bottom):
 * app > pages > widgets > features > entities > shared
 * 
 * Rules:
 * - Lower layers CANNOT import from higher layers
 * - Deep path imports (bypassing index.ts) are forbidden
 * - Legacy folders (services/, components/, hooks/) are deprecated
 */

// FSD layer definitions with import restrictions
const FSD_LAYERS = {
    shared: ['entities', 'features', 'widgets', 'pages', 'app'],
    entities: ['features', 'widgets', 'pages', 'app'],
    features: ['widgets', 'pages', 'app'],
    widgets: ['pages', 'app'],
    pages: ['app'],
    app: [],
};

// Build no-restricted-imports patterns
const buildLayerRestrictions = () => {
    const patterns = [];

    for (const [layer, forbidden] of Object.entries(FSD_LAYERS)) {
        for (const target of forbidden) {
            patterns.push({
                group: [`@/${target}/*`, `@${target}/*`, `**/src/${target}/*`],
                message: `FSD violation: '${layer}' layer cannot import from '${target}' layer.`,
            });
        }
    }

    return patterns;
};

// Deep path patterns (bypassing public API)
const DEEP_PATH_PATTERNS = [
    {
        group: ['@/entities/*/api/*', '@/entities/*/model/*', '@/entities/*/ui/*', '@/entities/*/lib/*'],
        message: 'FSD violation: Use public API import (e.g., @/entities/user) instead of deep path.',
    },
    {
        group: ['@/features/*/api/*', '@/features/*/model/*', '@/features/*/ui/*', '@/features/*/lib/*', '@/features/*/*/api/*', '@/features/*/*/model/*'],
        message: 'FSD violation: Use public API import (e.g., @/features/auth) instead of deep path.',
    },
    {
        group: ['@/widgets/*/api/*', '@/widgets/*/model/*', '@/widgets/*/ui/*', '@/widgets/*/lib/*'],
        message: 'FSD violation: Use public API import (e.g., @/widgets/layout) instead of deep path.',
    },
];

// Legacy deprecated patterns
const LEGACY_PATTERNS = [
    {
        group: ['@/services/*', '**/src/services/*'],
        message: 'Deprecated: @/services/* is legacy. Migrate to FSD layers (@/entities, @/features, @/shared/api).',
    },
    {
        group: ['@/hooks/*', '**/src/hooks/*'],
        message: 'Deprecated: @/hooks/* is legacy. Move hooks to appropriate FSD slice or @/shared/lib/hooks.',
    },
];

export default tseslint.config(
    // Base configs
    eslint.configs.recommended,
    ...tseslint.configs.recommended,

    // Global ignores
    {
        ignores: [
            'node_modules/**',
            'build/**',
            'dist/**',
            '*.config.js',
            '*.config.ts',
            'scripts/**',
            'src/generated/**',
        ],
    },

    // Import plugin config
    {
        plugins: {
            import: importPlugin,
        },
        settings: {
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
            },
        },
    },

    // ===========================================
    // ERROR RULES (Blocking - enforced from Day 1)
    // ===========================================

    // FSD Layer violations in core FSD folders
    {
        files: ['src/shared/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': ['error', {
                patterns: [
                    { group: ['@/entities/*', '@entities/*', '**/src/entities/*'], message: 'FSD violation: shared cannot import from entities.' },
                    { group: ['@/features/*', '**/src/features/*'], message: 'FSD violation: shared cannot import from features.' },
                    { group: ['@/widgets/*', '**/src/widgets/*'], message: 'FSD violation: shared cannot import from widgets.' },
                    { group: ['@/pages/*', '**/src/pages/*'], message: 'FSD violation: shared cannot import from pages.' },
                    { group: ['@/app/*', '**/src/app/*'], message: 'FSD violation: shared cannot import from app.' },
                ],
            }],
        },
    },

    {
        files: ['src/entities/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': ['error', {
                patterns: [
                    { group: ['@/features/*', '**/src/features/*'], message: 'FSD violation: entities cannot import from features.' },
                    { group: ['@/widgets/*', '**/src/widgets/*'], message: 'FSD violation: entities cannot import from widgets.' },
                    { group: ['@/pages/*', '**/src/pages/*'], message: 'FSD violation: entities cannot import from pages.' },
                    { group: ['@/app/*', '**/src/app/*'], message: 'FSD violation: entities cannot import from app.' },
                ],
            }],
        },
    },

    {
        files: ['src/features/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': ['error', {
                patterns: [
                    { group: ['@/widgets/*', '**/src/widgets/*'], message: 'FSD violation: features cannot import from widgets.' },
                    { group: ['@/pages/*', '**/src/pages/*'], message: 'FSD violation: features cannot import from pages.' },
                    { group: ['@/app/*', '**/src/app/*'], message: 'FSD violation: features cannot import from app.' },
                ],
            }],
        },
    },

    {
        files: ['src/widgets/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': ['error', {
                patterns: [
                    { group: ['@/pages/*', '**/src/pages/*'], message: 'FSD violation: widgets cannot import from pages.' },
                    { group: ['@/app/*', '**/src/app/*'], message: 'FSD violation: widgets cannot import from app.' },
                ],
            }],
        },
    },

    {
        files: ['src/pages/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': ['error', {
                patterns: [
                    { group: ['@/app/*', '**/src/app/*'], message: 'FSD violation: pages cannot import from app.' },
                ],
            }],
        },
    },

    // Deep path imports (bypassing public API) - ERROR
    {
        files: ['src/**/*.{ts,tsx}'],
        ignores: ['src/entities/**/*', 'src/features/**/*', 'src/widgets/**/*'],
        rules: {
            'no-restricted-imports': ['error', {
                patterns: DEEP_PATH_PATTERNS,
            }],
        },
    },

    // ===========================================
    // ERROR RULES - Legacy Imports (Immediate enforcement)
    // ===========================================

    // Legacy imports from services/, hooks/ - ERROR (no new usage allowed)
    {
        files: ['src/app/**/*.{ts,tsx}', 'src/pages/**/*.{ts,tsx}', 'src/widgets/**/*.{ts,tsx}', 'src/features/**/*.{ts,tsx}', 'src/entities/**/*.{ts,tsx}', 'src/shared/**/*.{ts,tsx}'],
        ignores: ['src/services/**/*'],
        rules: {
            'no-restricted-imports': ['error', {
                patterns: LEGACY_PATTERNS,
            }],
        },
    },

    // TypeScript specific rules
    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
        },
    },
);
