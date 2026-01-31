export type UserRole = 'passenger' | 'responder' | 'authority';

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
};

export type RiskEvent = {
  id: string;
  rideId: string;
  eventType: 'deviation' | 'stop' | 'behavior';
  severity: number;
  timestamp: Date;
  description: string;
};

export type Alert = {
  alertId: string;
  ride: Ride;
  passenger: User;
  riskScore: number;
  triggeredAt: Date;
  status: 'active' | 'acknowledged' | 'resolved';
};
