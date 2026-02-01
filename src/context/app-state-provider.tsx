'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from 'react';
import type { Ride, Alert, AlertStatus, User } from '@/lib/types';
import { useFirestore, useCollection } from '@/firebase';
import { useAuth } from './auth-provider';
import { collection, addDoc, updateDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';

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
  
  const { data: rides } = useCollection<Ride>('rides');
  const { data: alerts } = useCollection<Alert>('alerts');

  const alertsRef = useRef(alerts);
  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);


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
      startTime: new Date(), // Use local time as an estimate until server timestamp is processed
      lastHeartbeat: new Date(),
    }
    return newRide;
  }, [firestore, user]);
  
  const createAlert = useCallback(async (ride: Ride) => {
    if (!user) return;
    // We need the full user object for the passenger field.
    // The user from useAuth might not be the passenger in all cases,
    // so in a real app you might fetch the passenger profile here.
    // For this implementation, we assume the current user is the passenger.
    const passenger = user as User; 
    
    const newAlertData: Partial<Alert> = {
      rideId: ride.rideId,
      ride, // Embedding ride snapshot
      passenger, // Embedding passenger snapshot
      riskScore: ride.riskScore,
      triggeredAt: serverTimestamp(),
      status: 'active' as const,
      triggerReason: ride.status === 'emergency' ? 'High Risk Score' : 'Unknown',
      triggerMethod: 'system',
      deviceInfoSnapshot: {
        os: 'Web Browser',
        appVersion: '1.0.2',
        network: 'Unknown',
        simStatus: 'Unknown'
      }
    };
    
    if (ride.riskEvents.some(e => e.eventType === 'behavior')) {
      newAlertData.triggerMethod = 'gesture';
    }

    await addDoc(collection(firestore, 'alerts'), newAlertData);

  }, [firestore, user]);

  const updateRide = useCallback(async (updatedRide: Ride) => {
    const { rideId, ...rideData } = updatedRide;
    const rideRef = doc(firestore, 'rides', rideId);
    // Remove client-side date objects before sending to firestore
    const dataToUpdate = { ...rideData };
    delete (dataToUpdate as any).startTime;
    delete (dataToUpdate as any).endTime;

    await updateDoc(rideRef, { ...dataToUpdate, lastHeartbeat: serverTimestamp() });

    if (updatedRide.status === 'emergency') {
        const existingAlert = (alertsRef.current || []).find(a => a.ride.rideId === updatedRide.rideId);
        if (!existingAlert) {
            await createAlert(updatedRide);
        }
    }
  }, [firestore, createAlert]);

  const endRide = useCallback(async (rideId: string) => {
    const rideRef = doc(firestore, 'rides', rideId);
    await updateDoc(rideRef, { status: 'completed', endTime: serverTimestamp() });
  }, [firestore]);

  const updateAlert = useCallback(async (updatedAlert: Alert) => {
    const { alertId, ...alertData } = updatedAlert;
    const alertRef = doc(firestore, 'alerts', alertId);
    await updateDoc(alertRef, alertData);
  }, [firestore]);


  const value = { rides: rides || [], alerts: alerts || [], startRide, updateRide, endRide, createAlert, updateAlert };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
