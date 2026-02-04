import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function MyChats() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = Number(localStorage.getItem("userId"));

  useEffect(() => {
    api(`/chats/user/${userId}`)
      .then(setChats)
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-950 px-6 py-12">

        {/* HEADER */}
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className="text-3xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            My Chats
          </h1>
          <p className="text-slate-400 mt-2 text-sm tracking-wide">
            Your conversations with brands
          </p>
        </div>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center text-slate-400 py-20 animate-pulse">
              Loading chats...
            </div>
          ) : chats.length === 0 ? (
            <div className="
              bg-slate-800
              border border-blue-500/30
              rounded-2xl
              p-12
              text-center
              shadow-[0_0_30px_rgba(59,130,246,0.25)]
            ">
              <h2 className="text-lg font-semibold text-white tracking-wide">
                No chats yet
              </h2>
              <p className="text-slate-400 mt-2">
                Contact a vendor to start chatting.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {chats.map((chat, index) => (
                <div
                  key={chat.id}
                  onClick={() =>
                    navigate(`/influencer/chat/${chat.id}`)
                  }
                  className="
                    relative
                    bg-slate-800
                    border border-blue-500/30
                    rounded-2xl
                    p-6
                    cursor-pointer

                    shadow-[0_0_28px_rgba(59,130,246,0.35)]
                    transition-all duration-500

                    hover:-translate-y-1
                    hover:border-blue-400
                    hover:shadow-[0_0_45px_rgba(59,130,246,0.55)]
                  "
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* PERMANENT BLUE AURA */}
                  <div className="
                    absolute inset-0
                    rounded-2xl
                    bg-gradient-to-br from-blue-500/10 to-indigo-500/10
                    pointer-events-none
                  "></div>

                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold tracking-wide text-lg">
                        Campaign #{chat.campaign_id}
                      </p>
                      <p className="text-sm text-slate-300 mt-1 tracking-wide">
                        Click to open conversation
                      </p>
                    </div>

                    <span className="text-blue-400 text-sm font-semibold tracking-wide">
                      Open →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
