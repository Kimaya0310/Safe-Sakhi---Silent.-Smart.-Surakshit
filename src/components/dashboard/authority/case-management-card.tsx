'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Alert, AlertStatus } from '@/lib/types';
import { ThumbsDown, ThumbsUp, ChevronsUp, ChevronsDown, ShieldCheck, UserPlus, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { useAppState } from '@/context/app-state-provider';
import { useToast } from '@/hooks/use-toast';

interface CaseManagementCardProps {
  alert: Alert;
  onStatusChange: (status: AlertStatus) => void;
}

export default function CaseManagementCard({ alert, onStatusChange }: CaseManagementCardProps) {
    const { updateAlert } = useAppState();
    const { toast } = useToast();

    const handleAssignOfficer = () => {
        // In a real app, this would be a search/select UI
        const officer = prompt("Enter name of officer to assign:");
        if (officer) {
            updateAlert({ ...alert, assignedOfficer: officer });
            toast({ title: "Officer Assigned", description: `${officer} has been assigned to case ${alert.alertId}.` });
        }
    }
    
    const handleFeedback = (feedback: string) => {
        toast({ title: "Feedback Recorded", description: `Case ${alert.alertId} flagged as: ${feedback}.` });
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Case Status</Label>
          <Select onValueChange={(val) => onStatusChange(val as AlertStatus)} defaultValue={alert.status}>
            <SelectTrigger>
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
            <Label>Assigned Officer</Label>
            {alert.assignedOfficer ? (
                 <div className="flex items-center justify-between">
                    <p className="font-medium">{alert.assignedOfficer}</p>
                    <Button onClick={handleAssignOfficer} variant="link" size="sm">Re-assign</Button>
                 </div>
            ) : (
                <Button onClick={handleAssignOfficer} variant="outline" size="sm" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4"/>
                    Assign Officer
                </Button>
            )}
        </div>
        <div className="space-y-2">
          <Label>Case Notes</Label>
          <Textarea placeholder="Add notes for this case..." />
        </div>
         <div className="space-y-2">
            <Label>Incident Review & Feedback</Label>
            <CardDescription>Use this to tune the AI model.</CardDescription>
            <div className="grid grid-cols-1 gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleFeedback('Accurate Emergency')}><CheckCircle className="mr-2 text-green-500"/> Accurate Emergency</Button>
                <Button variant="outline" size="sm" onClick={() => handleFeedback('Over-sensitive')}><AlertCircle className="mr-2 text-yellow-500"/> Over-sensitive Alert</Button>
                <Button variant="outline" size="sm" onClick={() => handleFeedback('Missed Risk')}><HelpCircle className="mr-2 text-red-500"/> System Missed Risk</Button>
            </div>
        </div>
        <div>
            <Label>Multi-Agency</Label>
            <div className="flex items-center gap-2 mt-2">
                <ShieldCheck className="text-green-500"/>
                <p className="text-sm">Police unit dispatched.</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
