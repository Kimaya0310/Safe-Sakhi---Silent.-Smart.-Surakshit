import type { User, Ride, Alert, AuditLog } from './types';
import placeholderData from './placeholder-images.json';

const { placeholderImages } = placeholderData;

export const mockUsers: User[] = [
  {
    id: 'user_passenger_1',
    name: 'Priya Sharma',
    email: 'passenger@example.com',
    role: 'passenger',
    phone: '9876543210',
    emergencyContacts: [
      { phone: '9876543211', level: 'primary' }, 
      { phone: '9876543212', level: 'secondary' }
    ],
    avatarUrl: placeholderImages.find(p => p.id === 'user-avatar-1')?.imageUrl || '',
  },
  {
    id: 'user_responder_1',
    name: 'Ravi Kumar',
    email: 'responder@example.com',
    role: 'responder',
    phone: '8765432109',
    organization: 'City Police',
    verified: true,
    avatarUrl: placeholderImages.find(p => p.id === 'user-avatar-2')?.imageUrl || '',
  },
  {
    id: 'user_authority_1',
    name: 'Anita Desai',
    email: 'authority@example.com',
    role: 'authority',
    organization: 'State Transport Authority',
    verified: true,
    avatarUrl: placeholderImages.find(p => p.id === 'user-avatar-3')?.imageUrl || '',
  },
    {
    id: 'user_admin_1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    organization: 'Safe Sakhi',
    verified: true,
    avatarUrl: '',
  },
];

const now = new Date();

const rideForAlert: Ride = {
  rideId: 'ride_emergency_1',
  passengerId: 'user_passenger_1',
  startLocation: 'Koramangala, Bengaluru',
  destination: 'Indiranagar, Bengaluru',
  status: 'emergency',
  startTime: new Date(now.getTime() - 15 * 60000),
  riskScore: 85,
  riskEvents: [
    { id: 're_1', rideId: 'ride_emergency_1', eventType: 'deviation', severity: 7, timestamp: new Date(now.getTime() - 10 * 60000), description: 'Major route deviation detected.' },
    { id: 're_2', rideId: 'ride_emergency_1', eventType: 'stop', severity: 9, timestamp: new Date(now.getTime() - 5 * 60000), description: 'Prolonged stop in an unlit area.' },
  ],
  pastRouteData: JSON.stringify({
    deviations: [{ location: "Some place", severity: "high" }],
    riskEvents: [{ type: "harsh braking", location: "another place" }],
  }, null, 2),
  deviceStatus: 'online',
  lastHeartbeat: new Date(now.getTime() - 10000),
  tamperingFlag: true,
};

export const mockAlerts: Alert[] = [
  {
    alertId: 'alert_1',
    ride: rideForAlert,
    passenger: mockUsers[0],
    riskScore: 85,
    triggeredAt: new Date(now.getTime() - 5 * 60000),
    status: 'active',
    triggerReason: 'Phone Power Off Detected',
    triggerMethod: 'system',
    deviceInfoSnapshot: {
      os: 'Android 14',
      appVersion: '1.0.2',
      network: 'LTE',
      simStatus: 'Active'
    }
  },
  {
    alertId: 'alert_6',
    ride: { ...rideForAlert, rideId: 'ride_emergency_6', riskScore: 99 },
    passenger: mockUsers[0],
    riskScore: 99,
    triggeredAt: new Date(now.getTime() - 2 * 60000),
    status: 'active',
    triggerReason: 'Gesture SOS Activated',
    triggerMethod: 'gesture',
    assignedOfficer: 'Unassigned'
  },
  {
    alertId: 'alert_2',
    ride: { ...rideForAlert, rideId: 'ride_emergency_2', riskScore: 72 },
    passenger: mockUsers[0],
    riskScore: 72,
    triggeredAt: new Date(now.getTime() - 30 * 60000),
    status: 'acknowledged',
    triggerReason: 'Route Deviation',
    triggerMethod: 'system',
    assignedOfficer: 'Officer Singh'
  },
  {
    alertId: 'alert_3',
    ride: { ...rideForAlert, rideId: 'ride_emergency_3', riskScore: 65, status: 'completed' },
    passenger: mockUsers[0],
    riskScore: 65,
    triggeredAt: new Date(now.getTime() - 2 * 60 * 60000),
    status: 'resolved',
    triggerReason: 'Extended Device Shutdown',
    triggerMethod: 'system',
  },
    {
    alertId: 'alert_4',
    ride: { ...rideForAlert, rideId: 'ride_emergency_4', riskScore: 92 },
    passenger: mockUsers[0],
    riskScore: 92,
    triggeredAt: new Date(now.getTime() - 3 * 60000),
    status: 'active',
    triggerReason: 'Sudden Disconnect',
    triggerMethod: 'system',
  },
  {
    alertId: 'alert_5',
    ride: { ...rideForAlert, rideId: 'ride_emergency_5', riskScore: 78 },
    passenger: mockUsers[0],
    riskScore: 78,
    triggeredAt: new Date(now.getTime() - 45 * 60000),
    status: 'in-progress',
    triggerReason: 'Device Tampering Suspected',
    triggerMethod: 'system',
    assignedOfficer: 'Officer Gupta'
  },
];

export const mockRides: Ride[] = [
  rideForAlert,
  {...mockAlerts[0].ride},
  {...mockAlerts[1].ride},
  {...mockAlerts[2].ride},
  {...mockAlerts[3].ride},
  {...mockAlerts[4].ride},
  {...mockAlerts[5].ride},
  {
    rideId: 'ride_completed_1',
    passengerId: 'user_passenger_1',
    startLocation: 'Jayanagar, Bengaluru',
    destination: 'MG Road, Bengaluru',
    status: 'completed',
    startTime: new Date(now.getTime() - 24 * 60 * 60000),
    endTime: new Date(now.getTime() - 23.5 * 60 * 60000),
    riskScore: 15,
    riskEvents: [],
    pastRouteData: JSON.stringify({
      deviations: [],
      riskEvents: [],
    }, null, 2),
  }
];


export const mockAuditLogs: AuditLog[] = [
    { logId: 'log1', eventType: 'Ride Start Consent', userId: 'user_passenger_1', userRole: 'passenger', timestamp: new Date(now.getTime() - 24 * 60 * 60000), metadata: { rideId: 'ride_completed_1' } },
    { logId: 'log2', eventType: 'Alert Trigger', userId: 'system', userRole: 'admin', timestamp: new Date(now.getTime() - 5 * 60000), metadata: { alertId: 'alert_1', reason: 'Phone Power Off' } },
    { logId: 'log3', eventType: 'Case Status Update', userId: 'user_authority_1', userRole: 'authority', timestamp: new Date(now.getTime() - 30 * 60000), metadata: { alertId: 'alert_2', newStatus: 'acknowledged' } },
    { logId: 'log4', eventType: 'Manual Escalation', userId: 'user_authority_1', userRole: 'authority', timestamp: new Date(now.getTime() - 10 * 60000), metadata: { rideId: 'ride_emergency_1', newRisk: 95 } },
    { logId: 'log5', eventType: 'Evidence Export', userId: 'user_authority_1', userRole: 'authority', timestamp: new Date(), metadata: { alertId: 'alert_3' } },
    { logId: 'log6', eventType: 'Gesture SOS Trigger', userId: 'user_passenger_1', userRole: 'passenger', timestamp: new Date(now.getTime() - 2 * 60000), metadata: { alertId: 'alert_6', rideId: 'ride_emergency_6' } },
];
