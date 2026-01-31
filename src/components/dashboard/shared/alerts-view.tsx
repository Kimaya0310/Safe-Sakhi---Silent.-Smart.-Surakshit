'use client';

import type { Alert } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface AlertsViewProps {
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
  title: string;
}

export default function AlertsView({ alerts, onSelectAlert, title }: AlertsViewProps) {

  const getBadgeVariant = (status: Alert['status']) => {
    switch(status) {
        case 'active': return 'destructive';
        case 'acknowledged': return 'secondary';
        case 'in-progress': return 'warning';
        case 'resolved': return 'default';
        case 'closed': return 'outline';
        default: return 'outline';
    }
  }
  
  const sortedAlerts = [...alerts].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>
          {alerts.length > 0 
            ? 'Select a case to view details. Cases are sorted by risk score.'
            : 'No cases to show at this time.'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Passenger</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Triggered</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAlerts.length > 0 ? sortedAlerts.map((alert) => (
              <TableRow key={alert.alertId} onClick={() => onSelectAlert(alert)} className="cursor-pointer">
                <TableCell className="font-medium">{alert.passenger.name}</TableCell>
                <TableCell>
                    <Badge variant={alert.riskScore > 75 ? 'destructive' : 'warning'}>{alert.riskScore}</Badge>
                </TableCell>
                <TableCell>{formatDistanceToNow(alert.triggeredAt, { addSuffix: true })}</TableCell>
                <TableCell>
                  <Badge variant={getBadgeVariant(alert.status)} className="capitalize">{alert.status.replace('-', ' ')}</Badge>
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">No alerts found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
