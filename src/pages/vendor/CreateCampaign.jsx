import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function CreateCampaign() {
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const vendorId = Number(localStorage.getItem("userId"));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api("/campaigns", {
        method: "POST",
        body: JSON.stringify({
          vendor_id: vendorId,
          product_name: productName,
          description: description,
        }),
      });

      navigate("/vendor/home");
    } catch (err) {
      alert("Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="Create Marketing Post">
      <div className="min-h-screen rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Create Campaign
          </h1>
          <p className="text-gray-400 mt-2">
            Describe the product you want influencers to promote
          </p>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-lg max-w-3xl space-y-6"
        >

          {/* PRODUCT NAME */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Product Name
            </label>
            <input
              className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Upload Images (Preview only)
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="text-gray-300"
            />
          </div>

          {/* IMAGE PREVIEW */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img.preview}
                  alt="preview"
                  className="h-32 w-full object-cover rounded-xl border border-slate-700"
                />
              ))}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 shadow-lg"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}