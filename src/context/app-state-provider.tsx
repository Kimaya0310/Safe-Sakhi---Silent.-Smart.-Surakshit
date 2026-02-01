'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { Ride, Alert, AlertStatus, User } from '@/lib/types';
import { useFirestore, useCollection } from '@/firebase';
import { useAuth } from './auth-provider';
import { collection, addDoc, updateDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';

// Helper to convert Firestore Timestamps to JS Dates
const convertTimestamps = (data: any) => {
  if (!data) return data;
  const converted: { [key: string]: any } = {};
  for (const key in data) {
    if (data[key] instanceof Timestamp) {
      converted[key] = data[key].toDate();
    } else if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
      converted[key] = convertTimestamps(data[key]);
    }
    else {
      converted[key] = data[key];
    }
  }
  return converted;
}


interface AppStateContextType {
  rides: Ride[];
  alerts: Alert[];
  startRide: (startLocation: string, destination: string, initialRiskScore?: number) => Promise<Ride>;
  updateRide: (updatedRide: Ride) => Promise<void>;
  endRide: (rideId: string) => Promise<void>;
  createAlert: (ride: Ride) => Promise<void>;
  updateAlert: (updatedAlert: Alert) => Promise<void>;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { user } = useAuth();
  
  const { data: ridesData } = useCollection(collection(firestore, 'rides'));
  const { data: alertsData } = useCollection(collection(firestore, 'alerts'));

  const rides: Ride[] = ridesData?.map(r => ({ rideId: r.id, ...convertTimestamps(r) })) || [];
  const alerts: Alert[] = alertsData?.map(a => ({ alertId: a.id, ...convertTimestamps(a) })) || [];


  const startRide = useCallback(async (startLocation: string, destination: string, initialRiskScore: number = 0): Promise<Ride> => {
    if (!user) throw new Error("User not authenticated");
    const newRideData = {
      passengerId: user.id,
      startLocation,
      destination,
      status: 'active' as const,
      startTime: serverTimestamp(),
      riskScore: initialRiskScore,
      riskEvents: [],
      deviceStatus: 'online' as const,
      lastHeartbeat: serverTimestamp(),
      tamperingFlag: false,
    };
    const rideRef = await addDoc(collection(firestore, 'rides'), newRideData);
    const newRide: Ride = {
      rideId: rideRef.id,
      ...newRideData,
      startTime: new Date(),
      lastHeartbeat: new Date(),
    }
    return newRide;
  }, [firestore, user]);
  
  const createAlert = useCallback(async (ride: Ride) => {
    if (!user) return;
    const passenger = user as User;
    
    const newAlertData = {
      rideId: ride.rideId,
      ride, // Embedding ride snapshot
      passenger, // Embedding passenger snapshot
      riskScore: ride.riskScore,
      triggeredAt: serverTimestamp(),
      status: 'active' as const,
      triggerReason: ride.status === 'emergency' ? 'High Risk Score' : 'Unknown',
      deviceInfoSnapshot: {
        os: 'Web Browser',
        appVersion: '1.0.2',
        network: 'Unknown',
        simStatus: 'Unknown'
      }
    };
    await addDoc(collection(firestore, 'alerts'), newAlertData);

  }, [firestore, user]);

  const updateRide = useCallback(async (updatedRide: Ride) => {
    const { rideId, ...rideData } = updatedRide;
    const rideRef = doc(firestore, 'rides', rideId);
    await updateDoc(rideRef, { ...rideData, lastHeartbeat: serverTimestamp() });
    if (updatedRide.status === 'emergency') {
        // Here you might want to check if an alert already exists for this ride
        const existingAlert = alerts.find(a => a.ride.rideId === updatedRide.rideId);
        if (!existingAlert) {
            await createAlert(updatedRide);
        }
    }
  }, [firestore, createAlert, alerts]);

  const endRide = useCallback(async (rideId: string) => {
    const rideRef = doc(firestore, 'rides', rideId);
    await updateDoc(rideRef, { status: 'completed', endTime: serverTimestamp() });
  }, [firestore]);

  const updateAlert = useCallback(async (updatedAlert: Alert) => {
    const { alertId, ...alertData } = updatedAlert;
    const alertRef = doc(firestore, 'alerts', alertId);
    await updateDoc(alertRef, alertData);
  }, [firestore]);


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
