# **App Name**: Safe Sakhi

## Core Features:

- User Authentication: Secure user authentication with Firebase Authentication, supporting phone number and email login. Implement role-based access control for passengers, responders, and authorities, managed via Firestore.
- Ride Initialization and Route Planning: Allow passengers to manually start a ride by specifying start and destination. Use a Maps API (mocked for MVP) to fetch the expected route and create a safe corridor around it.
- Real-time Ride Monitoring: Track the passenger's GPS location at fixed intervals, along with speed and movement state. Optimize for low battery and data usage. The system includes AI analysis of behavior.
- Risk Evaluation Engine: Calculate a risk score based on route deviations, stop durations, and driving behavior. Use this risk score to determine the safety status of the ride (Safe, Monitoring, Emergency). The algorithm incorporates the risk scores with an AI-based evaluation tool.
- Silent Alert & Dispatch: Automatically trigger silent alerts when the risk score exceeds a threshold, notifying responders and authorities with live location and ride metadata.
- Live Location Streaming: Stream live GPS updates to responders and authorities during an emergency. This feature will stop automatically when the alert is resolved or the ride ends.
- User Interface and Role-Based Dashboards: Develop user interfaces for passengers, responders, and authorities. The passenger app includes a home screen to start rides, a live ride status screen, and emergency contact management. Responders and authorities have dashboards with active alerts and live location maps.

## Style Guidelines:

- Primary color: Deep, calming blue (#3B5998) to instill trust and security.
- Background color: Very light desaturated blue (#E6EBF5), creating a clean and unobtrusive backdrop.
- Accent color: Muted purple (#806491) for subtle highlights and interactive elements.
- Body text: 'Inter', sans-serif, for clear and modern readability.
- Headline text: 'Space Grotesk', sans-serif, for a techy, modern, and prominent appearance.
- Use simple, clear icons representing safety, location, and alerts.
- Minimalist layout with clear information hierarchy and intuitive navigation.
- Subtle animations for state changes and transitions, providing feedback without distracting from core functionality.