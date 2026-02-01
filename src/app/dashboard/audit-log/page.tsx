'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection } from '@/firebase';
import type { AuditLog } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuditLogPage() {
  const { data: auditLogs, loading } = useCollection<AuditLog>('auditLogs');
  
  const sortedLogs = auditLogs ? [...auditLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()) : [];

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
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
              </TableRow>
            ))}
            {!loading && sortedLogs.map(log => (
              <TableRow key={log.logId}>
                <TableCell>{format(log.timestamp, 'PPpp')}</TableCell>
                <TableCell className="font-medium">{log.eventType}</TableCell>
                <TableCell>{log.userId}</TableCell>
                <TableCell className="capitalize">{log.userRole}</TableCell>
                <TableCell className="font-mono text-xs">{JSON.stringify(log.metadata)}</TableCell>
              </TableRow>
            ))}
             {!loading && sortedLogs.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">No audit logs found.</TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
