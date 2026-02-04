import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function Chat({ tokens, setTokens }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);
  const userId = Number(localStorage.getItem("userId"));

  const FREE_LIMIT = 5;
  const PAID_BLOCK_SIZE = 3;
  const BLOCK_COST = 5;

  const msgKey = `chat_msgs_${userId}_${id}`;
  const paidKey = `chat_paid_blocks_${userId}_${id}`;
  const autoMsgKey = `auto_interest_sent_${userId}_${id}`;

  /* LOAD MESSAGES + AUTO MESSAGE (ONLY ONCE) */
  useEffect(() => {
    const loadMessages = async () => {
      const data = await api(`/messages/${id}`);

      if (data.length === 0 && !localStorage.getItem(autoMsgKey)) {
        await api("/messages", {
          method: "POST",
          body: JSON.stringify({
            chat_id: Number(id),
            sender_id: userId,
            text: "Hi, I’m interested in this campaign.",
          }),
        });

        localStorage.setItem(autoMsgKey, "true");

        const updated = await api(`/messages/${id}`);
        setMessages(updated);
        localStorage.setItem(msgKey, 1);
        return;
      }

      setMessages(data);

      const influencerCount = data.filter(
        (m) => m.sender_id === userId
      ).length;

      localStorage.setItem(msgKey, influencerCount);
    };

    loadMessages();
  }, [id, userId]);

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sentCount = Number(localStorage.getItem(msgKey)) || 0;
  const paidBlocks = Number(localStorage.getItem(paidKey)) || 0;

  const chargeableMsgs = Math.max(0, sentCount - FREE_LIMIT);
  const requiredBlocks = Math.floor(chargeableMsgs / PAID_BLOCK_SIZE);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);

    if (requiredBlocks > paidBlocks) {
      const tokenRes = await api(
        `/tokens/deduct?user_id=${userId}&amount=${BLOCK_COST}`,
        { method: "POST" }
      );

      if (tokenRes.error) {
        navigate("/influencer/no-tokens");
        return;
      }

      localStorage.setItem(paidKey, paidBlocks + 1);
      setTokens(tokenRes.tokens);
    }

    const msg = await api("/messages", {
      method: "POST",
      body: JSON.stringify({
        chat_id: Number(id),
        sender_id: userId,
        text: input,
      }),
    });

    const newCount = sentCount + 1;
    localStorage.setItem(msgKey, newCount);

    setMessages((prev) => [...prev, msg]);
    setInput("");
    setSending(false);
  };

  return (
    <PageWrapper>
      <div className="h-[calc(100vh-64px)] bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-blue-400/20 bg-slate-900/70 backdrop-blur">
          <div>
            <h2 className="text-lg font-semibold text-blue-400">
              Conversation
            </h2>
            <p className="text-xs text-slate-400">
              {sentCount < FREE_LIMIT
                ? `${FREE_LIMIT - sentCount} free messages left`
                : `5 tokens per ${PAID_BLOCK_SIZE} messages`}
            </p>
          </div>

          {/* LIGHTER BLUE TOKENS BADGE */}
          <div className="
            bg-blue-500/80
            text-white
            px-4 py-1.5
            rounded-full
            font-semibold
            border border-blue-300
            shadow-[0_0_18px_rgba(96,165,250,0.6)]
          ">
            {tokens} Tokens
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-sm px-4 py-2 rounded-2xl text-sm transition-all
                ${
                  m.sender_id === userId
                    ? "ml-auto bg-blue-500 text-white shadow-[0_0_20px_rgba(96,165,250,0.5)]"
                    : "mr-auto bg-slate-800 text-slate-200 border border-slate-700"
                }
              `}
            >
              {m.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="px-6 py-4 border-t border-blue-400/20 bg-slate-900/80 backdrop-blur flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="
              flex-1
              bg-slate-900
              border border-blue-500/40
              rounded-xl
              px-4 py-2
              text-slate-200

              shadow-[0_0_18px_rgba(96,165,250,0.35)]
              transition-all duration-300

              focus:outline-none
              focus:ring-2 focus:ring-blue-400/70
              hover:shadow-[0_0_26px_rgba(96,165,250,0.6)]
            "
          />

          <button
            onClick={handleSend}
            disabled={sending}
            className="
              bg-blue-500 hover:bg-blue-600
              text-white
              px-6
              rounded-xl
              transition
              active:scale-95
              disabled:opacity-60
              shadow-[0_0_20px_rgba(96,165,250,0.6)]
            "
          >
            Send
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
