import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function VendorMyChats() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const vendorId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    api(`/chats/user/${vendorId}`)
      .then((data) => setChats(data || []))
      .finally(() => setLoading(false));
  }, [vendorId]);

  return (
    <PageWrapper title="My Chats">
      <div className="bg-slate-950 px-6 py-12 min-h-[80vh]">
        {loading ? (
          <div className="text-center text-slate-400 py-20">
            Loading chats...
          </div>
        ) : chats.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center max-w-lg mx-auto">
            <h2 className="text-lg font-medium text-white">No chats yet</h2>
            <p className="text-slate-400 mt-2">
              Influencers will appear here once they contact you.
            </p>
          </div>
        ) : (
          <div className="space-y-5 max-w-4xl mx-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => navigate(`/vendor/chat/${chat.id}`)}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 cursor-pointer
                           transition-all duration-300 hover:-translate-y-1 hover:bg-slate-700
                           hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium tracking-wide">
                      Campaign #{chat.campaign_id}
                    </p>
                    <p className="text-sm text-slate-300 mt-1">
                      Click to open chat
                    </p>
                  </div>
                  <span className="text-blue-400 text-sm font-medium">Open →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}