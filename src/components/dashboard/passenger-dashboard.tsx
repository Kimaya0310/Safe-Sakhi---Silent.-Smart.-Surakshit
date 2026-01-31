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

  const handleStartRide = (startLocation: string, destination: string) => {
    const newRide = startRide(startLocation, destination);
    setCurrentRide(newRide);
    setRideState('active');
  };

  const handleEndRide = (ride: Ride) => {
    appEndRide(ride.rideId);
    const completedRide = {...ride, status: 'completed', endTime: new Date() }
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
