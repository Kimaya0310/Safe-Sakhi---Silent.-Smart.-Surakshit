'use client';

import React from 'react';
import { useAuth } from '@/context/auth-provider';
import PassengerDashboard from '@/components/dashboard/passenger-dashboard';
import ResponderDashboard from '@/components/dashboard/responder-dashboard';
import AuthorityDashboard from '@/components/dashboard/authority-dashboard';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'passenger':
        return <PassengerDashboard />;
      case 'responder':
        return <ResponderDashboard />;
      case 'authority':
        return <AuthorityDashboard />;
      default:
        return <p>Invalid user role.</p>;
    }
  };

  return <div className="h-full">{renderDashboard()}</div>;
}
