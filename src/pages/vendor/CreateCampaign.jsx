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

      // After successful creation, go back to vendor home
      navigate("/vendor/home");
    } catch (err) {
      alert("Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      title="Create Marketing Post"
      subtitle="Describe the product you want influencers to promote"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-5 max-w-3xl"
      >
        <div>
          <label className="block font-medium mb-1">
            Product Name
          </label>
          <input
            className="border p-3 w-full rounded"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            Description
          </label>
          <textarea
            className="border p-3 w-full rounded"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Upload Images (Preview only)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <img
                key={i}
                src={img.preview}
                alt="preview"
                className="h-32 w-full object-cover rounded"
              />
            ))}
          </div>
        )}

        <button
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-3 rounded disabled:opacity-60"
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </PageWrapper>
  );
}
