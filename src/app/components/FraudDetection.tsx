import { AlertTriangle, MapPin, User, CheckCircle, XCircle, Clock, Search, Filter } from "lucide-react";

export function FraudDetection() {
  const metrics = [
    { label: "Total Alerts", value: "47", status: "active", color: "text-red-600" },
    { label: "Under Review", value: "12", status: "warning", color: "text-yellow-600" },
    { label: "False Positives", value: "23", status: "cleared", color: "text-green-600" },
    { label: "Confirmed Fraud", value: "8", status: "blocked", color: "text-red-600" }
  ];

  const suspiciousActivities = [
    {
      id: "USR-8372",
      userId: "DEL-2847",
      name: "Rajesh Kumar",
      anomalyScore: 87,
      risk: "high",
      flags: [
        "GPS location spoofing detected",
        "Claim pattern anomaly (5 claims in 2 days)",
        "Unusual activity hours"
      ],
      claimDetails: {
        amount: "₹2,450",
        claimType: "Rain coverage",
        location: "Koramangala",
        timestamp: "2026-03-29 15:30"
      },
      status: "flagged"
    },
    {
      id: "USR-8371",
      userId: "DEL-3156",
      name: "Priya Sharma",
      anomalyScore: 72,
      risk: "medium",
      flags: [
        "Multiple claims from same location",
        "Device fingerprint mismatch",
        "Rapid claim submissions"
      ],
      claimDetails: {
        amount: "₹1,800",
        claimType: "Cancellation",
        location: "Whitefield",
        timestamp: "2026-03-29 14:15"
      },
      status: "flagged"
    },
    {
      id: "USR-8369",
      userId: "DEL-4721",
      name: "Amit Patel",
      anomalyScore: 45,
      risk: "low",
      flags: [
        "Claim timing pattern detected",
        "Location accuracy variance"
      ],
      claimDetails: {
        amount: "₹950",
        claimType: "Storm",
        location: "Indiranagar",
        timestamp: "2026-03-28 18:45"
      },
      status: "under_review"
    },
    {
      id: "USR-8365",
      userId: "DEL-1923",
      name: "Sanjay Reddy",
      anomalyScore: 92,
      risk: "high",
      flags: [
        "GPS spoofing confirmed",
        "Fake weather data submission",
        "Coordinated fraud pattern"
      ],
      claimDetails: {
        amount: "₹3,200",
        claimType: "Rain coverage",
        location: "HSR Layout",
        timestamp: "2026-03-27 16:20"
      },
      status: "blocked"
    }
  ];

  const flaggedLocations = [
    { location: "HSR Layout, Sector 2", lat: 12.9121, lng: 77.6446, alerts: 8, risk: "high" },
    { location: "Whitefield Main Road", lat: 12.9698, lng: 77.7499, alerts: 5, risk: "medium" },
    { location: "Koramangala 4th Block", lat: 12.9352, lng: 77.6245, alerts: 3, risk: "low" }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
      case 'medium': return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' };
      case 'low': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'flagged':
        return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Flagged</span>;
      case 'under_review':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Under Review</span>;
      case 'blocked':
        return <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-semibold">Blocked</span>;
      case 'cleared':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Cleared</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Fraud Detection Panel</h1>
          </div>
          <p className="text-gray-600">Monitor and manage suspicious activities and anomalies</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <p className="text-gray-600 text-sm mb-1">{metric.label}</p>
              <p className={`text-3xl font-bold ${metric.color} mb-1`}>{metric.value}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${
                  metric.status === 'active' ? 'bg-red-500' :
                  metric.status === 'warning' ? 'bg-yellow-500' :
                  metric.status === 'cleared' ? 'bg-green-500' :
                  'bg-red-500'
                }`}></div>
                <span className="text-xs text-gray-500 capitalize">{metric.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Flagged Locations Map</h3>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 relative overflow-hidden h-80">
            {/* Mock Map Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 right-0 h-px bg-gray-300"></div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-300"></div>
              <div className="absolute top-0 bottom-0 left-0 w-px bg-gray-300"></div>
              <div className="absolute top-0 bottom-0 right-0 w-px bg-gray-300"></div>
            </div>

            {/* Location Markers */}
            {flaggedLocations.map((loc, index) => {
              const riskColor = getRiskColor(loc.risk);
              return (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    top: `${20 + index * 25}%`,
                    left: `${30 + index * 15}%`
                  }}
                >
                  <div className="relative group cursor-pointer">
                    <div className={`w-12 h-12 ${riskColor.bg} ${riskColor.border} border-2 rounded-full flex items-center justify-center animate-pulse`}>
                      <MapPin className={`w-6 h-6 ${riskColor.text}`} />
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg shadow-lg p-3 whitespace-nowrap z-10">
                      <p className="font-semibold text-gray-900 text-sm">{loc.location}</p>
                      <p className="text-xs text-gray-600">{loc.alerts} alerts</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 ${riskColor.bg} ${riskColor.text} rounded text-xs font-semibold`}>
                        {loc.risk.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white rounded-lg p-3 shadow-lg">
              <p className="text-xs font-semibold text-gray-700 mb-2">Risk Level</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Low</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by user ID, name, or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]">
                <option>All Risk Levels</option>
                <option>High Risk</option>
                <option>Medium Risk</option>
                <option>Low Risk</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]">
                <option>All Status</option>
                <option>Flagged</option>
                <option>Under Review</option>
                <option>Blocked</option>
              </select>
            </div>
          </div>
        </div>

        {/* Suspicious Activities Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Suspicious Activity Alerts</h3>
          </div>

          <div className="divide-y divide-gray-200">
            {suspiciousActivities.map((activity, index) => {
              const riskColor = getRiskColor(activity.risk);
              return (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${riskColor.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <User className={`w-6 h-6 ${riskColor.text}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                          {getStatusBadge(activity.status)}
                        </div>
                        <p className="text-sm text-gray-600">User ID: {activity.userId}</p>
                        <p className="text-xs text-gray-500">Alert ID: {activity.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-3 py-1 ${riskColor.bg} ${riskColor.text} rounded-lg text-sm font-semibold mb-2`}>
                        Anomaly Score: {activity.anomalyScore}
                      </div>
                      <p className="text-xs text-gray-500">{activity.claimDetails.timestamp}</p>
                    </div>
                  </div>

                  {/* Claim Details */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">Claim Details</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Amount</p>
                        <p className="font-semibold text-gray-900">{activity.claimDetails.amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Type</p>
                        <p className="font-semibold text-gray-900">{activity.claimDetails.claimType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">{activity.claimDetails.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Time</p>
                        <p className="font-semibold text-gray-900">{activity.claimDetails.timestamp}</p>
                      </div>
                    </div>
                  </div>

                  {/* Fraud Flags */}
                  <div className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">Detected Issues</h5>
                    <div className="space-y-2">
                      {activity.flags.map((flag, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      Approve Claim
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-semibold">
                      <XCircle className="w-4 h-4" />
                      Reject & Block
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors flex items-center gap-2 text-sm font-semibold">
                      <Clock className="w-4 h-4" />
                      Request More Info
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
