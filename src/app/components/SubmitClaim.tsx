import { useState } from "react";
import { Link } from "react-router";
import {
  CloudRain, XCircle, MapPin, FileText,
  ChevronRight, ChevronLeft, CheckCircle,
  Loader2, Shield, ArrowRight
} from "lucide-react";

const WORKER_ID = localStorage.getItem('workerId') || '11111111-1111-1111-1111-111111111111';

const CLAIM_TYPES = [
  {
    id: "weather",
    label: "Weather Disruption",
    description: "Heavy rain, extreme heat, or severe weather prevented you from working",
    icon: CloudRain,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
    selectedBorder: "border-blue-500",
    selectedBg: "bg-blue-50",
    amount: 80,
  },
  {
    id: "delivery",
    label: "Failed Delivery",
    description: "Customer unresponsive, cancelled order, or multiple failed attempts",
    icon: XCircle,
    color: "text-orange-500",
    bg: "bg-orange-50",
    border: "border-orange-200",
    selectedBorder: "border-orange-500",
    selectedBg: "bg-orange-50",
    amount: 40,
  },
  {
    id: "unsafe",
    label: "Unsafe Zone",
    description: "You entered or were assigned to a high-risk area during your shift",
    icon: MapPin,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-200",
    selectedBorder: "border-purple-500",
    selectedBg: "bg-purple-50",
    amount: 100,
  },
  {
    id: "custom",
    label: "Other Incident",
    description: "Any other work-related disruption not covered above",
    icon: FileText,
    color: "text-gray-500",
    bg: "bg-gray-50",
    border: "border-gray-200",
    selectedBorder: "border-gray-500",
    selectedBg: "bg-gray-50",
    amount: 50,
  },
];

export function SubmitClaim() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const claimType = CLAIM_TYPES.find(c => c.id === selectedType);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    console.log("📝 [DEBUG] Submitting Claim using URL:", apiUrl);
    
    try {
      const res = await fetch(`${apiUrl}/api/engine/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: WORKER_ID,
          claimType: selectedType,
          description,
          location,
          incidentTime: incidentTime || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Submission failed.");
      } else {
        setResult(data);
        setStep(4);
      }
    } catch (e) {
      setError("Could not connect to backend. Is the server running?");
    } finally {
      setSubmitting(false);
    }
  };

  const steps = ["Select Type", "Incident Details", "Review", "Confirmation"];

  return (
    <div className="min-h-screen p-8 bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit a Claim</h1>
          <p className="text-gray-600">File a parametric insurance claim in under 2 minutes</p>
        </div>

        {/* Progress Steps */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-8">
            {steps.slice(0, 3).map((label, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
                  step > i + 1
                    ? "bg-[#14B8A6] text-white"
                    : step === i + 1
                    ? "bg-[#1E3A8A] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}>
                  {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? "text-[#1E3A8A]" : "text-gray-400"}`}>
                  {label}
                </span>
                {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${step > i + 1 ? "bg-[#14B8A6]" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1 — Select Claim Type */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">What happened?</h2>
            <p className="text-gray-600 mb-6">Select the type of incident you experienced</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {CLAIM_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                      isSelected
                        ? `${type.selectedBorder} ${type.selectedBg} shadow-md`
                        : `${type.border} bg-white hover:${type.selectedBg}`
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg ${type.bg} flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${type.color}`} />
                    </div>
                    <p className="font-semibold text-gray-900 mb-1">{type.label}</p>
                    <p className="text-sm text-gray-500">{type.description}</p>
                    <div className={`mt-3 inline-flex items-center gap-1 text-sm font-bold ${type.color}`}>
                      ₹{type.amount} payout
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              disabled={!selectedType}
              onClick={() => setStep(2)}
              className="w-full py-3 bg-[#1E3A8A] text-white rounded-xl font-semibold hover:bg-[#1E3A8A]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2 — Incident Details */}
        {step === 2 && claimType && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-lg ${claimType.bg} flex items-center justify-center`}>
                <claimType.icon className={`w-5 h-5 ${claimType.color}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{claimType.label}</h2>
                <p className="text-sm text-gray-500">Provide incident details</p>
              </div>
            </div>

            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description 
                  
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Briefly describe what happened during your shift..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] resize-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Koramangala, Bangalore"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Incident Date & Time <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="datetime-local"
                  value={incidentTime}
                  onChange={e => setIncidentTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] text-gray-900"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-2 flex-1 py-3 bg-[#1E3A8A] text-white rounded-xl font-semibold hover:bg-[#1E3A8A]/90 transition-colors flex items-center justify-center gap-2"
              >
                Review Claim <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && claimType && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Claim</h2>

            {/* Payout Highlight */}
            <div className="bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-2xl p-6 text-white mb-6 text-center">
              <p className="text-blue-100 text-sm mb-1">Parametric Payout Amount</p>
              <p className="text-5xl font-bold mb-1">₹{claimType.amount}</p>
              <p className="text-blue-100 text-xs">Instant UPI transfer upon approval</p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                { label: "Claim Type", value: claimType.label },
                { label: "Description", value: description || "—" },
                { label: "Location", value: location || "—" },
                { label: "Incident Time", value: incidentTime ? new Date(incidentTime).toLocaleString() : "Now" },
                { label: "Status after submission", value: "Auto-Approved ✅" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start border-b border-gray-100 pb-3">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className="text-gray-900 font-semibold text-sm text-right max-w-[55%]">{value}</span>
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                disabled={submitting}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-3 bg-[#14B8A6] text-white rounded-xl font-semibold hover:bg-[#14B8A6]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                ) : (
                  <>Submit Claim <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Confirmation */}
        {step === 4 && result && (
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-200 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Claim Approved! 🎉</h2>
            <p className="text-gray-600 mb-8">Your claim has been auto-approved and payout is being processed.</p>

            <div className="bg-gradient-to-br from-[#1E3A8A] to-[#14B8A6] rounded-2xl p-6 text-white mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="text-left">
                  <p className="text-blue-100 text-xs mb-1">Claim ID</p>
                  <p className="font-bold text-lg">{result.claimId}</p>
                </div>
                <Shield className="w-10 h-10 text-white/50" />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-blue-100 text-xs mb-1">Payout Amount</p>
                  <p className="text-4xl font-bold">₹{result.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100 text-xs mb-1">Status</p>
                  <span className="bg-green-400 text-green-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
                    {result.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                to="/claims"
                className="flex-1 py-3 bg-[#1E3A8A] text-white rounded-xl font-semibold hover:bg-[#1E3A8A]/90 transition-colors flex items-center justify-center gap-2"
              >
                View All Claims <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => { setStep(1); setSelectedType(null); setDescription(""); setLocation(""); setIncidentTime(""); setResult(null); }}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Submit Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
