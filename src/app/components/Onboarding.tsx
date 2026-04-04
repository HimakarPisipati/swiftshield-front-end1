import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ChevronRight, ChevronLeft, Shield, User, Smartphone, MapPin, CreditCard, CheckCircle } from "lucide-react";

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    platform: "",
    gpsEnabled: false,
    activityTracking: false,
    plan: "standard",
    upiId: ""
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const totalSteps = 6;

  const platforms = [
    { id: "zomato", name: "Zomato", logo: "🍔" },
    { id: "swiggy", name: "Swiggy", logo: "🍕" },
    { id: "uber", name: "Uber Eats", logo: "🛵" },
    { id: "dunzo", name: "Dunzo", logo: "📦" },
    { id: "other", name: "Other", logo: "🏪" }
  ];

  const plans = [
    { id: "basic", name: "Basic", price: "₹199", maxPayout: "₹2,000" },
    { id: "standard", name: "Standard", price: "₹399", maxPayout: "₹5,000", recommended: true },
    { id: "premium", name: "Premium", price: "₹699", maxPayout: "₹10,000" }
  ];

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    console.log("📨 [DEBUG] Sending OTP using URL:", apiUrl);
    try {
      const response = await fetch(`${apiUrl}/api/worker/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, purpose: 'registration' })
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setStep(2);
        setResendTimer(60);
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error("OTP Send Fetch Error:", err);
      setError("Network error: " + (err instanceof Error ? err.message : "Connection failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      handleSendOtp();
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setError("");
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      console.log("📝 [DEBUG] Registering using URL:", apiUrl);
      try {
        const response = await fetch(`${apiUrl}/api/worker/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: formData.name,
            email: formData.email,
            phone_number: formData.phone,
            password: formData.password,
            plan: formData.plan,
            upi_id: formData.upiId,
            platform: formData.platform,
            otp: otp
          })
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('workerId', data.worker.id);
          navigate("/dashboard");
        } else {
          setError(data.error || "Failed to create account");
          setLoading(false);
        }
      } catch (err) {
        console.error("Onboarding Register Error:", err);
        setError("Network error: " + (err instanceof Error ? err.message : "Connection failed"));
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name.length > 0 && 
               formData.phone.length === 10 && 
               formData.email.includes("@") &&
               formData.password.length >= 6 &&
               formData.password === formData.confirmPassword;
      case 2:
        return otp.length === 6;
      case 3:
        return formData.platform.length > 0;
      case 4:
        return formData.gpsEnabled && formData.activityTracking;
      case 5:
        return formData.plan.length > 0;
      case 6:
        return formData.upiId.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#1E3A8A] to-[#14B8A6] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm font-semibold">Step {step} of {totalSteps}</span>
            <span className="text-blue-200 text-sm">{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Step 1: Basic Details */}
          {step === 1 && (
            <div>
              <div className="w-16 h-16 bg-[#1E3A8A] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome to SwiftShield</h2>
              <p className="text-gray-600 text-center mb-8">Let's get started with your basic information</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#1E3A8A] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#1E3A8A] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#1E3A8A] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    placeholder="Create a strong password (min 6 chars)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#1E3A8A] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    placeholder="Re-enter your password"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-[#1E3A8A]'
                    }`}
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">Passwords do not match.</p>
                  )}
                </div>
              </div>
              {error && step === 1 && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mt-4 text-sm font-medium border border-red-200">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div>
              <div className="w-16 h-16 bg-[#14B8A6] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Verify Your Email</h2>
              <p className="text-gray-600 text-center mb-8">We've sent a 6-digit code to <strong>{formData.email}</strong></p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Verification Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-4 text-center text-2xl tracking-[12px] font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#1E3A8A] transition-colors"
                  />
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-4">Didn't receive the code?</p>
                  <button
                    onClick={handleSendOtp}
                    disabled={resendTimer > 0 || loading}
                    className={`font-semibold transition-colors ${
                      resendTimer > 0 || loading 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-[#1E3A8A] hover:text-[#1E3A8A]/80'
                    }`}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                  </button>
                </div>
              </div>

              {error && step === 2 && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mt-4 text-sm font-medium border border-red-200">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Select Platform */}
          {step === 3 && (
            <div>
              <div className="w-16 h-16 bg-[#1E3A8A] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Select Your Platform</h2>
              <p className="text-gray-600 text-center mb-8">Which delivery platform do you work with?</p>

              <div className="grid grid-cols-2 gap-4">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => updateFormData("platform", platform.id)}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      formData.platform === platform.id
                        ? "border-[#1E3A8A] bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-4xl mb-2">{platform.logo}</div>
                    <p className="font-semibold text-gray-900">{platform.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Permissions */}
          {step === 4 && (
            <div>
              <div className="w-16 h-16 bg-[#1E3A8A] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Enable Tracking</h2>
              <p className="text-gray-600 text-center mb-8">We need these permissions to protect your income</p>

              <div className="space-y-4">
                <div
                  onClick={() => updateFormData("gpsEnabled", !formData.gpsEnabled)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.gpsEnabled ? "border-[#14B8A6] bg-teal-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-6 h-6 text-[#1E3A8A]" />
                        <h3 className="font-semibold text-gray-900">GPS Location Access</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Track your location to verify weather conditions and unsafe zones
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4 ${
                      formData.gpsEnabled ? "bg-[#14B8A6] border-[#14B8A6]" : "border-gray-300"
                    }`}>
                      {formData.gpsEnabled && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => updateFormData("activityTracking", !formData.activityTracking)}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.activityTracking ? "border-[#14B8A6] bg-teal-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Smartphone className="w-6 h-6 text-[#1E3A8A]" />
                        <h3 className="font-semibold text-gray-900">Activity Tracking</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Monitor your delivery activity to detect disruptions automatically
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4 ${
                      formData.activityTracking ? "bg-[#14B8A6] border-[#14B8A6]" : "border-gray-300"
                    }`}>
                      {formData.activityTracking && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 flex gap-3 mt-6">
                  <Shield className="w-5 h-5 text-[#1E3A8A] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Your data is encrypted and only used for insurance verification. We never share your information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Choose Plan */}
          {step === 5 && (
            <div>
              <div className="w-16 h-16 bg-[#1E3A8A] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Choose Your Plan</h2>
              <p className="text-gray-600 text-center mb-8">Select the coverage that fits your needs</p>

              <div className="space-y-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => updateFormData("plan", plan.id)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all relative ${
                      formData.plan === plan.id
                        ? "border-[#F97316] bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-6">
                        <span className="bg-[#F97316] text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Recommended
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">Max payout: {plan.maxPayout}/week</p>
                        <p className="text-2xl font-bold text-[#1E3A8A]">
                          {plan.price}<span className="text-sm text-gray-600">/week</span>
                        </p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.plan === plan.id ? "bg-[#F97316] border-[#F97316]" : "border-gray-300"
                      }`}>
                        {formData.plan === plan.id && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: UPI ID */}
          {step === 6 && (
            <div>
              <div className="w-16 h-16 bg-[#1E3A8A] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Add UPI ID</h2>
              <p className="text-gray-600 text-center mb-8">Instant payouts will be sent to this UPI ID</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">UPI ID</label>
                  <input
                    type="text"
                    value={formData.upiId}
                    onChange={(e) => updateFormData("upiId", e.target.value)}
                    placeholder="yourname@upi"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-[#1E3A8A] transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Supports all UPI apps: Google Pay, PhonePe, Paytm, etc.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-[#14B8A6] flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">You're All Set!</h4>
                      <p className="text-sm text-gray-600">
                        Once you confirm, your coverage will be activated immediately and you'll receive instant payouts for any disruptions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {error && (step === 2 || step === 6) && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mt-4 text-sm font-medium border border-red-200">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isStepValid() || loading}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                isStepValid() && !loading
                  ? "bg-[#1E3A8A] text-white hover:bg-[#1E3A8A]/90"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Registering..." : (step === 1 ? "Verify Email" : (step === totalSteps ? "Complete Setup" : "Continue"))}
              {!loading && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              Already registered?{" "}
              <Link to="/login" className="font-semibold text-[#1E3A8A] hover:text-[#1E3A8A]/80 transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
