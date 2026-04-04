import { Link } from "react-router";
import {
  Shield, Heart, Target, Eye, CloudRain, XCircle,
  MapPin, AlertTriangle, Truck, Phone, ArrowRight, CheckCircle
} from "lucide-react";

const coverageItems = [
  { icon: CloudRain, label: "Unexpected heavy rain during delivery", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: XCircle, label: "Failed or canceled deliveries", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: MapPin, label: "Unsafe delivery zones", color: "text-purple-500", bg: "bg-purple-50" },
  { icon: AlertTriangle, label: "Robbery, theft, or looting incidents", color: "text-red-500", bg: "bg-red-50" },
  { icon: Truck, label: "Road-related delivery disruptions", color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: Phone, label: "Emergency support during work-related incidents", color: "text-indigo-500", bg: "bg-indigo-50" },
];

const stats = [
  { value: "10,000+", label: "Delivery Partners Protected" },
  { value: "₹50L+", label: "Claims Paid Out" },
  { value: "3 Cities", label: "Active Coverage Zones" },
  { value: "< 2 min", label: "Average Claim Time" },
];

export function About() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#1E3A8A]/90 to-[#14B8A6] py-24 px-6">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#14B8A6]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4" />
            About SwiftShield
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Protecting the People Who Keep<br />
            <span className="text-[#14B8A6]">Our Cities Moving</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            A dedicated insurance platform built exclusively for food delivery gig workers —
            offering coverage tailored to the real challenges they face every single day.
          </p>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-[#1E3A8A]">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

        {/* Who We Are */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#1E3A8A]/10 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#1E3A8A]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Who We Are</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-4 text-gray-600 leading-relaxed">
            <p>
              At SwiftShield, we believe that the people who keep our cities moving deserve protection too.
              Every day, thousands of food delivery partners from platforms like <strong className="text-gray-900">Swiggy, Zomato, and Dunzo</strong> work
              through traffic, unpredictable weather, unsafe streets, and constant delivery pressure to ensure food reaches us on time.
            </p>
            <p>
              Yet despite their essential role, many of them remain vulnerable to risks that traditional insurance often overlooks.
            </p>
            <p className="text-[#1E3A8A] font-semibold text-lg">
              SwiftShield was created to change that.
            </p>
            <p>
              We are a dedicated insurance platform designed exclusively for food delivery gig workers, offering coverage
              tailored to the real challenges they face on the road every single day.
            </p>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#14B8A6]/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#14B8A6]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">What Makes Us Different</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
            <p className="text-gray-600 leading-relaxed">
              Traditional insurance plans usually focus only on general coverage like bike accidents, health emergencies, or vehicle damage.
              While these are important, they do not fully address the day-to-day realities of food delivery workers.
            </p>
            <p className="text-gray-600 leading-relaxed">
              At SwiftShield, we go beyond conventional protection by offering specialized insurance solutions built around the gig economy.
              Our platform provides coverage for unique and practical risks such as:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {coverageItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:shadow-sm transition-shadow"
                  >
                    <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <p className="text-sm text-gray-700 font-medium leading-snug mt-1">{item.label}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-[#1E3A8A] font-semibold pt-2">
              This makes SwiftShield not just another insurance website — but a platform built with empathy, practicality, and purpose.
            </p>
          </div>
        </section>

        {/* Our Mission */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <div className="relative bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-2xl p-8 text-white overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
            <p className="text-blue-100 mb-4 text-sm uppercase tracking-widest font-semibold">Our Mission is Simple</p>
            <p className="text-xl md:text-2xl font-bold leading-relaxed mb-6">
              To provide meaningful, affordable, and accessible insurance protection for food delivery workers
              who often work without adequate safety nets.
            </p>
            <p className="text-blue-100 leading-relaxed">
              We aim to create a system where delivery partners can work with greater confidence, knowing that they are
              supported during the unexpected challenges of their job.
            </p>
            <p className="mt-4 italic text-[#14B8A6] font-semibold">
              "Because when they take care of our daily needs, someone should be there to take care of theirs."
            </p>
          </div>
        </section>

        {/* Why SwiftShield Matters */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Why SwiftShield Matters</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
            <p className="text-gray-600 leading-relaxed">
              Food delivery workers are among the most active and exposed members of the gig workforce.
              From navigating crowded roads to entering unfamiliar neighborhoods, they encounter risks that are often invisible to others.
            </p>
            <div className="space-y-3">
              {[
                "A sudden downpour can ruin a shift.",
                "A failed delivery can impact earnings.",
                "An unsafe area can put personal safety at risk.",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                  <span className="text-orange-400 font-bold text-lg leading-none mt-0.5">→</span>
                  <p className="text-gray-800 font-semibold">{point}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-600 leading-relaxed">
              These are not rare situations — they are part of the job.
            </p>
            <p className="text-[#1E3A8A] font-semibold">
              SwiftShield exists to recognize these realities and offer protection that actually matches the work.
            </p>
          </div>
        </section>

        {/* Our Vision */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-4 text-gray-600 leading-relaxed">
            <p>
              We envision a future where gig workers are not treated as invisible contributors,
              but as <strong className="text-gray-900">professionals who deserve security, respect, and reliable support.</strong>
            </p>
            <p>
              With SwiftShield, we want to redefine what insurance means for delivery workers —
              making it <span className="text-[#1E3A8A] font-semibold">smarter, more relevant, and more human.</span>
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pb-4">
          <div className="bg-gradient-to-br from-[#1E3A8A]/5 to-[#14B8A6]/5 border border-[#14B8A6]/20 rounded-2xl p-10">
            <Shield className="w-12 h-12 text-[#1E3A8A] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Get Protected?</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Join thousands of delivery partners who trust SwiftShield for their daily protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1E3A8A] text-white rounded-xl font-semibold hover:bg-[#1E3A8A]/90 transition-all hover:shadow-lg hover:shadow-blue-900/20"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#1E3A8A] text-[#1E3A8A] rounded-xl font-semibold hover:bg-[#1E3A8A]/5 transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
