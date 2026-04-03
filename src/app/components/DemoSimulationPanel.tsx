import React, { useState } from 'react';
import { Play, AlertTriangle, CloudRain, XCircle, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export function DemoSimulationPanel({ onEventTriggered }: { onEventTriggered: () => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  const simulateEvent = async (type: string, payload: any, name: string) => {
    setLoading(name);
    try {
      const workerId = localStorage.getItem('workerId') || '11111111-1111-1111-1111-111111111111';
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/engine/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: workerId,
          eventType: type,
          isMock: false,
          data: payload,
        }),
      });
      
      const result = await response.json();
      
      if (result.trigger) {
        toast.success(`Payout Triggered! ₹${result.amount}`, {
          description: result.reason,
        });
        onEventTriggered();
      } else if (result.fraudFlag) {
        toast.error('Fraud Alert Detected', {
          description: result.reason || 'Event blocked due to suspicious activity.',
        });
      } else {
        toast.info('Event Simulated', {
          description: 'No payout conditions were met.',
        });
      }
    } catch (err) {
      toast.error('Simulation Failed', { description: 'Could not connect to engine.' });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden text-sm">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 transform translate-x-10 -translate-y-10"></div>
      
      <div className="flex items-center gap-2 mb-4">
        <Play className="w-5 h-5 text-green-400" fill="currentColor" />
        <h3 className="text-lg font-bold">Hackathon Demo Mode</h3>
      </div>
      <p className="text-slate-300 mb-6 text-xs">
        Use these buttons to simulate real-world API events hitting the Node.js backend engine.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Simulate Unlucky Situation */}
        <button 
          disabled={!!loading}
          onClick={() => simulateEvent('DELIVERY_ATTEMPT', { status: 'FAILED', reason: 'Customer Unreachable' }, 'unlucky')}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/5 group"
        >
          <XCircle className="w-6 h-6 text-red-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">Failed Delivery</span>
          <span className="text-[10px] text-slate-400 mt-1">Triggers after 2nd fail</span>
        </button>

        {/* Simulate Weather Disruption */}
        <button 
          disabled={!!loading}
          onClick={() => simulateEvent('WEATHER_UPDATE', { rainfall: 25, temp: 30, aqi: 50 }, 'weather')}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/5 group"
        >
          <CloudRain className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">Heavy Rain Alert</span>
          <span className="text-[10px] text-slate-400 mt-1">&gt; 20mm/hr Rainfall</span>
        </button>

        {/* Simulate Unsafe Zone */}
        <button 
          disabled={!!loading}
          onClick={() => simulateEvent('LOCATION_UPDATE', { inHighRiskZone: true }, 'unsafe')}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/5 group"
        >
          <AlertTriangle className="w-6 h-6 text-yellow-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">Enter High-Risk Zone</span>
          <span className="text-[10px] text-slate-400 mt-1">Triggers unsafe location</span>
        </button>

        {/* Simulate Fraud */}
        <button 
          disabled={!!loading}
          onClick={() => simulateEvent('LOCATION_UPDATE', { distanceMoved: 1000, timeElapsed: 10 }, 'fraud')}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-red-500/30 hover:border-red-500/60 group"
        >
          <MapPin className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-semibold">GPS Spoofing (Speed)</span>
          <span className="text-[10px] text-slate-400 mt-1">100m/s speed anomaly</span>
        </button>

      </div>
    </div>
  );
}
