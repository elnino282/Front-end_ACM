import { I18nProvider } from '@/providers/I18nProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ErrorBoundary, Toaster } from '@/shared/ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app/routes';
import { AuthProvider } from './features/auth/context/AuthContext';
import { AccountLockedModal } from './shared/components/AccountLockedModal';
import { PreferencesProvider } from './shared/contexts';

// Initialize i18n
import '@/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Retry failed queries up to 2 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: false,
      refetchOnMount: true, // Enable fetching on mount to load data properly
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
    },
    mutations: {
      retry: 0, // Don't retry mutations - let user retry manually
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          <ErrorBoundary>
            <AuthProvider>
              <PreferencesProvider>
                <BrowserRouter>
                  <AppRoutes />
                  <Toaster />
                  <AccountLockedModal />
                </BrowserRouter>
              </PreferencesProvider>
            </AuthProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
