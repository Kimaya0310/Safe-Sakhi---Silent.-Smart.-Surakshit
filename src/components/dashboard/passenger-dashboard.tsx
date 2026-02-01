'use client';

import React, { useState } from 'react';
import StartRideForm from './passenger/start-ride-form';
import LiveRideView from './passenger/live-ride-view';
import RideSummaryView from './passenger/ride-summary-view';
import type { Ride } from '@/lib/types';
import { useAppState } from '@/context/app-state-provider';

type RideState = 'idle' | 'active' | 'completed';

export default function PassengerDashboard() {
  const [rideState, setRideState] = useState<RideState>('idle');
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const { startRide, endRide: appEndRide } = useAppState();

  const handleStartRide = async (startLocation: string, destination: string, isFeelingUnsafe: boolean) => {
    const initialRiskScore = isFeelingUnsafe ? 20 : 0;
    const newRide = await startRide(startLocation, destination, initialRiskScore);
    setCurrentRide(newRide);
    setRideState('active');
  };

  const handleEndRide = async (ride: Ride) => {
    await appEndRide(ride.rideId);
    const completedRide: Ride = {
      ...ride, 
      status: 'completed', 
      endTime: new Date(),
      // In a real app, endTime would be a server-set timestamp.
    }
    setCurrentRide(completedRide);
    setRideState('completed');
  };
  
  const handleNewRide = () => {
    setCurrentRide(null);
    setRideState('idle');
  }

  return (
    <div className="container mx-auto">
      {rideState === 'idle' && <StartRideForm onStartRide={handleStartRide} />}
      {rideState === 'active' && currentRide && (
        <LiveRideView ride={currentRide} onEndRide={handleEndRide} />
      )}
      {rideState === 'completed' && currentRide && (
        <RideSummaryView ride={currentRide} onNewRide={handleNewRide} />
      )}
    </div>
  );
}
