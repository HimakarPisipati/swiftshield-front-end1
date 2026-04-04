import { useState, useEffect } from "react";
import { Cloud, MapPin, TrendingUp, AlertTriangle, Info, CheckCircle } from "lucide-react";

export function RiskInsights() {
  const [riskScore, setRiskScore] = useState(32);
  const [expectedLoss, setExpectedLoss] = useState(0);
  const [loading, setLoading] = useState(true);

  // Dynamic risk breakdown
  const [riskBreakdown, setRiskBreakdown] = useState<any[]>([
    {
      category: "Weather Risk", score: 28, level: "Low", color: "bg-green-500", icon: Cloud,
      description: "Minimal rain forecast for next 7 days", factors: ["Clear weather predicted", "Low precipitation probability", "Stable temperatures"]
    },
    {
      category: "Location Risk", score: 45, level: "Medium", color: "bg-yellow-500", icon: MapPin,
      description: "Some high-risk zones in your delivery area", factors: ["2 unsafe zones in coverage area", "Medium traffic congestion", "Construction activity"]
    },
    {
      category: "Behavior Risk", score: 22, level: "Low", color: "bg-green-500", icon: TrendingUp,
      description: "Excellent delivery performance metrics", factors: ["95% on-time delivery rate", "Low cancellation acceptance", "Safe riding patterns"]
    }
  ]);

  useEffect(() => {
    const workerId = localStorage.getItem('workerId') || '11111111-1111-1111-1111-111111111111';
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/engine/stats/${workerId}`)
      .then(res => res.json())
      .then(d => {
        // Use the backend's smart rolling-window risk score directly
        if (typeof d.riskScore === 'number') {
          setRiskScore(d.riskScore);
        }

        setExpectedLoss(d.lossCovered > 0 ? Math.round(d.lossCovered * 1.25) : 0);

        if (!d.recentPayouts || d.recentPayouts.length === 0) {
          // No claims — reset breakdown to clean defaults
          setRiskBreakdown([
            { category: "Weather Risk", score: 28, level: "Low", color: "bg-green-500", icon: Cloud,
              description: "No weather disruptions recorded recently", factors: ["Clear weather predicted", "Low precipitation probability", "Stable temperatures"] },
            { category: "Location Risk", score: 20, level: "Low", color: "bg-green-500", icon: MapPin,
              description: "No unsafe zone alerts on record", factors: ["No high-risk zones flagged", "Normal traffic conditions", "Safe delivery areas"] },
            { category: "Behavior Risk", score: 15, level: "Low", color: "bg-green-500", icon: TrendingUp,
              description: "Excellent delivery performance", factors: ["No failed deliveries recently", "Low cancellation acceptance", "Safe riding patterns"] }
          ]);
          setLoading(false);
          return;
        }

        // Build breakdown from recent payouts
        const newBreakdown = [...riskBreakdown];
        let weatherCount = 0; let locCount = 0; let behCount = 0;
          
          d.recentPayouts.forEach((p: any) => {
             const r = p.reason.toLowerCase();
             if (r.includes('weather') || r.includes('environmental') || r.includes('rain')) weatherCount++;
             if (r.includes('unsafe') || r.includes('location')) locCount++;
             if (r.includes('unlucky') || r.includes('failed')) behCount++;
          });

          if (weatherCount > 0) {
            newBreakdown[0].score = Math.min(100, 28 + (weatherCount * 25));
            newBreakdown[0].level = newBreakdown[0].score > 66 ? 'High' : (newBreakdown[0].score > 33 ? 'Medium' : 'Low');
            newBreakdown[0].color = newBreakdown[0].level === 'High' ? 'bg-red-500' : (newBreakdown[0].level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500');
            newBreakdown[0].description = `Elevated weather risk due to ${weatherCount} recent disruptions`;
          }
          if (locCount > 0) {
            newBreakdown[1].score = Math.min(100, 45 + (locCount * 25));
            newBreakdown[1].level = newBreakdown[1].score > 66 ? 'High' : (newBreakdown[1].score > 33 ? 'Medium' : 'Low');
            newBreakdown[1].color = newBreakdown[1].level === 'High' ? 'bg-red-500' : (newBreakdown[1].level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500');
            newBreakdown[1].description = `High risk alerts triggered in ${locCount} recent trips`;
          }
          if (behCount > 0) {
            newBreakdown[2].score = Math.min(100, 22 + (behCount * 25));
            newBreakdown[2].level = newBreakdown[2].score > 66 ? 'High' : (newBreakdown[2].score > 33 ? 'Medium' : 'Low');
            newBreakdown[2].color = newBreakdown[2].level === 'High' ? 'bg-red-500' : (newBreakdown[2].level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500');
            newBreakdown[2].description = `Multiple unlucky situations detected (${behCount} recent)`;
          }

          setRiskBreakdown(newBreakdown);
        setLoading(false);
      })
      .catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Dynamic AI Recommendations ---
  const generateDynamicSuggestions = () => {
    const dynamicSuggestions = [];
    
    // 1. Overall Account Suggestion
    if (riskScore > 60) {
      dynamicSuggestions.push({
        priority: "high",
        title: "Activate Full Cover Insurance",
        description: "Your risk score is dangerously high due to a recent spike in incidents.",
        impact: "Requires immediate attention"
      });
    } else if (riskScore < 20) {
      dynamicSuggestions.push({
        priority: "low",
        title: "Great Job — Safe Driving Bonus Active",
        description: "You are maintaining an excellent risk profile with zero recent collisions.",
        impact: "Eligible for premium discounts"
      });
    }

    // 2. Category-based Suggestions
    const highRiskCategories = riskBreakdown.filter(b => b.score > 50);
    
    if (highRiskCategories.find(c => c.category === 'Weather Risk')) {
      dynamicSuggestions.push({
        priority: "high",
        title: "Severe Weather Warning",
        description: "You have triggered multiple weather alerts recently. Rain is expected.",
        impact: "Consider shorter shifts today"
      });
    } else {
      dynamicSuggestions.push({
        priority: "low",
        title: "Clear Weather Predicted",
        description: "No environmental disruptions expected for your primary operating zones.",
        impact: "Optimal earning conditions"
      });
    }

    if (highRiskCategories.find(c => c.category === 'Location Risk')) {
      dynamicSuggestions.push({
        priority: "medium",
        title: "Avoid high-risk zones",
        description: "You've been entering areas flagged for safety concerns or road closures.",
        impact: "Reroute to safer areas"
      });
    }

    if (highRiskCategories.find(c => c.category === 'Behavior Risk')) {
      dynamicSuggestions.push({
        priority: "high",
        title: "Delivery Failures Detected",
        description: "You have a recent pattern of unfulfilled or failed deliveries.",
        impact: "Potential savings: ₹200/week"
      });
    }

    // Grab top 3 most important
    return dynamicSuggestions.sort((a, b) => a.priority === 'high' ? -1 : 1).slice(0, 3);
  };

  const suggestions = generateDynamicSuggestions();

  // --- Dynamic Weekly Prediction ---
  // The daily multiplier floats around 1.0, but gets strictly tied to the live expected loss.
  const weeklyPrediction = [
    { day: "Mon", riskScore: Math.round(riskScore * 0.8), expectedLoss: Math.round(expectedLoss * 0.8) },
    { day: "Tue", riskScore: Math.round(riskScore * 1.1), expectedLoss: Math.round(expectedLoss * 1.1) },
    { day: "Wed", riskScore: Math.round(riskScore * 0.9), expectedLoss: Math.round(expectedLoss * 0.9) },
    { day: "Thu", riskScore: Math.round(riskScore * 1.4), expectedLoss: Math.round(expectedLoss * 1.4) },
    { day: "Fri", riskScore: Math.round(riskScore * 0.8), expectedLoss: Math.round(expectedLoss * 0.8) },
    { day: "Sat", riskScore: Math.round(riskScore * 0.6), expectedLoss: Math.round(expectedLoss * 0.6) },
    { day: "Sun", riskScore: Math.round(riskScore * 0.5), expectedLoss: Math.round(expectedLoss * 0.5) }
  ];

  const getRiskColor = (score: number) => {
    if (score < 33) return { bg: 'bg-green-500', text: 'text-green-600', label: 'Low Risk' };
    if (score < 66) return { bg: 'bg-yellow-500', text: 'text-yellow-600', label: 'Medium Risk' };
    return { bg: 'bg-red-500', text: 'text-red-600', label: 'High Risk' };
  };

  const overallRisk = getRiskColor(riskScore);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading risk insights...</div>;

  return (
    <div className="min-h-screen p-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Risk Insights</h1>
          <p className="text-gray-600">Personalized predictions to optimize your earnings and safety</p>
        </div>

        {/* Risk Score Gauge */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Risk Score</h2>
              <div className="relative w-64 h-64 mx-auto">
                {/* Circular Progress */}
                <svg className="transform -rotate-90 w-64 h-64">
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke="#E5E7EB"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="112"
                    stroke={riskScore < 33 ? '#10B981' : riskScore < 66 ? '#F59E0B' : '#EF4444'}
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(riskScore / 100) * 703} 703`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-gray-900">{riskScore}</span>
                  <span className="text-gray-600">out of 100</span>
                  <span className={`mt-2 px-4 py-1 rounded-full text-sm font-semibold ${
                    riskScore < 33 ? 'bg-green-100 text-green-700' :
                    riskScore < 66 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {overallRisk.label}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-2xl p-6 text-white mb-4">
                <h3 className="text-lg font-semibold mb-2">Expected Weekly Loss</h3>
                <p className="text-4xl font-bold">₹{expectedLoss}</p>
                <p className="text-sm text-blue-100 mt-2">Based on current conditions and patterns</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 flex gap-3">
                <Info className="w-5 h-5 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="font-semibold mb-1">How we calculate your risk score:</p>
                  <p>
                    Our AI analyzes weather patterns, location data, historical delivery performance,
                    and real-time conditions to predict potential income disruptions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Breakdown */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {riskBreakdown.map((risk, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`${risk.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                  <risk.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  risk.level === 'Low' ? 'bg-green-100 text-green-700' :
                  risk.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {risk.level}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{risk.category}</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Risk Score</span>
                  <span className="font-bold text-gray-900">{risk.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${risk.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${risk.score}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{risk.description}</p>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700 uppercase">Key Factors:</p>
                {risk.factors.map((factor, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-600">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Prediction */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">7-Day Risk Forecast</h3>
          <div className="grid grid-cols-7 gap-4">
            {weeklyPrediction.map((day, index) => {
              const dayRisk = getRiskColor(day.riskScore);
              return (
                <div key={index} className="text-center">
                  <p className="text-sm font-semibold text-gray-900 mb-2">{day.day}</p>
                  <div className={`${dayRisk.bg} rounded-xl p-4 mb-2`}>
                    <p className="text-2xl font-bold text-white">{day.riskScore}</p>
                  </div>
                  <p className="text-xs text-gray-600">Loss: ₹{day.expectedLoss}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Recommendations</h3>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  suggestion.priority === 'high' ? 'bg-red-100' :
                  suggestion.priority === 'medium' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  <AlertTriangle className={`w-5 h-5 ${
                    suggestion.priority === 'high' ? 'text-red-600' :
                    suggestion.priority === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                      suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                      suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                  <p className="text-sm text-[#14B8A6] font-semibold">{suggestion.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Banner */}
        <div className="mt-8 bg-gradient-to-r from-[#F97316] to-[#F97316]/80 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Want More Detailed Insights?</h3>
              <p className="text-orange-100">Upgrade to Premium for personal risk advisor and hourly predictions</p>
            </div>
            <button className="px-8 py-3 bg-white text-[#F97316] rounded-xl hover:bg-gray-100 transition-colors font-semibold">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
