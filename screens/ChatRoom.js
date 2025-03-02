import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AppContext } from "../store/app-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomInput from "../components/CustomInput";
import { format, isValid } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import handleApiErrors from "../HandleApiErrors";

export default function ChatRoom() {
  const { user, theme } = useContext(AppContext);
  const isDarkTheme = theme === "dark";
  const route = useRoute();
  const { id } = route.params;
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ws, setWs] = useState(null);
  const [isWsOpen, setIsWsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(
      `ws://chat-api-k4vi.onrender.com/ws/${id}/${user.username}`
    );

    socket.onopen = () => {
      console.log("Connected to websocket");
      setIsWsOpen(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received:", data);

        if (data.event === "message") {
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, data.message];
            return updatedMessages.slice(-10);
          });
        } else if (data.event === "join" || data.event === "leave") {
          if (data.username !== user.username) {
            setNotifications((prev) => [
              ...prev,
              `${data.username} ${
                data.event === "join" ? "joined" : "left"
              } the room`,
            ]);

            // Remove notification after 3 seconds
            setTimeout(() => {
              setNotifications((prev) => prev.slice(1));
            }, 3000);
          }
        }
      } catch (error) {
        console.log("Error handling message:", error);
      }
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
      setIsWsOpen(false);
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      setIsWsOpen(false);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [id, user.username]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://chat-api-k4vi.onrender.com/chat/rooms/${id}/messages`
        );
        const lastTenMessages = response.data.reverse().slice(-10);
        setMessages(lastTenMessages);
      } catch (error) {
        handleApiErrors(error);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [id]);

  useEffect(() => {
    const setHeaderTitle = async () => {
      try {
        const response = await axios.get(
          `https://chat-api-k4vi.onrender.com/chat/rooms/${id}`
        );
        navigation.setOptions({ title: response.data.name });
      } catch (error) {
        handleApiErrors(error);
      }
    };

    setHeaderTitle();
  }, [id]);

  const handleSendMessage = () => {
    if (ws && isWsOpen && messageInput && messageInput.trim()) {
      const message = {
        event: "message",
        content: messageInput,
        sender: user.username,
      };
      ws.send(JSON.stringify(message));
      setMessageInput("");
    }
  };

  const formatDate = (date) => {
    if (!date || !isValid(new Date(date))) return "";
    return format(new Date(date), "eee, MMMM dd, yyyy");
  };

  const formatTime = (date) => {
    if (!date || !isValid(new Date(date))) return "";
    return format(new Date(date), "hh:mm a");
  };

  const renderMessage = ({ item, index }) => {
    const createdAtTime = formatTime(item.created_at);
    const isCurrentUser = item.username === user.username;
    const showDateSeparator =
      index === 0 ||
      formatDate(messages[index].created_at) !==
        formatDate(messages[index - 1].created_at);

    return (
      <>
        {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
          </View>
        )}
        <View
          style={[
            styles.messageContainer,
            isCurrentUser ? styles.currentUserMessage : styles.receiverMessage,
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              { backgroundColor: isDarkTheme ? "rgb(30,30,30)" : "#ccc" },
              isCurrentUser && styles.currentUserBubble,
            ]}
          >
            <Text
              style={[
                styles.username,
                { color: isDarkTheme ? "#EAEAEA" : "#333" },
              ]}
            >
              {item.username}
            </Text>
            <Text
              style={[
                styles.messageContent,
                { color: !isDarkTheme ? "black" : "white" },
              ]}
            >
              {item.content}
            </Text>
            <Text
              style={[
                styles.timestamp,
                { color: isDarkTheme ? "#EAEAEA" : "#333" },
              ]}
            >
              {createdAtTime}
            </Text>
          </View>
        </View>
      </>
    );
  };

  function renderContent() {
    return (
      <>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading Chats...</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            ref={flatListRef}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            ListFooterComponent={
              notifications.length > 0 && (
                <View style={styles.notificationContainer}>
                  {notifications.map((note, index) => (
                    <Text key={index} style={styles.notificationText}>
                      {note}
                    </Text>
                  ))}
                </View>
              )
            }
            onContentSizeChange={() => {
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              });
            }}
          />
        )}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: isDarkTheme ? "rgb(30,30,30)" : "#fff" },
          ]}
        >
          <CustomInput
            value={messageInput}
            onChangeText={setMessageInput}
            placeholder="Type a message"
            placeholderTextColor="#999"
            style={styles.input}
            multiline={true}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
            disabled={!isWsOpen}
          >
            <Ionicons name="send" size={20} color={"#fff"} />
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      {isDarkTheme ? (
        <View style={[styles.container, { backgroundColor: "black" }]}>
          {renderContent()}
        </View>
      ) : (
        <LinearGradient
          style={styles.container}
          colors={[
            "rgb(215, 236, 250)",
            "rgb(239, 239, 255)",
            "rgb(255, 235, 253)",
          ]}
        >
          {renderContent()}
        </LinearGradient>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#7f8c8d",
  },
  messagesList: {
    padding: 10,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
    marginHorizontal: 10,
  },
  messageBubble: {
    backgroundColor: "#1e1e1c",
    borderRadius: 15,
    padding: 10,
    maxWidth: "75%",
  },
  currentUserMessage: {
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  receiverMessage: {
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  currentUserBubble: {
    backgroundColor: "#6993ff",
  },
  username: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 12,
    color: "#555",
  },
  messageContent: {
    fontSize: 16,
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 10,
    maxHeight: 150,
  },
  sendButton: {
    backgroundColor: "#6993ff",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dateSeparator: {
    alignItems: "center",
    marginVertical: 10,
  },
  dateText: {
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    color: "#555",
    fontSize: 14,
    overflow: "hidden",
  },
  notificationContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  notificationText: {
    backgroundColor: "#FFD700",
    color: "#333",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
});
