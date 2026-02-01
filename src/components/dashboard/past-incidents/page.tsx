'use client';

import { useAppState } from '@/context/app-state-provider';
import AlertsView from '@/components/dashboard/shared/alerts-view';
import { useState } from 'react';
import type { Alert } from '@/lib/types';
import AlertDetailsView from '@/components/dashboard/shared/alert-details-view';
import { useAuth } from '@/context/auth-provider';

export default function PastIncidentsPage() {
  const { alerts, alertsLoading } = useAppState();
  const { user } = useAuth();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const pastIncidents = (alerts || []).filter(a => a.status === 'resolved');

  const handleSelectAlert = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const handleBackToList = () => {
    setSelectedAlert(null);
  };
  
  if (selectedAlert) {
    return <AlertDetailsView alert={selectedAlert} onBack={handleBackToList} isAuthority={user?.role === 'authority'} />;
  }

  return (
    <AlertsView alerts={pastIncidents} onSelectAlert={handleSelectAlert} title="Past Incidents" loading={alertsLoading} />
  );
}
