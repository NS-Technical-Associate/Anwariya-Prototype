import { useEffect, useState } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function Products() {
  const vendorId = Number(localStorage.getItem("userId"));
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    cost: "",
    qty: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api(`/products?vendor_id=${vendorId}`)
      .then((data) => setProducts(data || []))
      .finally(() => setLoading(false));
  }, [vendorId]);

  const handleAdd = async () => {
    if (!form.name || !form.cost || !form.qty) return;
    setSaving(true);

    const newProduct = await api("/products", {
      method: "POST",
      body: JSON.stringify({
        vendor_id: vendorId,
        product_name: form.name,
        cost_price: Number(form.cost),
        quantity_available: Number(form.qty),
      }),
    });

    setProducts([...products, newProduct]);
    setForm({ name: "", cost: "", qty: "" });
    setSaving(false);
  };

  return (
    <PageWrapper title="Inventory">
      {/* ADD PRODUCT FORM */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-white mb-4">
          Add New Product
        </h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <input
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-slate-900 text-white border border-slate-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Cost price"
            type="number"
            value={form.cost}
            onChange={(e) => setForm({ ...form, cost: e.target.value })}
            className="bg-slate-900 text-white border border-slate-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            placeholder="Quantity"
            type="number"
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: e.target.value })}
            className="bg-slate-900 text-white border border-slate-600 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium shadow-lg disabled:opacity-60 transition"
        >
          {saving ? "Adding..." : "Add Product"}
        </button>
      </div>

      {/* PRODUCT LIST */}
      {loading ? (
        <div className="text-center text-slate-400 py-20">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <h2 className="text-lg font-medium text-white">No products yet</h2>
          <p className="text-slate-400 mt-2">
            Add products to start selling.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6
                         transition-all duration-300 hover:-translate-y-1 hover:bg-slate-700
                         hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer"
            >
              <h3 className="text-white font-semibold text-lg mb-2">
                {p.product_name}
              </h3>
              <p className="text-slate-300 text-sm mb-1">
                Stock: {p.quantity_available}
              </p>
              <p className="text-slate-400 text-sm">
                Cost: ₹{p.cost_price}
              </p>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}