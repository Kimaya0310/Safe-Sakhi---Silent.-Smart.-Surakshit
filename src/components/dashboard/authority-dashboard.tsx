'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/app-state-provider';
import type { Alert } from '@/lib/types';
import AlertsView from './shared/alerts-view';
import AlertDetailsView from './shared/alert-details-view';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AuthorityDashboard() {
  const { alerts } = useAppState();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  
  const activeAlerts = alerts.filter(a => a.status === 'active' || a.status === 'acknowledged');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');

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
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="active">Active Cases</TabsTrigger>
        <TabsTrigger value="resolved">Resolved Cases</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <AlertsView alerts={activeAlerts} onSelectAlert={handleSelectAlert} title="Active Emergency Cases" />
      </TabsContent>
      <TabsContent value="resolved">
        <AlertsView alerts={resolvedAlerts} onSelectAlert={handleSelectAlert} title="Resolved Cases" />
      </TabsContent>
    </Tabs>
  );
}
