import { Link } from "react-router";
import { Shield, Zap, Clock, TrendingUp, CheckCircle, Cloud, XCircle, MapPin } from "lucide-react";

export function LandingPage() {
  const scrollToPricing = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: TrendingUp,
      title: "AI Risk Scoring",
      description: "Smart algorithms predict and protect against income loss"
    },
    {
      icon: Zap,
      title: "Instant Payouts",
      description: "Automatic UPI transfers within minutes of trigger"
    },
    {
      icon: Shield,
      title: "Fraud Protection",
      description: "Advanced detection prevents false claims"
    }
  ];

  const howItWorks = [
    { step: "1", title: "Choose Plan", description: "Select coverage that fits your needs" },
    { step: "2", title: "AI Monitors Risk", description: "Real-time tracking of weather & events" },
    { step: "3", title: "Auto Payout", description: "Get compensated automatically" }
  ];

  const plans = [
    {
      name: "Basic",
      price: "₹199",
      period: "week",
      features: [
        "Weather disruption coverage",
        "Max payout: ₹2,000/week",
        "Basic risk monitoring",
        "UPI instant payout"
      ],
      covered: ["Rain", "Storm"],
      notCovered: ["Cancellations", "Unsafe zones"]
    },
    {
      name: "Standard",
      price: "₹399",
      period: "week",
      popular: true,
      features: [
        "Full weather + cancellation coverage",
        "Max payout: ₹5,000/week",
        "Advanced AI risk scoring",
        "Priority support"
      ],
      covered: ["Rain", "Storm", "High Cancellations", "Peak hour failures"],
      notCovered: ["Unsafe zones"]
    },
    {
      name: "Premium",
      price: "₹699",
      period: "week",
      features: [
        "Complete income protection",
        "Max payout: ₹10,000/week",
        "Premium risk insights",
        "24/7 dedicated support"
      ],
      covered: ["Rain", "Storm", "Cancellations", "Unsafe zones", "All disruptions"],
      notCovered: []
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100 bg-white">
              <img src="/favicon.png" alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-xl font-semibold text-[#1E3A8A]">SwiftShield</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToPricing}
              className="text-gray-700 hover:text-[#1E3A8A] transition-colors cursor-pointer font-medium"
            >
              Pricing
            </button>
            <Link to="/login" className="px-6 py-2 bg-[#1E3A8A] text-white rounded-xl hover:bg-[#1E3A8A]/90 transition-colors font-medium">
              Log In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1E3A8A] via-[#1E3A8A] to-[#14B8A6] text-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Protect Your Weekly Earnings with AI Insurance
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Smart parametric coverage for delivery partners against weather, cancellations, and disruptions
              </p>
              <div className="flex gap-4">
                <Link
                  to="/onboarding"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg transition-transform hover:scale-105"
                >
                  Get Covered
                </Link>
                <button
                  onClick={scrollToPricing}
                  className="px-8 py-4 bg-white text-[#1E3A8A] rounded-xl hover:bg-gray-100 transition-colors font-semibold shadow-lg hover:shadow-xl cursor-pointer"
                >
                  View Plans
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="flex items-center justify-center mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border border-white/50">
                      <img src="/favicon.png" alt="Logo" className="w-24 h-24 object-contain" />
                    </div>
                    <Cloud className="w-12 h-12 text-[#F97316] absolute -top-4 -right-4" />
                    <MapPin className="w-10 h-10 text-yellow-300 absolute -bottom-4 -left-4" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly Earnings Protected</span>
                      <span className="font-bold">₹8,500</span>
                    </div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Risk Level</span>
                      <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold">Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose SwiftShield?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#F8FAFC] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-[#1E3A8A] rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Choose Your Protection Plan</h2>
          <p className="text-center text-gray-600 mb-12">Flexible coverage for every delivery partner</p>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 border-2 ${plan.popular ? "border-[#F97316] shadow-xl scale-105" : "border-gray-200"
                  } relative hover:shadow-lg transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#F97316] text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Recommended
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#1E3A8A]">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#14B8A6] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mb-6 pt-4 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Covered Disruptions:</p>
                  <div className="space-y-1">
                    {plan.covered.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                    {plan.notCovered.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                        <XCircle className="w-4 h-4 text-gray-300" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/onboarding"
                  className={`block w-full py-3 rounded-xl text-center font-semibold transition-colors ${plan.popular
                      ? "bg-[#F97316] text-white hover:bg-[#F97316]/90"
                      : "bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90"
                    }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E3A8A] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src="/favicon.png" alt="Logo" className="w-6 h-6 object-contain brightness-0 invert" />
                </div>
                <span className="font-semibold text-lg">SwiftShield</span>
              </div>
              <p className="text-blue-200 text-sm">
                AI-powered parametric insurance for gig delivery partners
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>
                  <button
                    onClick={scrollToPricing}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Pricing
                  </button>
                </li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-700 mt-8 pt-8 text-center text-sm text-blue-200">
            © 2026 SwiftShield. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
