import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function InfluencerDashboard() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/campaigns")
      .then((data) => {
        setCampaigns(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper
      title="Available Campaigns"
      subtitle="Browse brand opportunities"
    >
      {loading ? (
        <div className="text-center text-gray-500">
          Loading campaigns...
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center">
          <h2 className="text-lg font-semibold">
            No campaigns available
          </h2>
          <p className="text-gray-500 mt-2">
            Check back later for new opportunities.
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
              <p className="text-gray-500 text-sm mt-1">
                {campaign.description}
              </p>

              <button
                onClick={() =>
                  navigate(
                    `/influencer/campaign/${campaign.id}`
                  )
                }
                className="mt-4 text-blue-600 text-sm"
              >
                View Details →
              </button>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
