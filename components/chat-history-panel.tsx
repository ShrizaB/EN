import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Plus } from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
}

interface ChatHistoryPanelProps {
  userId: string;
  onSelect: (id: string) => void;
  activeSessionId?: string;
  refreshKey?: number;
}

const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({ userId, onSelect, activeSessionId, refreshKey }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      try {
        const res = await fetch(`/api/chat-history?userId=${userId}`);
        const data = await res.json();
        setSessions(data.sessions || []);
      } catch (e) {
        setSessions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, [userId, refreshKey]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/chat-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, title: newTitle.trim() }),
      });
      const data = await res.json();
      setSessions((prev) => [{ id: data.sessionId, title: newTitle.trim(), createdAt: new Date().toISOString() }, ...prev]);
      setNewTitle("");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    await fetch(`/api/chat-history?id=${id}`, { method: "DELETE" });
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-[#202123] text-white">
      <div className="p-4 border-b border-[#343541]">
        <form onSubmit={handleCreateSession} className="flex gap-2">
          <Input
            className="bg-[#343541] border-none text-white placeholder:text-gray-400"
            placeholder="New chat title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            disabled={creating}
          />
          <Button type="submit" size="icon" disabled={creating || !newTitle.trim()} className="bg-[#444654] hover:bg-[#565869]">
            <Plus className="w-4 h-4" />
          </Button>
        </form>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
          </div>
        ) : (
          <ul className="space-y-1 p-2">
            {sessions.length === 0 && <li className="text-center text-gray-400 py-8">No chats yet.</li>}
            {sessions.map((session) => (
              <li
                key={session.id}
                className={`flex items-center group rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                  session.id === activeSessionId ? "bg-[#343541]" : "hover:bg-[#2a2b32]"
                }`}
                onClick={() => onSelect(session.id)}
              >
                <span className="flex-1 truncate">{session.title}</span>
                <button
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(session.id);
                  }}
                  aria-label="Delete session"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryPanel; 