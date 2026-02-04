import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";
import InfluencerProfileModal from "../../components/vendor/InfluencerProfileModal";

export default function VendorChat() {
  const { id } = useParams(); // chatId

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const vendorId = Number(localStorage.getItem("userId"));
  const bottomRef = useRef(null);

  useEffect(() => {
    api(`/messages/${id}`).then(setMessages);

    api(`/chats/user/${vendorId}`).then((chats) => {
      const found = chats.find((c) => c.id === Number(id));
      setChat(found);
    });
  }, [id, vendorId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const msg = await api("/messages", {
      method: "POST",
      body: JSON.stringify({
        chat_id: Number(id),
        sender_id: vendorId,
        text: input,
      }),
    });

    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <PageWrapper>
      <div className="h-[calc(100vh-64px)] bg-slate-950 flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-blue-400">
              Conversation
            </h2>
            <p className="text-xs text-slate-400">
              Discuss campaign details privately
            </p>
          </div>

          {chat && (
            <button
              onClick={() => setShowProfile(true)}
              className="
                text-xs
                bg-blue-500/15
                text-blue-300
                px-4 py-1.5
                rounded-full
                border border-blue-500/30
                hover:bg-blue-500/25
                transition
              "
            >
              View Influencer Profile
            </button>
          )}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 px-6 py-4 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-sm px-4 py-2 rounded-2xl text-sm
                ${
                  m.sender_id === vendorId
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-slate-800 text-slate-200"
                }
              `}
            >
              {m.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="px-6 py-4 border-t border-slate-800 flex gap-3 bg-slate-950">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="
              flex-1
              bg-slate-900
              border border-slate-800
              rounded-xl
              px-4 py-2
              text-slate-200
              focus:outline-none
              focus:ring-2 focus:ring-blue-400/40
            "
          />
          <button
            onClick={handleSend}
            className="
              bg-blue-500 hover:bg-blue-600
              text-white
              px-6
              rounded-xl
              transition
              active:scale-95
            "
          >
            Send
          </button>
        </div>
      </div>

      {/* PROFILE MODAL */}
      {showProfile && chat && (
        <InfluencerProfileModal
          influencerId={chat.influencer_id}
          onClose={() => setShowProfile(false)}
        />
      )}
    </PageWrapper>
  );
}