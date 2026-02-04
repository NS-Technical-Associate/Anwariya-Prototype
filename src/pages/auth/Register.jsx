import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../services/api";

export default function Register({ setTokens }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("influencer");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api("/users", {
        method: "POST",
        body: JSON.stringify({ email, role }),
      });

      localStorage.setItem("userId", res.id);
      localStorage.setItem("role", res.role);

      const tokenRes = await api(`/tokens/${res.id}`);
      setTokens(tokenRes.tokens);

      navigate("/redirect");
    } catch {
      alert("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleRegister}
        className="bg-gray-900 p-8 rounded-xl shadow-xl w-96 space-y-4 border border-gray-800"
      >
        <h1 className="text-2xl font-bold text-center text-white">
          Create Account
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="influencer">Influencer</option>
          <option value="vendor">Vendor</option>
        </select>

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}