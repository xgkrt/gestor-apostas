import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppSidebar } from './components/AppSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from './components/ErrorBoundary';
import { 
  DashboardSkeleton, 
  BankrollsSkeleton, 
  BetsSkeleton 
} from '@/components/ui/loading-skeleton';
import './index.css';

// Code Splitting: Lazy load pages for better initial bundle size
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Bets = lazy(() => import('./pages/Bets'));
const NovaAposta = lazy(() => import('./pages/NovaAposta'));
const Bankrolls = lazy(() => import('./pages/Bankrolls'));
const MonthlyClosing = lazy(() => import('./pages/MonthlyClosing'));
const Settings = lazy(() => import('./pages/Settings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-border/80 bg-background/82 px-4 shadow-[0_8px_18px_-16px_rgba(15,23,42,0.45)] backdrop-blur-lg dark:border-border/90 dark:bg-background/82 dark:shadow-[0_14px_30px_-20px_rgba(2,6,23,0.95)]">
                  <SidebarTrigger />
                </header>
                <main className="flex flex-1 flex-col gap-4 bg-transparent p-8">
                  {/* Suspense Boundaries: Show loading state while pages load */}
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <Suspense fallback={<DashboardSkeleton />}>
                          <Dashboard />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/apostas" 
                      element={
                        <Suspense fallback={<BetsSkeleton />}>
                          <Bets />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/nova-aposta" 
                      element={
                        <Suspense fallback={<BetsSkeleton />}>
                          <NovaAposta />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/bancas" 
                      element={
                        <Suspense fallback={<BankrollsSkeleton />}>
                          <Bankrolls />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/fechamento" 
                      element={
                        <Suspense fallback={<DashboardSkeleton />}>
                          <MonthlyClosing />
                        </Suspense>
                      } 
                    />
                    <Route 
                      path="/configuracoes" 
                      element={
                        <Suspense fallback={<BankrollsSkeleton />}>
                          <Settings />
                        </Suspense>
                      } 
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </SidebarInset>
              <Toaster />
            </SidebarProvider>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App
