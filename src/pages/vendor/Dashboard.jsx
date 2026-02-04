import { useEffect, useState } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#7c3aed", "#22c55e", "#f97316", "#0ea5e9"];

export default function VendorDashboard() {
  const vendorId = Number(localStorage.getItem("userId"));
  const [data, setData] = useState(null);

  useEffect(() => {
    api(`/analytics/${vendorId}`).then(setData);
  }, [vendorId]);

  if (!data) {
    return (
      <PageWrapper title="Sales Analytics">
        <div className="min-h-screen flex items-center justify-center text-gray-400 animate-pulse">
          Loading analytics...
        </div>
      </PageWrapper>
    );
  }

  const sales = data.sales || [];
  const lowStock = data.low_stock || [];
  const kpis = data.kpis || {};

  return (
    <PageWrapper title="Sales Analytics">
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 space-y-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Sales Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Track your sales, profits, and stock performance
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          <KPI label="Total Profit" value={`₹${kpis.total_profit || 0}`} />
          <KPI label="Units Sold" value={kpis.total_units || 0} />
          <KPI label="Products Sold" value={kpis.product_count || 0} />
        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* PIE CHART */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg shadow-indigo-500/20">
            <h3 className="text-white font-semibold mb-4">Sales Distribution</h3>
            {sales.length === 0 ? (
              <p className="text-gray-400 text-sm">No sales data</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sales}
                    dataKey="quantity"
                    nameKey="name"
                    outerRadius={120}
                  >
                    {sales.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", borderRadius: 8, border: "none" }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* BAR CHART */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg shadow-indigo-500/20">
            <h3 className="text-white font-semibold mb-4">Profit by Product</h3>
            {sales.length === 0 ? (
              <p className="text-gray-400 text-sm">No profit data</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sales}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", borderRadius: 8, border: "none" }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="profit" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* LOW STOCK */}
        {lowStock.length > 0 && (
          <div className="bg-red-800/20 border border-red-700 text-red-300 rounded-2xl p-6">
            <h4 className="font-semibold mb-2 text-red-100">Low Stock Alert</h4>
            <ul className="text-sm space-y-1">
              {lowStock.map((p) => (
                <li key={p.product_name}>
                  {p.product_name} — {p.quantity_available} left
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI INSIGHT */}
        {data.insight && (
          <div className="bg-blue-800/20 border border-blue-700 text-blue-300 rounded-2xl p-6">
            <h3 className="font-semibold mb-2 text-blue-100">AI Insights</h3>
            <p className="text-sm whitespace-pre-line">{data.insight}</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

function KPI({ label, value }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 shadow-lg shadow-indigo-500/20 text-center hover:shadow-indigo-500/40 transition">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-white text-xl font-bold mt-2">{value}</p>
    </div>
  );
}