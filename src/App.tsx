import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DonationProvider, useDonation } from './context/DonationContext';
import { TrustConfigBanner } from './components/TrustConfigBanner';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { PaymentPage } from './pages/PaymentPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminSectionPage } from './pages/AdminSectionPage';
import { ReceiptModal } from './components/ReceiptModal';

const AppContent: React.FC = () => {
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const { lastDonationReceipt } = useDonation();

  return (
    <div className="app-shell min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Informative placeholder UPI banner */}
      <TrustConfigBanner />

      {/* Strict Section 2 Top Bar Contract */}
      <Header onOpenReceiptModal={() => setReceiptModalOpen(true)} />

      {/* Main Pages */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route
            path="/admin/users"
            element={<AdminSectionPage title="Manage Users" description="Add, update, and review administrator access." section="users" />}
          />
          <Route
            path="/admin/data"
            element={<AdminSectionPage title="Manage Data" description="Add, update, and review donation records and platform data." section="data" />}
          />
          <Route
            path="/admin/reports"
            element={<AdminSectionPage title="View Reports" description="Add, update, and review reports, trends, and insights." section="reports" />}
          />
          <Route
            path="/admin/settings"
            element={<AdminSectionPage title="Settings" description="Add, update, and review trust configurations and preferences." section="settings" />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Receipt Modal */}
      {lastDonationReceipt && (
        <ReceiptModal
          isOpen={receiptModalOpen}
          onClose={() => setReceiptModalOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <DonationProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </DonationProvider>
  );
}
