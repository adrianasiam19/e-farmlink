"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Send } from "lucide-react";

// Helper: Get messages for a chatroom
const getMessages = async (chatroomId: number, token: string | null) => {
  try {
    const res = await axios.get(
      `http://localhost:8000/api/chatrooms/${chatroomId}/messages/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to get messages:", error);
    return [];
  }
};

// Helper: Send a message to a chatroom
const sendChatMessage = async (
  chatroomId: number,
  content: string,
  token: string | null
) => {
  try {
    const res = await axios.post(
      `http://localhost:8000/api/chatrooms/${chatroomId}/messages/`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to send message:", error);
    return null;
  }
};

interface Message {
  id: number;
  sender: number;
  sender_name: string;
  sender_email: string;
  content: string;
  timestamp: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  is_farmer?: boolean;
  is_buyer?: boolean;
  last_message?: string;
  last_message_time?: string;
  chatroom_id?: number;
}

interface CurrentUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_farmer: boolean;
  is_buyer: boolean;
}

interface ChatRoom {
  id: number;
  farmer: number;
  buyer: number;
  farmer_name?: string;
  buyer_name?: string;
}

export default function UserChat() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Load token, userId, and current user from localStorage
  useEffect(() => {
    const access =
      typeof window !== "undefined" ? localStorage.getItem("access") : null;
    const id =
      typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
    const userInfo =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;

    setToken(access);
    if (id) setUserId(parseInt(id));

    if (userInfo) {
      try {
        setCurrentUser(JSON.parse(userInfo));
      } catch (error) {
        console.error("Failed to parse user info from localStorage:", error);
      }
    }
  }, []);

  // Load users list based on current user's role
  useEffect(() => {
    if (!token || !currentUser) return;

    axios
      .get("http://localhost:8000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to load users", err));
  }, [token, currentUser]);

  // Load messages when chatroom is selected
  useEffect(() => {
    if (!selectedRoomId || !token) return;
    getMessages(selectedRoomId, token).then(setMessages);
  }, [selectedRoomId, token]);

  const openChatWithUser = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user || null);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/chatrooms/",
        { other_user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedRoomId(res.data.id);
      setCurrentChatRoom(res.data);
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.detail === "Chatroom already exists"
      ) {
        try {
          const existing = await axios.get(
            "http://localhost:8000/api/chatrooms/",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const found = existing.data.find(
            (room: any) => room.farmer === userId || room.buyer === userId
          );
          if (found) {
            setSelectedRoomId(found.id);
            setCurrentChatRoom(found);
          }
        } catch (err) {
          console.error("Failed to fetch existing chatroom", err);
        }
      } else {
        console.error("Chatroom error:", error.response?.data || error);
      }
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !token || !selectedRoomId || sendingMessage) return;

    setSendingMessage(true);
    try {
      await sendChatMessage(selectedRoomId, messageInput, token);
      setMessageInput("");
      const msgs = await getMessages(selectedRoomId, token);
      setMessages(msgs);
    } catch (err) {
      console.error("Send or fetch error", err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Determine if a message sender is a farmer based on chatroom info
  const isMessageFromFarmer = (senderId: number): boolean => {
    if (!currentChatRoom) return false;
    return senderId === currentChatRoom.farmer;
  };

  // Get the appropriate title based on user role
  const getSidebarTitle = () => {
    if (!currentUser) return "Loading...";
    return currentUser.is_farmer
      ? "Buyers who messaged you"
      : "Available Farmers";
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get user role badge
  const getUserBadge = (user: User) => {
    if (currentUser?.is_farmer && user.chatroom_id) {
      return (
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          Buyer
        </span>
      );
    } else if (currentUser?.is_buyer) {
      return (
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          Farmer
        </span>
      );
    }
    return null;
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4 py-8">
        <div
          className="w-full max-w-6xl h-[600px] bg-white rounded-3xl shadow-2xl flex overflow-hidden"
          style={{ borderRadius: 24 }}
        >
          {/* Sidebar */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 border-b border-blue-100">
              <User className="w-6 h-6" />
              <h2 className="text-lg font-semibold tracking-wide">
                {getSidebarTitle()}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-3 space-y-3">
              {users.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No users available</p>
                  {currentUser?.is_farmer && (
                    <p className="text-xs mt-1">Buyers will appear here when they message you</p>
                  )}
                </div>
              )}
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => openChatWithUser(user.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                    selectedUser?.id === user.id
                      ? "bg-blue-100 border-2 border-blue-200 shadow-inner"
                      : "hover:bg-blue-50 border border-transparent"
                  }`}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {(user.first_name || user.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {user.first_name || user.email}
                      </p>
                      {getUserBadge(user)}
                    </div>
                    {user.last_message && (
                      <p className="text-xs text-gray-500 truncate">
                        {user.last_message}
                      </p>
                    )}
                    {user.last_message_time && (
                      <p className="text-xs text-gray-400">
                        {formatTime(user.last_message_time)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gradient-to-br from-white to-blue-50">
            {/* Header */}
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-4 border-b border-blue-200">
              {selectedUser ? (
                <>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {(selectedUser.first_name || selectedUser.email).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {selectedUser.first_name || selectedUser.email}
                    </h2>
                    <p className="text-sm text-blue-100">
                      {currentUser?.is_farmer ? "Buyer" : "Farmer"}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <User className="w-6 h-6" />
                  <h2 className="text-lg font-semibold">
                    Select a {currentUser?.is_farmer ? "buyer" : "farmer"} to start chatting
                  </h2>
                </>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedRoomId ? (
                messages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-10">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Send className="w-8 h-8 text-gray-400" />
                    </div>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isCurrentUser = msg.sender === userId;
                    const isFromFarmer = isMessageFromFarmer(msg.sender);

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isFromFarmer ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className={`flex items-end gap-2 max-w-[75%] ${
                          isFromFarmer ? "flex-row-reverse" : "flex-row"
                        }`}>
                          {/* Avatar with role-specific colors */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${
                            isFromFarmer 
                              ? "bg-gradient-to-br from-green-500 to-emerald-600" 
                              : "bg-gradient-to-br from-blue-500 to-indigo-600"
                          }`}>
                            {(msg.sender_name || msg.sender_email).charAt(0).toUpperCase()}
                          </div>
                          
                          {/* Message bubble with distinct colors for farmer vs buyer */}
                          <div className="flex flex-col">
                            <div
                              className={`px-4 py-3 rounded-2xl shadow-sm ${
                                isFromFarmer
                                  ? "bg-green-500 text-white shadow-green-200" // Farmer messages (green, always right)
                                  : "bg-blue-500 text-white shadow-blue-200"   // Buyer messages (blue, always left)
                              }`}
                              style={{
                                borderBottomRightRadius: isFromFarmer ? 6 : 16,
                                borderBottomLeftRadius: isFromFarmer ? 16 : 6,
                              }}
                            >
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                            </div>
                            
                            {/* Message info with role indicator */}
                            <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
                              isFromFarmer ? "justify-end" : "justify-start"
                            }`}>
                              <span>{msg.sender_name || msg.sender_email}</span>
                              <span>•</span>
                              <span>{formatTime(msg.timestamp)}</span>
                              <span>•</span>
                              <span className={`font-medium ${
                                isFromFarmer ? "text-green-600" : "text-blue-600"
                              }`}>
                                {isFromFarmer ? "🌱 Farmer" : "🛒 Buyer"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )
              ) : (
                <div className="text-center text-gray-400 mt-20">
                  <User className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-lg font-medium mb-2">Welcome to your chat</h3>
                  <p>Select a {currentUser?.is_farmer ? "buyer" : "farmer"} from the sidebar to start messaging</p>
                </div>
              )}
            </div>

            {/* Input with role-specific styling */}
            {selectedRoomId && (
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                      placeholder={`Type your message as a ${currentUser?.is_farmer ? 'farmer 🌱' : 'buyer 🛒'}... (Press Enter to send)`}
                      rows={1}
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!messageInput.trim() || sendingMessage}
                    className={`px-4 py-3 rounded-xl transition-all flex items-center gap-2 ${
                      messageInput.trim() && !sendingMessage
                        ? currentUser?.is_farmer 
                          ? "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg"
                          : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {sendingMessage ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span className="hidden sm:block">
                      Send {currentUser?.is_farmer ? '🌱' : '🛒'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}