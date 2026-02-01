'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/app-state-provider';
import type { Alert } from '@/lib/types';
import AlertsView from './shared/alerts-view';
import AlertDetailsView from './shared/alert-details-view';

export default function ResponderDashboard() {
  const { alerts, alertsLoading } = useAppState();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const activeAlerts = (alerts || []).filter(a => a.status === 'active' || a.status === 'acknowledged');

  const handleSelectAlert = (alert: Alert) => {
    setSelectedAlert(alert);
  };
  
  const handleBackToList = () => {
    setSelectedAlert(null);
  };

  return (
    <div className="container mx-auto h-full">
      {selectedAlert ? (
        <AlertDetailsView alert={selectedAlert} onBack={handleBackToList} />
      ) : (
        <AlertsView alerts={activeAlerts} onSelectAlert={handleSelectAlert} title="Active Alerts" loading={alertsLoading} />
      )}
    </div>
  );
}
