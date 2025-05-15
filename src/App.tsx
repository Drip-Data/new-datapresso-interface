import { BrowserRouter as Router, Routes, Route, Navigate, HashRouter } from 'react-router-dom';
// ThemeProvider is now in main.tsx
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import MainLayout from '@/components/MainLayout';
import DatapressoWorkflowPage from "@/pages/DatapressoWorkflowPage";
import DataQualityPage from "@/pages/DataQualityPage";
import TrainingPage from "@/pages/TrainingPage";
import ExecutionPage from "@/pages/ExecutionPage";
import SettingsPage from "@/pages/SettingsPage";
import DataManagementPage from "@/pages/DataManagementPage";
import HelpPage from "@/pages/HelpPage";
import ApiKeysPage from "@/pages/ApiKeysPage";
// Placeholder page component for pages not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => <div className="p-4 bg-white rounded-lg shadow-md">This is the {title} page. Content to be added.</div>;


function App() {
  return (
    // ThemeProvider has been moved to main.tsx
    <TooltipProvider>
      <HashRouter>
        <Routes>
          {/* Routes using MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/workflow" replace />} />
            <Route path="/workflow" element={<DatapressoWorkflowPage />} />
            <Route path="/data" element={<DataManagementPage />} /> {/* Restored path */}
            <Route path="/data-quality" element={<DataQualityPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/execution" element={<ExecutionPage />} /> {/* Restored path */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/api-keys" element={<ApiKeysPage />} />
            <Route path="/help" element={<HelpPage />} />
            {/* Fallback for unknown routes within the layout */}
            <Route path="*" element={<PlaceholderPage title="404 - 页面未找到" />} />
          </Route>
          {/* Standalone routes for debugging are removed.
              The general fallback below will catch any truly unhandled routes.
              If specific non-MainLayout routes are needed (e.g. login), they'd go here.
          */}
          {/* A general fallback if no other route matches.
              Consider if this is too broad or if 404s should be handled within MainLayout for non-standalone pages.
              For now, keeping a general fallback.
          */}
           {/* <Route path="*" element={
            <div style={{ backgroundColor: 'lightgray', color: 'black', padding: '100px', fontSize: '40px', textAlign: 'center', height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 9998 }}>
              FALLBACK 404 - UNMATCHED ROUTE (TOP LEVEL)
            </div>
          } /> */}
        </Routes>
        <SonnerToaster />
      </HashRouter>
    </TooltipProvider>
  );
}

export default App;