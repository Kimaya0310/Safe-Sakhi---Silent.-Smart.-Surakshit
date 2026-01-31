'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function RiskHeatmap() {
    // In a real app, this would be an interactive map component.
    // We use a static image as a placeholder.
    const heatmapImageUrl = "https://images.unsplash.com/photo-1571401833583-93907a04918a?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  return (
    <Card>
      <CardHeader>
        <CardTitle>City Risk Heatmap</CardTitle>
        <CardDescription>
          Visualization of high-frequency alert zones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full overflow-hidden rounded-lg border">
            <Image 
                src={heatmapImageUrl}
                alt="Risk Heatmap"
                width={1200}
                height={800}
                className="h-full w-full object-cover"
                data-ai-hint="heatmap city"
            />
        </div>
      </CardContent>
    </Card>
  );
}
