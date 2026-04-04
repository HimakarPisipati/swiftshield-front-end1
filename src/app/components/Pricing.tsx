import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Cloud, MapPin, TrendingDown, AlertCircle } from "lucide-react";

export function Pricing() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);

  useEffect(() => {
    const workerId = localStorage.getItem('workerId') || '11111111-1111-1111-1111-111111111111';
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    
    fetch(`${apiUrl}/api/engine/stats/${workerId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.activePlan) {
          setCurrentPlan(data.activePlan);
        }
      })
      .catch(err => console.error("Error fetching plan:", err));
  }, []);

  const plans = [
    {
      name: "Basic",
      price: "₹199",
      period: "week",
      maxPayout: "₹2,000",
      features: [
        "Weather disruption coverage",
        "Max payout: ₹2,000/week",
        "Basic risk monitoring",
        "UPI instant payout",
        "Email support"
      ],
      covered: [
        { name: "Rain", icon: Cloud },
        { name: "Storm", icon: Cloud },
      ],
      notCovered: [
        { name: "High Cancellations", icon: XCircle },
        { name: "Unsafe zones", icon: MapPin },
        { name: "Peak hour failures", icon: TrendingDown }
      ]
    },
    {
      name: "Standard",
      price: "₹399",
      period: "week",
      maxPayout: "₹5,000",
      features: [
        "Full weather + cancellation coverage",
        "Max payout: ₹5,000/week",
        "Advanced AI risk scoring",
        "UPI instant payout",
        "Priority support",
        "Real-time risk alerts"
      ],
      covered: [
        { name: "Rain", icon: Cloud },
        { name: "Storm", icon: Cloud },
        { name: "High Cancellations", icon: XCircle },
        { name: "Peak hour failures", icon: TrendingDown }
      ],
      notCovered: [
        { name: "Unsafe zones", icon: MapPin }
      ]
    },
    {
      name: "Premium",
      price: "₹699",
      period: "week",
      maxPayout: "₹10,000",
      features: [
        "Complete income protection",
        "Max payout: ₹10,000/week",
        "Premium AI risk insights",
        "UPI instant payout",
        "24/7 dedicated support",
        "Personal risk advisor",
        "Unsafe zone coverage"
      ],
      covered: [
        { name: "Rain", icon: Cloud },
        { name: "Storm", icon: Cloud },
        { name: "High Cancellations", icon: XCircle },
        { name: "Peak hour failures", icon: TrendingDown },
        { name: "Unsafe zones", icon: MapPin },
        { name: "All disruptions", icon: AlertCircle }
      ],
      notCovered: []
    }
  ];

  const comparison = [
    { feature: "Weather Protection", basic: true, standard: true, premium: true },
    { feature: "Cancellation Coverage", basic: false, standard: true, premium: true },
    { feature: "Unsafe Zone Protection", basic: false, standard: false, premium: true },
    { feature: "AI Risk Scoring", basic: "Basic", standard: "Advanced", premium: "Premium" },
    { feature: "Support", basic: "Email", standard: "Priority", premium: "24/7 Dedicated" },
    { feature: "Risk Alerts", basic: false, standard: true, premium: true },
    { feature: "Personal Advisor", basic: false, standard: false, premium: true }
  ];

  return (
    <div className="min-h-screen p-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Protection Plan</h1>
          <p className="text-lg text-gray-600">Flexible coverage options for every delivery partner's needs</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 items-stretch">
          {plans.map((plan, index) => {
            const isCurrent = currentPlan?.toLowerCase() === plan.name.toLowerCase();
            return (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 flex flex-col relative ${
                  isCurrent
                    ? "border-[#F97316] shadow-xl pt-14"
                    : "border-gray-200 shadow-sm hover:border-[#1E3A8A] hover:shadow-xl"
                }`}
              >
                {isCurrent && (
                  <div className="flex justify-center -mt-10 mb-6">
                    <span className="bg-[#F97316] text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-lg whitespace-nowrap border-2 border-white uppercase tracking-wider">
                      Your Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-3">
                    <span className="text-5xl font-bold text-[#1E3A8A]">{plan.price}</span>
                    <span className="text-gray-600 text-lg">/{plan.period}</span>
                  </div>
                  <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
                    Max Payout: {plan.maxPayout}/week
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Plan Features</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-[#14B8A6] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Covered Disruptions */}
                <div className="mb-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Covered Disruptions
                  </h4>
                  <div className="space-y-2">
                    {plan.covered.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-gray-700">
                        <item.icon className="w-4 h-4 text-green-500" />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Not Covered */}
                {plan.notCovered.length > 0 && (
                  <div className="mb-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-500 mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-gray-400" />
                      Not Covered
                    </h4>
                    <div className="space-y-2">
                      {plan.notCovered.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 text-gray-400">
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  disabled={isCurrent}
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    isCurrent
                      ? "bg-gray-100 text-gray-500 cursor-default"
                      : "bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90 hover:shadow-lg"
                  }`}
                >
                  {isCurrent ? "Current Coverage" : `Choose ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Detailed Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Basic</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Standard</th>
                  <th className="text-center py-4 px-4 font-semibold text-gray-900">Premium</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-4 text-gray-700">{row.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof row.basic === 'boolean' ? (
                        row.basic ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600">{row.basic}</span>
                      )}
                    </td>
                    <td className={`py-4 px-4 text-center ${currentPlan?.toLowerCase() === 'standard' ? 'bg-orange-50/50' : ''}`}>
                      {typeof row.standard === 'boolean' ? (
                        row.standard ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600 font-semibold">{row.standard}</span>
                      )}
                    </td>
                    <td className={`py-4 px-4 text-center ${currentPlan?.toLowerCase() === 'premium' ? 'bg-orange-50/50' : ''}`}>
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600 font-semibold">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help Choosing?</h2>
          <p className="text-gray-600 mb-6">
            Explore our flexible plans designed to protect your income against weather and transit disruptions.
          </p>
          <button className="px-8 py-3 bg-[#14B8A6] text-white rounded-xl hover:bg-[#14B8A6]/90 transition-colors font-semibold">
            Talk to an Advisor
          </button>
        </div>
      </div>
    </div>
  );
}
