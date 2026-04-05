import { Link } from "react-router";
import { Shield, Users, Target, Zap, Award, HeartHandshake, TrendingUp } from "lucide-react";

export function About() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-15"></div>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1E3A8A] text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-blue-100">
            <Award className="w-4 h-4" />
            About SwiftShield
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
            Protecting Income,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] to-[#14B8A6]">
              Empowering Lives
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            SwiftShield is a modern insurance technology platform built to make income protection
            simple, transparent, and accessible for everyone. We combine AI-driven fraud detection
            with a human-first approach to claims management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              to="/onboarding"
              className="bg-[#1E3A8A] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#1E3A8A]/90 transition-colors shadow-md"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white border border-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Target className="w-7 h-7 text-[#1E3A8A]" />,
              title: "Our Mission",
              desc: "To deliver fast, fair, and frictionless insurance experiences that give policyholders peace of mind when they need it most.",
            },
            {
              icon: <TrendingUp className="w-7 h-7 text-[#14B8A6]" />,
              title: "Our Vision",
              desc: "A world where every worker is protected against unexpected income loss through smart, technology-powered insurance solutions.",
            },
            {
              icon: <HeartHandshake className="w-7 h-7 text-purple-600" />,
              title: "Our Values",
              desc: "Integrity, transparency, and innovation guide everything we do — from product design to claims resolution.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-3xl p-8 shadow-lg shadow-blue-900/5 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-5 border border-gray-100">
                {icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="relative z-10 py-16 px-4 bg-white/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[#1E3A8A] font-semibold mb-3">
              <Users className="w-5 h-5" />
              <span>The Team</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Built by Innovators</h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              A passionate team of engineers, designers, and insurance experts working together at the Guidewire Hackathon.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Team Member", role: "Frontend Engineering" },
              { name: "Team Member", role: "Backend Engineering" },
              { name: "Team Member", role: "AI & ML" },
              { name: "Team Member", role: "Product & Design" },
            ].map(({ name, role }, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-lg transition-all text-center"
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl"
                  style={{
                    background: `linear-gradient(135deg, hsl(${i * 60 + 220}, 70%, 50%), hsl(${i * 60 + 180
                      }, 70%, 40%))`,
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <p className="font-semibold text-gray-900">{name}</p>
                <p className="text-sm text-gray-500 mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Why SwiftShield?</h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              We bring together cutting-edge technology and genuine care for our customers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Zap className="w-6 h-6 text-yellow-500" />, label: "Lightning Fast Claims", value: "< 24hr" },
              { icon: <Shield className="w-6 h-6 text-[#1E3A8A]" />, label: "Fraud Detection Accuracy", value: "99.2%" },
              { icon: <Users className="w-6 h-6 text-[#14B8A6]" />, label: "Happy Policyholders", value: "10,000+" },
              { icon: <Award className="w-6 h-6 text-purple-600" />, label: "Industry Awards", value: "5+" },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {icon}
                </div>
                <p className="text-3xl font-extrabold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-3xl p-10 text-center text-white shadow-2xl shadow-blue-900/20">
          <h2 className="text-3xl font-extrabold mb-4">Ready to get protected?</h2>
          <p className="text-blue-100 mb-8">
            Join thousands of workers who trust SwiftShield for their income protection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/onboarding"
              className="bg-white text-[#1E3A8A] font-semibold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors shadow-md"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white/10 border border-white/30 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/20 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-sm text-gray-400 border-t border-gray-100">
        <Link to="/" className="text-[#1E3A8A] font-semibold hover:underline">← Back to Home</Link>
        <p className="mt-2">© {new Date().getFullYear()} SwiftShield. All rights reserved.</p>
      </footer>
    </div>
  );
}
