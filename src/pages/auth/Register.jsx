import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      // 🔹 Create user (prototype register)
      const res = await api("/users", {
        method: "POST",
        body: JSON.stringify({
          email,
          role,
        }),
      });

      // 🔹 Save session
      const userId = res.id;
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", res.role);

      // 🔹 Fetch tokens from backend
      const tokenRes = await api(`/tokens/${userId}`);
      setTokens(tokenRes.tokens);

      // 🔹 Redirect based on role
      navigate(
        res.role === "vendor" ? "/vendor" : "/influencer"
      );
    } catch (err) {
      alert("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Role selection */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-3 rounded"
        >
          <option value="influencer">Influencer</option>
          <option value="vendor">Vendor</option>
        </select>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
