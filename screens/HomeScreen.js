import { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { AppContext } from "../store/app-context";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";
import ChatRoomItem from "../components/ChatRoomItem";
import { LinearGradient } from "expo-linear-gradient";
import handleApiErrors from "../HandleApiErrors";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const { theme } = useContext(AppContext);
  const isDarkTheme = theme === "dark";
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get(
          "https://chat-api-k4vi.onrender.com/chat/rooms"
        );
        console.log(response.data);
        setRooms(response.data);
      } catch (error) {
        handleApiErrors(error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) fetchChatRooms();
  }, [isFocused]);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function renderContent() {
    return (
      <>
        <Text
          style={[styles.title, { color: isDarkTheme ? "#EAEAEA" : "#333" }]}
        >
          Rooms
        </Text>
        <Text style={[styles.subtitle, { color: "#7f8c8d" }]}>
          Select a Room from the list below
        </Text>

        {/* Search Input */}
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: isDarkTheme ? "#333" : "#fff" },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={isDarkTheme ? "#EAEAEA" : "#333"}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: isDarkTheme ? "#EAEAEA" : "#333" },
            ]}
            placeholder="Search rooms..."
            placeholderTextColor={isDarkTheme ? "#999" : "#7f8c8d"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading Rooms...</Text>
          </View>
        ) : (
          <>
            {filteredRooms.length > 0 ? (
              <FlatList
                data={filteredRooms}
                renderItem={({ item }) => <ChatRoomItem item={item} />}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.flatListContent}
              />
            ) : (
              <View style={styles.noRoomsContainer}>
                <Text style={styles.noRoomsText}>
                  No rooms found. Try a different search!
                </Text>
              </View>
            )}
          </>
        )}
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 15,
    marginLeft: 15,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 35,
    color: "#7f8c8d",
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
  flatListContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  noRoomsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noRoomsText: {
    fontSize: 16,
    color: "#7f8c8d",
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});
