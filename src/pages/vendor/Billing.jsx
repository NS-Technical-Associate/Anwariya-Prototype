import { useEffect, useState } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function Billing() {
  const vendorId = Number(localStorage.getItem("userId"));
  const [products, setProducts] = useState([]);
  const [bill, setBill] = useState({
    productId: "",
    qty: "",
    price: "",
  });
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    api(`/products?vendor_id=${vendorId}`).then(setProducts);
  }, [vendorId]);

  const selected = products.find(
    (p) => p.id === Number(bill.productId)
  );

  const handleGenerate = async () => {
    const res = await api("/bills", {
      method: "POST",
      body: JSON.stringify({
        vendor_id: vendorId,
        product_id: Number(bill.productId),
        quantity: Number(bill.qty),
        selling_price: Number(bill.price),
      }),
    });

    setSummary(res);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-950 px-6 py-14 flex justify-center">

        {/* CARD */}
        <div
          className="
            w-full max-w-xl
            bg-slate-900
            border border-slate-800
            rounded-3xl
            p-8 space-y-6
            shadow-xl shadow-blue-500/10
            ring-1 ring-blue-500/20
            animate-fadeIn
          "
        >
          {/* HEADER */}
          <div className="border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-semibold text-blue-400">
              Generate Bill
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Create a billing summary for sold products
            </p>
          </div>

          {/* PRODUCT SELECT */}
          <select
            className="
              w-full
              bg-slate-900
              border border-slate-700
              p-3
              rounded-xl
              text-slate-200
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/40
            "
            onChange={(e) =>
              setBill({ ...bill, productId: e.target.value })
            }
          >
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.product_name} (Stock: {p.quantity_available})
              </option>
            ))}
          </select>

          {/* QUANTITY */}
          <input
            type="number"
            placeholder="Quantity sold"
            className="
              w-full
              bg-slate-900
              border border-slate-700
              p-3
              rounded-xl
              text-slate-200
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/40
            "
            onChange={(e) =>
              setBill({ ...bill, qty: e.target.value })
            }
          />

          {/* PRICE */}
          <input
            type="number"
            placeholder="Selling price per unit"
            className="
              w-full
              bg-slate-900
              border border-slate-700
              p-3
              rounded-xl
              text-slate-200
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/40
            "
            onChange={(e) =>
              setBill({ ...bill, price: e.target.value })
            }
          />

          {/* CALCULATION PREVIEW */}
          {selected && bill.qty && bill.price && (
            <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-4 text-sm space-y-1">
              <p className="text-slate-300">
                Total:{" "}
                <span className="text-white font-medium">
                  ₹{bill.qty * bill.price}
                </span>
              </p>
              <p className="text-slate-300">
                Profit:{" "}
                <span className="text-green-400 font-medium">
                  ₹{(bill.price - selected.cost_price) * bill.qty}
                </span>
              </p>
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleGenerate}
            className="
              w-full
              bg-blue-600 hover:bg-blue-700
              text-white
              py-3
              rounded-xl
              font-medium
              transition
              active:scale-95
            "
          >
            Generate Bill
          </button>

          {/* RESULT */}
          {summary && (
            <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-4 text-sm">
              <p className="font-medium text-green-300">
                ✔ Bill Generated
              </p>
              <p className="text-slate-300 mt-1">
                Total: ₹{summary.total}
              </p>
              <p className="text-slate-300">
                Profit: ₹{summary.profit}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}