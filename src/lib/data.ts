import type { User, Ride, Alert } from './types';
import placeholderData from './placeholder-images.json';

const { placeholderImages } = placeholderData;

export const mockUsers: User[] = [
  {
    id: 'user_passenger_1',
    name: 'Priya Sharma',
    email: 'passenger@example.com',
    role: 'passenger',
    phone: '9876543210',
    emergencyContacts: ['9876543211', '9876543212'],
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
};

export const mockAlerts: Alert[] = [
  {
    alertId: 'alert_1',
    ride: rideForAlert,
    passenger: mockUsers[0],
    riskScore: 85,
    triggeredAt: new Date(now.getTime() - 5 * 60000),
    status: 'active',
  },
  {
    alertId: 'alert_2',
    ride: { ...rideForAlert, rideId: 'ride_emergency_2', riskScore: 72 },
    passenger: mockUsers[0],
    riskScore: 72,
    triggeredAt: new Date(now.getTime() - 30 * 60000),
    status: 'acknowledged',
  },
  {
    alertId: 'alert_3',
    ride: { ...rideForAlert, rideId: 'ride_emergency_3', riskScore: 65, status: 'completed' },
    passenger: mockUsers[0],
    riskScore: 65,
    triggeredAt: new Date(now.getTime() - 2 * 60 * 60000),
    status: 'resolved',
  },
];

export const mockRides: Ride[] = [
  rideForAlert,
  {...mockAlerts[1].ride},
  {...mockAlerts[2].ride},
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
