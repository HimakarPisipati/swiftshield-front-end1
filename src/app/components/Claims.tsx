import { useState, useEffect } from "react";
import { CheckCircle, Clock, Cloud, XCircle, MapPin, TrendingDown, Download, Search, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function Claims() {
  const [claims, setClaims] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [upiId, setUpiId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const workerId = localStorage.getItem('workerId') || '11111111-1111-1111-1111-111111111111';

    // Fetch profile to get real UPI ID
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/worker/profile/${workerId}`)
      .then(res => res.json())
      .then(d => { if (d.success) setUpiId(d.worker.upi_id || null); })
      .catch(() => {});

    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/engine/stats/${workerId}`)
      .then(res => res.json())
      .then(d => {
        if (d.recentPayouts) {
          const formatted = d.recentPayouts.map((p: any) => {
            const dateObj = new Date(p.created_at);
            
            let type = "General";
            let icon = CheckCircle;
            let color = "text-gray-500";
            let bgColor = "bg-gray-100";
            
            const r = p.reason.toLowerCase();
            if (r.includes('environmental') || r.includes('weather') || r.includes('rain')) {
              type = "Weather Disruption"; icon = Cloud; color = "text-blue-500"; bgColor = "bg-blue-100";
            } else if (r.includes('unlucky') || r.includes('cancellation')) {
              type = "Cancellation/Fail"; icon = XCircle; color = "text-orange-500"; bgColor = "bg-orange-100";
            } else if (r.includes('unsafe') || r.includes('location')) {
              type = "High Risk Zone"; icon = MapPin; color = "text-purple-500"; bgColor = "bg-purple-100";
            }
            
            return {
              id: "CLM-" + p.id.split('-')[0].toUpperCase(),
              type: type,
              icon: icon,
              color: color,
              bgColor: bgColor,
              amount: `₹${p.amount}`,
              date: dateObj.toLocaleDateString(),
              time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: p.status === 'APPROVED' ? 'paid' : 'processing',
              timeline: [
                { stage: "Event Detected", time: dateObj.toLocaleTimeString(), completed: true },
                { stage: "AI Verification", time: dateObj.toLocaleTimeString(), completed: true },
                { stage: "Claim Approved", time: dateObj.toLocaleTimeString(), completed: true },
                { stage: "Payout Processed", time: dateObj.toLocaleTimeString(), completed: true }
              ],
              details: {
                location: "Auto-detected Location",
                condition: p.reason,
                coverage: "Parametric Auto-Cover"
              }
            };
          });
          setClaims(formatted);
          
          setStats([
            { label: "Total Claims", value: formatted.length.toString(), change: "All time" },
            { label: "Amount Claimed", value: `₹${d.lossCovered || 0}`, change: "All time" },
            { label: "Success Rate", value: "100%", change: "Auto-approved" },
            { label: "Avg Processing", value: "< 1 min", change: "Ultra fast" }
          ]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleExportPDF = () => {
    setExporting(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const now = new Date();

      // ── Header banner ──────────────────────────────────────────
      doc.setFillColor(30, 58, 138); // #1E3A8A
      doc.rect(0, 0, pageWidth, 28, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('SwiftShield', 14, 12);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Parametric Insurance — Claims & Payouts Report', 14, 20);
      doc.setFontSize(8);
      doc.text(`Generated: ${now.toLocaleString()}`, pageWidth - 14, 20, { align: 'right' });

      // ── Section: Summary ───────────────────────────────────────
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Summary', 14, 38);

      const totalAmount = claims.reduce((sum, c) => {
        const val = parseFloat(c.amount.replace(/[^0-9.]/g, ''));
        return sum + (isNaN(val) ? 0 : val);
      }, 0);

      autoTable(doc, {
        startY: 42,
        head: [['Total Claims', 'Total Amount Paid', 'Success Rate', 'Avg Processing', 'Connected UPI']],
        body: [[
          claims.length.toString(),
          `Rs. ${totalAmount.toLocaleString()}`,
          '100%',
          '< 1 min',
          upiId || 'Not set'
        ]],
        theme: 'grid',
        headStyles: { fillColor: [20, 184, 166], textColor: 255, fontStyle: 'bold', fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        margin: { left: 14, right: 14 },
      });

      // ── Section: Claim Details ─────────────────────────────────
      const afterSummary = (doc as any).lastAutoTable.finalY + 10;
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Claim Details', 14, afterSummary);

      autoTable(doc, {
        startY: afterSummary + 4,
        head: [['Claim ID', 'Type', 'Amount', 'Date', 'Time', 'Status', 'Condition']],
        body: claims.map(c => [
          c.id,
          c.type,
          c.amount,
          c.date,
          c.time,
          c.status === 'paid' ? 'Paid ✓' : 'Processing',
          c.details?.condition || '—'
        ]),
        theme: 'striped',
        headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 8, textColor: [55, 65, 81] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        columnStyles: {
          0: { cellWidth: 28 },
          2: { halign: 'right', textColor: [5, 150, 105] },
          5: { halign: 'center' },
        },
        margin: { left: 14, right: 14 },
      });

      // ── Footer ─────────────────────────────────────────────────
      const pageCount = (doc.internal as any).getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(248, 250, 252);
        doc.rect(0, doc.internal.pageSize.getHeight() - 10, pageWidth, 10, 'F');
        doc.setTextColor(156, 163, 175);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('SwiftShield Parametric Insurance — Confidential', 14, doc.internal.pageSize.getHeight() - 3);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, doc.internal.pageSize.getHeight() - 3, { align: 'right' });
      }

      // ── Save ───────────────────────────────────────────────────
      doc.save(`SwiftShield_Claims_${now.toISOString().split('T')[0]}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading claims data...</div>;
  }


  return (
    <div className="min-h-screen p-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Claims & Payouts</h1>
          <p className="text-gray-600">Track your claim status and payout history</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Filter and Search */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by claim ID, type, or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]">
                <option>All Status</option>
                <option>Paid</option>
                <option>Processing</option>
              </select>
              <button
                onClick={handleExportPDF}
                disabled={exporting || claims.length === 0}
                className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-[#1E3A8A] hover:text-white hover:border-[#1E3A8A] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
              >
                {exporting
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Download className="w-4 h-4" />
                }
                {exporting ? 'Generating...' : 'Export PDF'}
              </button>
            </div>
          </div>
        </div>

        {/* Claims List */}
        <div className="space-y-6">
          {claims.map((claim, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Claim Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`${claim.bgColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                      <claim.icon className={`w-6 h-6 ${claim.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{claim.type}</h3>
                      <p className="text-sm text-gray-600">{claim.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{claim.amount}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                      claim.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {claim.status === 'paid' ? 'Paid' : 'Processing'}
                    </span>
                  </div>
                </div>

                {/* Claim Details */}
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Location</p>
                    <p className="text-gray-900 font-semibold">{claim.details.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Condition</p>
                    <p className="text-gray-900 font-semibold">{claim.details.condition}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Coverage Type</p>
                    <p className="text-gray-900 font-semibold">{claim.details.coverage}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-4">Processing Timeline</h4>
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div
                    className="absolute left-4 top-0 w-0.5 bg-[#14B8A6] transition-all duration-500"
                    style={{
                      height: `${(claim.timeline.filter(t => t.completed).length / claim.timeline.length) * 100}%`
                    }}
                  ></div>

                  {/* Timeline Steps */}
                  <div className="space-y-6 relative">
                    {claim.timeline.map((step, i) => (
                      <div key={i} className="flex items-center gap-4 relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          step.completed
                            ? 'bg-[#14B8A6] text-white'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <div>
                            <p className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                              {step.stage}
                            </p>
                            <p className="text-sm text-gray-500">{claim.date} at {step.time}</p>
                          </div>
                          {step.completed && i === claim.timeline.length - 1 && (
                            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold">
                              <CheckCircle className="w-4 h-4" />
                              <span>Credited to UPI</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* UPI Confirmation Section */}
        <div className="mt-8 bg-gradient-to-r from-[#1E3A8A] to-[#14B8A6] rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">UPI Instant Payouts Enabled</h3>
              <p className="text-blue-100">Receive compensation directly to your UPI ID within minutes</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center">
              <p className="text-sm text-blue-100 mb-1">Connected UPI</p>
              <p className="text-xl font-bold">
                {upiId || 'Not set'}
              </p>
              {!upiId && (
                <p className="text-xs text-blue-200 mt-1">Add your UPI ID in Settings</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
