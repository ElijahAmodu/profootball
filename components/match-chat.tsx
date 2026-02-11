"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/context/SocketContext";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ChatMessage, TypingIndicator } from "@/utils/types";

interface MatchChatProps {
  matchId: string;
}

export function MatchChat({ matchId }: MatchChatProps) {
  const { socket, isConnected } = useSocket();
  const { userId, username, setUser } = useUserStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [hasJoined, setHasJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!userId || !username) {
      const newUserId = `user_${Math.random().toString(36).substring(2, 11)}`;
      const newUsername = `User${Math.floor(Math.random() * 9999)}`;
      setUser(newUserId, newUsername);
    }
  }, [userId, username, setUser]);

  useEffect(() => {
    if (!socket || !isConnected || !userId || !username || hasJoined) return;

    socket.emit("join_chat", { matchId, userId, username });
    setHasJoined(true);

    socket.on("chat_message", (data: ChatMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user_joined", (data: { username: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          matchId,
          userId: "system",
          username: "System",
          message: `${data.username} joined the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socket.on("user_left", (data: { username: string }) => {
      setMessages((prev) => [
        ...prev,
        {
          matchId,
          userId: "system",
          username: "System",
          message: `${data.username} left the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socket.on("typing_indicator", (data: TypingIndicator) => {
      if (data.userId === userId) return;

      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        if (data.isTyping) {
          newSet.add(data.username);
        } else {
          newSet.delete(data.username);
        }
        return newSet;
      });
    });

    return () => {
      if (hasJoined) {
        socket.emit("leave_chat", { matchId, userId });
        socket.off("chat_message");
        socket.off("user_joined");
        socket.off("user_left");
        socket.off("typing_indicator");
      }
    };
  }, [socket, isConnected, matchId, userId, username, hasJoined]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!socket || !inputMessage.trim() || inputMessage.length > 500) return;

    socket.emit("send_message", {
      matchId,
      userId,
      username,
      message: inputMessage.trim(),
    });

    setInputMessage("");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit("typing_stop", { matchId, userId });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    if (!socket) return;

    socket.emit("typing_start", { matchId, userId, username });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", { matchId, userId });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="border-zinc-800 h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Live Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto px-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={`${msg.timestamp}-${idx}`}
              className={`${
                msg.userId === "system"
                  ? "text-center text-xs text-muted-foreground"
                  : msg.userId === userId
                    ? "text-right"
                    : "text-left"
              }`}
            >
              {msg.userId !== "system" && (
                <>
                  <p className="text-xs font-medium text-emerald-500 mb-1">
                    {msg.userId === userId ? "You" : msg.username}
                  </p>
                  <div
                    className={`inline-block px-3 py-2 rounded-lg ${
                      msg.userId === userId
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-800"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.message}</p>
                  </div>
                </>
              )}
              {msg.userId === "system" && <p>{msg.message}</p>}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {typingUsers.size > 0 && (
          <div className="px-4 py-2 text-xs text-muted-foreground">
            {Array.from(typingUsers).join(", ")}{" "}
            {typingUsers.size === 1 ? "is" : "are"} typing...
          </div>
        )}

        <div className="p-4 border-t border-zinc-800">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              maxLength={500}
              disabled={!isConnected}
              className="bg-zinc-900 border-zinc-800"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!isConnected || !inputMessage.trim()}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {inputMessage.length}/500 characters
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
