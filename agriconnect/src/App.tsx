import { Suspense } from 'react'
import { AppRoutes } from './routes/AppRoutes'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { PageLoader } from './components/shared/Loader'

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <AppRoutes />
      </Suspense>
    </ErrorBoundary>
  )
}
