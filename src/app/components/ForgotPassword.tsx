import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ChevronRight, ChevronLeft, Shield, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const startResendTimer = () => {
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
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/worker/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'forgot_password' })
      });
      const data = await response.json();
      if (response.ok) {
        setStep(2);
        startResendTimer();
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/worker/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, purpose: 'forgot_password' })
      });
      const data = await response.json();
      if (response.ok) {
        setStep(3);
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/worker/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setStep(4);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setError("Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#1E3A8A] to-[#14B8A6] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-[#1E3A8A]/5 rounded-2xl flex items-center justify-center">
                <Shield className="w-10 h-10 text-[#1E3A8A]" />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                <p className="text-gray-500 mb-8 font-medium">No worries, we'll send you reset instructions.</p>
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[#1E3A8A] focus:bg-white transition-all text-gray-900 font-medium"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#1E3A8A] text-white rounded-2xl font-bold hover:bg-[#1E3A8A]/90 transition-all shadow-lg shadow-[#1E3A8A]/25 flex items-center justify-center gap-2 group disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Code"}
                    {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
                <p className="text-gray-500 mb-8 font-medium">Enter the 6-digit code sent to<br/><span className="text-[#1E3A8A] font-bold">{email}</span></p>
                <form onSubmit={handleVerifyOtp} className="space-y-8">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full text-center text-4xl tracking-[12px] font-black py-5 border-2 border-gray-100 bg-gray-50 rounded-2xl focus:outline-none focus:border-[#1E3A8A] focus:bg-white transition-all"
                  />
                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={loading || otp.length !== 6}
                      className="w-full py-4 bg-[#1E3A8A] text-white rounded-2xl font-bold hover:bg-[#1E3A8A]/90 transition-all shadow-lg shadow-[#1E3A8A]/25 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Verify Code"}
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={resendTimer > 0 || loading}
                      className="text-sm font-bold text-[#1E3A8A] hover:underline disabled:text-gray-400 disabled:no-underline"
                    >
                      {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend OTP"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h2>
                <p className="text-gray-500 mb-8 font-medium">Your account is verified. Choose a strong new password.</p>
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[#1E3A8A] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 ml-1">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-[#1E3A8A] focus:bg-white transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#14B8A6] text-white rounded-2xl font-bold hover:bg-[#14B8A6]/90 transition-all shadow-lg shadow-[#14B8A6]/25 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Update Password"}
                  </button>
                </form>
              </div>
            )}

            {step === 4 && (
              <div className="animate-in fade-in zoom-in duration-500 text-center py-6">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <CheckCircle className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
                <p className="text-gray-500 mb-10 font-medium">Your password has been updated securely. You can now log in with your new credentials.</p>
                <Link
                  to="/login"
                  className="inline-block w-full py-4 bg-[#1E3A8A] text-white rounded-2xl font-bold hover:bg-[#1E3A8A]/90 transition-all shadow-lg shadow-[#1E3A8A]/25"
                >
                  Back to Login
                </Link>
              </div>
            )}
          </div>

          {step !== 4 && (
            <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 text-center">
              <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Wait, I remember my password
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
