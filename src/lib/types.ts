'use client';

export type UserRole = 'passenger' | 'responder' | 'authority' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  emergencyContacts?: string[];
  organization?: string;
  verified?: boolean;
  avatarUrl: string;
};

export type Ride = {
  rideId: string;
  passengerId: string;
  startLocation: string;
  destination: string;
  status: 'idle' | 'active' | 'completed' | 'emergency';
  startTime?: Date;
  endTime?: Date;
  riskScore: number;
  riskEvents: RiskEvent[];
  pastRouteData?: string;
  deviceStatus?: 'online' | 'offline' | 'poweredOff';
  lastHeartbeat?: Date;
  tamperingFlag?: boolean;
};

export type RiskEvent = {
  id: string;
  rideId: string;
  eventType: 'deviation' | 'stop' | 'behavior';
  severity: number;
  timestamp: Date;
  description: string;
};

export type AlertStatus = 'active' | 'acknowledged' | 'in-progress' | 'resolved' | 'closed';

export type Alert = {
  alertId: string;
  ride: Ride;
  passenger: User;
  riskScore: number;
  triggeredAt: Date;
  status: AlertStatus;
  triggerReason?: string;
  triggerMethod?: 'manual' | 'silent' | 'gesture' | 'system';
  deviceInfoSnapshot?: Record<string, any>;
  caseNotes?: { note: string; timestamp: Date; author: string }[];
  assignedOfficer?: string;
};

export type DeviceLog = {
    rideId: string;
    deviceStatus: 'online' | 'offline' | 'poweredOff';
    simStatus: string;
    networkStatus: string;
    timestamp: Date;
};

export type OfflineMessage = {
    senderId: string;
    receiverId: string;
    message: string;
    synced: boolean;
    timestamp: Date;
};

export type CaseLog = {
  caseId: string;
  rideId: string;
  status: AlertStatus;
  notes: string;
  assignedOfficer: string;
  timestamps: Record<AlertStatus, Date>;
}

export type AnalyticsAggregate = {
  metricType: string;
  region: string;
  timeWindow: string;
  value: number;
}

export type AuditLog = {
  logId: string;
  eventType: string;
  userRole: UserRole;
  userId: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export type GestureLog = {
  rideId: string;
  userId: string;
  gestureType: string;
  sensitivityLevel: 'low' | 'medium' | 'high';
  timestamp: Date;
  escalationTriggered: boolean;
}