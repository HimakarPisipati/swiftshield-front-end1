import { useEffect, useState } from "react";
import { Link } from "react-router";
import { TrendingUp, DollarSign, Shield, AlertTriangle, Cloud, MapPin, XCircle, ArrowUpRight, CheckCircle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Area } from "recharts";
import { DemoSimulationPanel } from "./DemoSimulationPanel";

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = () => {
    const workerId = localStorage.getItem('workerId') || '11111111-1111-1111-1111-111111111111';
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/engine/stats/${workerId}`)
      .then(res => res.json())
      .then(d => {
        // Process 7-day trend from recentPayouts
        const payouts = d.recentPayouts || [];
        const chartData = [];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const now = new Date();
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dayName = days[date.getDay()];
          const dateStr = date.toDateString();
          
          // Payouts on this day
          const dayPayouts = payouts.filter((p: any) => new Date(p.created_at).toDateString() === dateStr);
          const totalAmount = dayPayouts.reduce((sum: number, p: any) => sum + p.amount, 0);
          
          // Simple dynamic risk calculation for the chart: 
          // Base 10 + (claims in last 7 days ending on THIS day * 15)
          const sevenDaysPrior = new Date(date);
          sevenDaysPrior.setDate(sevenDaysPrior.getDate() - 7);
          const claimsInWindow = payouts.filter((p: any) => {
            const pTime = new Date(p.created_at).getTime();
            return pTime <= date.getTime() && pTime > sevenDaysPrior.getTime();
          }).length;
          
          const calculatedRisk = Math.min(95, 15 + (claimsInWindow * 12));
          
          chartData.push({
            day: dayName,
            payout: totalAmount,
            risk: calculatedRisk
          });
        }
        
        d.processedChartData = chartData;

        // Build claimsData grouped by type from real payouts
        const typeCounts: Record<string, number> = {};
        payouts.forEach((p: any) => {
          const r = (p.reason || '').toLowerCase();
          let type = 'General';
          if (r.includes('environmental') || r.includes('weather') || r.includes('rain')) type = 'Weather';
          else if (r.includes('unlucky') || r.includes('cancellation')) type = 'Cancellation';
          else if (r.includes('unsafe') || r.includes('location')) type = 'High Risk';
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        d.claimsData = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));

        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard data...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to load data</div>;
  }

  const summaryCards = [
    {
      title: "Claims Approved",
      value: (data.recentPayouts || []).length,
      subtitle: "Lifetime total",
      change: null,
      positive: true,
      icon: CheckCircle,
      color: "bg-[#14B8A6]"
    },
    {
      title: "Loss Covered",
      value: `₹${data.lossCovered || 0}`,
      subtitle: "This week",
      change: null,
      positive: true,
      icon: Shield,
      color: "bg-[#F97316]"
    },
    {
      title: "Active Plan",
      value: data.activePlan || "Basic",
      subtitle: `₹${data.weeklyPremium || 0}/week`,
      change: null,
      positive: true,
      icon: Shield,
      color: "bg-[#1E3A8A]"
    },
    {
      title: "Risk Score",
      value: data.riskScore < 40 ? "Low" : "High",
      subtitle: `${data.riskScore || 0}/100`,
      change: null,
      positive: true,
      icon: AlertTriangle,
      color: "bg-green-500"
    }
  ];

  const earningsData = data.earningsData || [];
  const claimsData = data.claimsData || [];
  const activities = data.activities || [];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Smart monitoring for your parametric insurance coverage</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                {card.change && (
                  <span className={`text-sm font-semibold ${card.positive ? "text-green-600" : "text-red-600"}`}>
                    {card.change}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-1">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              {card.subtitle && <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>}
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Daily Risk & Payout Trend</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#1E3A8A] rounded-full"></div>
                  <span className="text-gray-500">Payout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#F97316] rounded-full"></div>
                  <span className="text-gray-500">Risk Score</span>
                </div>
              </div>
            </div>
            {data.processedChartData && data.processedChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={data.processedChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar yAxisId="left" dataKey="payout" fill="#1E3A8A" radius={[4, 4, 0, 0]} barSize={30} />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="#F97316" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#F97316', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-400">No trend data available.</div>
            )}
          </div>

          {/* Claims Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Triggered by Type</h3>
            {claimsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={claimsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="type" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#1E3A8A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-400">No claims data available yet.</div>
            )}
          </div>
        </div>

        {/* Activity Feed and Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activities.length > 0 ? activities.map((activity: any, index: number) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`${activity.color || 'bg-blue-500'} bg-gray-100 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                      {activity.amount && (
                        <span className="text-green-600 font-semibold whitespace-nowrap">{activity.amount}</span>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-gray-400 py-4 text-center border border-dashed rounded-lg">No recent activity detected.</div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/pricing"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1E3A8A] to-[#14B8A6] text-white rounded-xl hover:shadow-lg transition-shadow"
              >
                <div>
                  <p className="font-semibold">Upgrade Plan</p>
                  <p className="text-xs text-blue-100">Get more coverage</p>
                </div>
                <ArrowUpRight className="w-5 h-5" />
              </Link>

              <Link
                to="/claims"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-900">View Claims</p>
                  <p className="text-xs text-gray-600">Track your payouts</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-600" />
              </Link>

              <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Coverage Details</p>
                  <p className="text-xs text-gray-600">Plan: {data.activePlan}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400" />
              </button>

              <Link
                to="/insights"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-900">Risk Insights</p>
                  <p className="text-xs text-gray-600">View AI predictions</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
