'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/app-state-provider';
import type { Alert } from '@/lib/types';
import AlertsView from './shared/alerts-view';
import AlertDetailsView from './shared/alert-details-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthorityDashboard() {
  const { alerts, alertsLoading } = useAppState();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  
  const openCases = (alerts || []).filter(a => a.status === 'active' || a.status === 'acknowledged' || a.status === 'in-progress');
  const closedCases = (alerts || []).filter(a => a.status === 'resolved' || a.status === 'closed');

  const handleSelectAlert = (alert: Alert) => {
    setSelectedAlert(alert);
  };

  const handleBackToList = () => {
    setSelectedAlert(null);
  };

  if (selectedAlert) {
    return <AlertDetailsView alert={selectedAlert} onBack={handleBackToList} isAuthority />;
  }

  return (
    <Tabs defaultValue="open" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="open">Open Cases</TabsTrigger>
        <TabsTrigger value="closed">Closed Cases</TabsTrigger>
      </TabsList>
      <TabsContent value="open">
        <AlertsView alerts={openCases} onSelectAlert={handleSelectAlert} title="Open Emergency Cases" loading={alertsLoading} />
      </TabsContent>
      <TabsContent value="closed">
        <AlertsView alerts={closedCases} onSelectAlert={handleSelectAlert} title="Closed Cases" loading={alertsLoading} />
      </TabsContent>
    </Tabs>
  );
}
