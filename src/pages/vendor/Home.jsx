import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function VendorHome() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const vendorId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    api("/campaigns")
      .then((data) => {
        // ✅ vendor sees only their own campaigns
        const myCampaigns = data.filter(
          (c) => c.vendor_id === vendorId
        );
        setCampaigns(myCampaigns);
      })
      .finally(() => setLoading(false));
  }, [vendorId]);

  return (
    <PageWrapper
      title="My Marketing Posts"
      subtitle="Manage your influencer marketing campaigns"
    >
      <div className="flex justify-end mb-6">
        <button
          onClick={() => navigate("/vendor/create")}
          className="bg-purple-600 text-white px-5 py-2 rounded"
        >
          + Create Post
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">
          Loading posts...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold">No posts yet</h2>
          <p className="text-gray-500 mt-2">
            Create your first post to reach influencers.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white p-6 rounded-xl shadow"
            >
              <h3 className="font-semibold">
                {campaign.product_name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {campaign.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
