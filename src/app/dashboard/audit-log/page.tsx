'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockAuditLogs } from '@/lib/data';
import { format } from 'date-fns';

export default function AuditLogPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
        <CardDescription>
          An immutable log of all significant system and user actions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAuditLogs.map(log => (
              <TableRow key={log.logId}>
                <TableCell>{format(log.timestamp, 'PPpp')}</TableCell>
                <TableCell className="font-medium">{log.eventType}</TableCell>
                <TableCell>{log.userId}</TableCell>
                <TableCell className="capitalize">{log.userRole}</TableCell>
                <TableCell className="font-mono text-xs">{JSON.stringify(log.metadata)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
