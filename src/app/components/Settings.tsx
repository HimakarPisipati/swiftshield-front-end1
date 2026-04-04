import * as React from "react";
import { useNavigate } from "react-router";
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  Lock, 
  Trash2, 
  Save, 
  Loader2, 
  AlertCircle, 
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Info,
  KeyRound,
  Send
} from "lucide-react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "./ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

export function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Profile state
  const [profile, setProfile] = React.useState({
    full_name: "",
    email: "",
    phone_number: "",
    upi_id: ""
  });

  // Password state
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Forgot password state (inline OTP flow)
  const [fpStep, setFpStep] = React.useState<'idle' | 'sent' | 'verified'>('idle');
  const [fpLoading, setFpLoading] = React.useState(false);
  const [fpError, setFpError] = React.useState<string | null>(null);
  const [fpSuccess, setFpSuccess] = React.useState<string | null>(null);
  const [fpOtp, setFpOtp] = React.useState("");
  const [fpResendTimer, setFpResendTimer] = React.useState(0);
  const [fpNewPassword, setFpNewPassword] = React.useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = React.useState("");

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const workerId = localStorage.getItem("workerId");
    if (!workerId) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/worker/profile/${workerId}`);
      const data = await response.json();
      if (data.success) {
        setProfile({
          full_name: data.worker.name || "",
          email: data.worker.email || "",
          phone_number: data.worker.phone_number || "",
          upi_id: data.worker.upi_id || ""
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const workerId = localStorage.getItem("workerId");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/worker/profile/${workerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");

      setSuccess("Profile updated successfully!");
      // Optionally refresh layout user data if it's cached globally
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    const workerId = localStorage.getItem("workerId");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/worker/password/${workerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Password update failed");

      setSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFpSendOtp = async () => {
    setFpLoading(true);
    setFpError(null);
    setFpSuccess(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/worker/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, purpose: 'forgot_password' })
      });
      const data = await res.json();
      if (res.ok) {
        setFpStep('sent');
        setFpResendTimer(60);
        const t = setInterval(() => setFpResendTimer(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; }), 1000);
      } else {
        setFpError(data.error || 'Failed to send OTP');
      }
    } catch {
      setFpError('Network error. Please try again.');
    } finally {
      setFpLoading(false);
    }
  };

  const handleFpVerifyOtp = async () => {
    setFpLoading(true);
    setFpError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/worker/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, code: fpOtp, purpose: 'forgot_password' })
      });
      const data = await res.json();
      if (res.ok) {
        setFpStep('verified');
      } else {
        setFpError(data.error || 'Invalid OTP');
      }
    } catch {
      setFpError('Verification failed.');
    } finally {
      setFpLoading(false);
    }
  };

  const handleFpResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fpNewPassword !== fpConfirmPassword) { setFpError('Passwords do not match'); return; }
    if (fpNewPassword.length < 6) { setFpError('Password must be at least 6 characters'); return; }
    setFpLoading(true);
    setFpError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/worker/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profile.email, code: fpOtp, newPassword: fpNewPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setFpSuccess('Password reset successfully! You can now use your new password.');
        setFpStep('idle');
        setFpOtp('');
        setFpNewPassword('');
        setFpConfirmPassword('');
      } else {
        setFpError(data.error || 'Reset failed');
      }
    } catch {
      setFpError('Server error. Please try again.');
    } finally {
      setFpLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const workerId = localStorage.getItem("workerId");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/worker/account/${workerId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        localStorage.removeItem("workerId");
        navigate("/");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete account");
      }
    } catch (err) {
      setError("Error deleting account");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#1E3A8A]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
        <p className="text-gray-500">Manage your profile, security preferences, and account status.</p>
      </div>

      {(error || success) && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          error ? "bg-red-50 border-red-100 text-red-700" : "bg-emerald-50 border-emerald-100 text-emerald-700"
        }`}>
          {error ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
          <p className="text-sm font-medium">{error || success}</p>
        </div>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-white border border-gray-100 shadow-sm mb-6 p-1 h-auto flex w-full sm:w-fit">
          <TabsTrigger value="profile" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" />
            Profile Info
          </TabsTrigger>
          <TabsTrigger value="security" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-[#1E3A8A] data-[state=active]:text-white">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="danger" className="px-6 py-2.5 rounded-lg data-[state=active]:bg-red-600 data-[state=active]:text-white text-red-600">
            <Trash2 className="w-4 h-4 mr-2" />
            Danger Zone
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-gray-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-50 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1E3A8A]/5 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  <CardDescription>Update your basic profile details and contact information.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-sm font-semibold">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        id="full_name" 
                        placeholder="John Doe" 
                        className="pl-10 h-11 rounded-xl"
                        value={profile.full_name}
                        onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        className="pl-10 h-11 rounded-xl"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="text-sm font-semibold">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        id="phone_number" 
                        placeholder="+91 98765 43210" 
                        className="pl-10 h-11 rounded-xl"
                        value={profile.phone_number}
                        onChange={(e) => setProfile({...profile, phone_number: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upi_id" className="text-sm font-semibold">UPI ID (for payouts)</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input 
                        id="upi_id" 
                        placeholder="username@okbank" 
                        className="pl-10 h-11 rounded-xl"
                        value={profile.upi_id}
                        onChange={(e) => setProfile({...profile, upi_id: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50/50 border-t border-gray-50 flex justify-end py-4 px-6">
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white px-8 h-11 rounded-xl shadow-lg shadow-blue-500/20"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-gray-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-50 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Password Management</CardTitle>
                  <CardDescription>Ensure your account is using a strong, unique password.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleChangePassword}>
              <CardContent className="pt-6 space-y-5 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    className="h-11 rounded-xl"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    className="h-11 rounded-xl"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    className="h-11 rounded-xl"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50/50 border-t border-gray-50 flex justify-end py-4 px-6">
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white h-11 px-8 rounded-xl"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Change Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Forgot Password Card */}
          <Card className="border-gray-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b border-gray-50 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <div>
                  <CardTitle className="text-xl">Forgot Password</CardTitle>
                  <CardDescription>Can't remember your current password? Reset it via email OTP.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5 max-w-md">
              {fpError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />{fpError}
                </div>
              )}
              {fpSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-700 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />{fpSuccess}
                </div>
              )}

              {fpStep === 'idle' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 font-medium">
                    A 6-digit verification code will be sent to: <span className="font-bold">{profile.email}</span>
                  </div>
                  <Button
                    type="button"
                    onClick={handleFpSendOtp}
                    disabled={fpLoading || !profile.email}
                    className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white h-11 rounded-xl flex items-center gap-2"
                  >
                    {fpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {fpLoading ? 'Sending...' : 'Send Reset Code'}
                  </Button>
                </div>
              )}

              {fpStep === 'sent' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Enter 6-digit OTP</Label>
                    <input
                      type="text"
                      maxLength={6}
                      value={fpOtp}
                      onChange={e => setFpOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      className="w-full text-center text-2xl tracking-[10px] font-bold py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#1E3A8A] transition-all bg-gray-50"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleFpVerifyOtp}
                    disabled={fpLoading || fpOtp.length !== 6}
                    className="w-full bg-[#14B8A6] hover:bg-[#14B8A6]/90 text-white h-11 rounded-xl"
                  >
                    {fpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Code'}
                  </Button>
                  <button
                    type="button"
                    onClick={handleFpSendOtp}
                    disabled={fpResendTimer > 0 || fpLoading}
                    className={`text-sm font-semibold w-full text-center ${ fpResendTimer > 0 ? 'text-gray-400' : 'text-[#1E3A8A] hover:underline' }`}
                  >
                    {fpResendTimer > 0 ? `Resend in ${fpResendTimer}s` : 'Resend OTP'}
                  </button>
                </div>
              )}

              {fpStep === 'verified' && (
                <form onSubmit={handleFpResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fpNew" className="text-sm font-semibold">New Password</Label>
                    <Input
                      id="fpNew"
                      type="password"
                      placeholder="Min 6 characters"
                      className="h-11 rounded-xl"
                      value={fpNewPassword}
                      onChange={e => setFpNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fpConfirm" className="text-sm font-semibold">Confirm New Password</Label>
                    <Input
                      id="fpConfirm"
                      type="password"
                      placeholder="Repeat new password"
                      className="h-11 rounded-xl"
                      value={fpConfirmPassword}
                      onChange={e => setFpConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={fpLoading}
                    className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white h-11 rounded-xl"
                  >
                    {fpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Danger Zone Tab */}
        <TabsContent value="danger" className="space-y-6">
          <Card className="border-red-100 shadow-sm overflow-hidden bg-red-50/30">
            <CardHeader className="bg-white border-b border-red-50 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl text-red-700">Delete Account</CardTitle>
                  <CardDescription>Permanently remove your account and all associated data.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                <p className="text-sm text-gray-700 leading-relaxed font-medium">
                  Deletions are permanent. This will remove:
                </p>
                <ul className="mt-3 space-y-2">
                  <li className="flex items-start text-xs text-gray-600 gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-red-400 mt-0.5" />
                    All active insurance policies and coverage history.
                  </li>
                  <li className="flex items-start text-xs text-gray-600 gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-red-400 mt-0.5" />
                    Your claim history and pending payout details.
                  </li>
                  <li className="flex items-start text-xs text-gray-600 gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-red-400 mt-0.5" />
                    All platform activity and risk assessments.
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="bg-white/50 border-t border-red-50 flex justify-between py-6 px-6">
              <p className="text-xs text-gray-500 font-medium max-w-xs">
                You will be immediately logged out and returned to the home screen.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 px-6 shadow-lg shadow-red-500/20 font-bold"
                  >
                    Permanently Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white rounded-2xl border-gray-100 shadow-2xl p-8">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto sm:mx-0">
                    <Trash2 className="w-8 h-8 text-red-600" />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold text-gray-900">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-500 text-base leading-relaxed">
                      This action is <span className="font-bold text-red-600">permanent</span> and cannot be undone. 
                      You will lose access to all your active insurance policies, claim history, and payouts immediately.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-8 gap-3">
                    <AlertDialogCancel className="h-11 rounded-xl border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-6 border-2">
                      No, Keep Account
                    </AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-500/20 font-bold px-8"
                    >
                      Yes, Delete Permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
