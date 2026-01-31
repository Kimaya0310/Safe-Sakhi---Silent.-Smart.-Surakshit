'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Ride, Alert, AlertStatus } from '@/lib/types';
import { mockRides, mockAlerts, mockUsers } from '@/lib/data';

interface AppStateContextType {
  rides: Ride[];
  alerts: Alert[];
  startRide: (startLocation: string, destination: string) => Ride;
  updateRide: (updatedRide: Ride) => void;
  endRide: (rideId: string) => void;
  createAlert: (ride: Ride) => void;
  updateAlert: (updatedAlert: Alert) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [rides, setRides] = useState<Ride[]>(mockRides);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);

  const startRide = useCallback((startLocation: string, destination: string): Ride => {
    const newRide: Ride = {
      rideId: `ride_${Date.now()}`,
      passengerId: 'user_passenger_1',
      startLocation,
      destination,
      status: 'active',
      startTime: new Date(),
      riskScore: 0,
      riskEvents: [],
      deviceStatus: 'online',
      lastHeartbeat: new Date(),
      tamperingFlag: false,
    };
    setRides(prev => [...prev, newRide]);
    return newRide;
  }, []);

  const updateRide = useCallback((updatedRide: Ride) => {
    setRides(prev => prev.map(r => r.rideId === updatedRide.rideId ? updatedRide : r));
    if (updatedRide.status === 'emergency') {
        const existingAlert = alerts.find(a => a.ride.rideId === updatedRide.rideId);
        if (!existingAlert) {
            createAlert(updatedRide);
        }
    }
  }, [alerts]);

  const endRide = useCallback((rideId: string) => {
    setRides(prev => prev.map(r => r.rideId === rideId ? { ...r, status: 'completed', endTime: new Date() } : r));
  }, []);

  const createAlert = useCallback((ride: Ride) => {
    const passenger = mockUsers.find(u => u.id === ride.passengerId);
    if (!passenger) return;
    
    const newAlert: Alert = {
      alertId: `alert_${Date.now()}`,
      ride,
      passenger,
      riskScore: ride.riskScore,
      triggeredAt: new Date(),
      status: 'active',
      triggerReason: ride.status === 'emergency' ? 'High Risk Score' : 'Unknown',
      deviceInfoSnapshot: {
        os: 'Android 14',
        appVersion: '1.0.2',
        network: 'LTE',
        simStatus: 'Active'
      }
    };
    setAlerts(prev => [newAlert, ...prev]);
  }, []);

  const updateAlert = useCallback((updatedAlert: Alert) => {
    setAlerts(prev => prev.map(a => a.alertId === updatedAlert.alertId ? updatedAlert : a));
  }, []);


  const value = { rides, alerts, startRide, updateRide, endRide, createAlert, updateAlert };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
