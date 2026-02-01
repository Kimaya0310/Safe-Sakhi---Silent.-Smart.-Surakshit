import type { Timestamp } from "firebase/firestore";

export type UserRole = 'passenger' | 'responder' | 'authority' | 'admin';

export type GuardianVerificationLevel = 'primary' | 'secondary' | 'emergency_professional';

export type EmergencyContact = {
  phone: string;
  level: GuardianVerificationLevel;
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  emergencyContacts?: EmergencyContact[];
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
  startTime?: Date | Timestamp;
  endTime?: Date | Timestamp;
  riskScore: number;
  riskEvents: RiskEvent[];
  pastRouteData?: string;
  deviceStatus?: 'online' | 'offline' | 'poweredOff';
  lastHeartbeat?: Date | Timestamp;
  tamperingFlag?: boolean;
  forensics?: {
    lastKnownLocation: string;
    lastNetworkStatus: string;
    lastBatteryPercentage: number;
    lastUserInteraction: Date | Timestamp;
  };
};

export type RiskEvent = {
  id: string;
  rideId: string;
  eventType: 'deviation' | 'stop' | 'behavior';
  severity: number;
  timestamp: Date | Timestamp;
  description: string;
};

export type AlertStatus = 'active' | 'acknowledged' | 'in-progress' | 'resolved' | 'closed';

export type Alert = {
  alertId: string;
  ride: Ride;
  passenger: User;
  riskScore: number;
  triggeredAt: Date | Timestamp;
  status: AlertStatus;
  triggerReason?: string;
  triggerMethod?: 'manual' | 'silent' | 'gesture' | 'system';
  deviceInfoSnapshot?: Record<string, any>;
  caseNotes?: { note: string; timestamp: Date | Timestamp; author: string }[];
  assignedOfficer?: string;
};

export type DeviceLog = {
    rideId: string;
    deviceStatus: 'online' | 'offline' | 'poweredOff';
    simStatus: string;
    networkStatus: string;
    timestamp: Date | Timestamp;
};

export type OfflineMessage = {
    senderId: string;
    receiverId: string;
    message: string;
    synced: boolean;
    timestamp: Date | Timestamp;
};

export type CaseLog = {
  caseId: string;
  rideId: string;
  status: AlertStatus;
  notes: string;
  assignedOfficer: string;
  timestamps: Record<AlertStatus, Date | Timestamp>;
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
  timestamp: Date | Timestamp;
  metadata: Record<string, any>;
}

export type GestureLog = {
  rideId: string;
  userId: string;
  gestureType: string;
  sensitivityLevel: 'low' | 'medium' | 'high';
  timestamp: Date | Timestamp;
  escalationTriggered: boolean;
}

export type IncidentLedger = {
  recordId: string;
  rideId: string;
  eventHash: string;
  eventType: string;
  timestamp: Date | Timestamp;
  previousHash: string;
};

export type ConsentToken = {
  rideId: string;
  consentHash: string;
  timestamp: Date | Timestamp;
};

export type GuardianProfile = {
  userId: string;
  verificationLevel: GuardianVerificationLevel;
};

export type SystemConfig = {
  region: string;
  escalationThresholds: Record<string, number>;
  samplingRates: Record<string, number>;
};
