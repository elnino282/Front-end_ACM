export const preferencesKeys = {
    all: ['preferences'] as const,
    me: () => [...preferencesKeys.all, 'me'] as const,
    update: () => [...preferencesKeys.all, 'update'] as const,
};
