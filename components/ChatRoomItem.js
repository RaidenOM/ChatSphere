import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { AppContext } from "../store/app-context";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ChatRoomItem({ item }) {
  const { theme } = useContext(AppContext);
  const isDarkTheme = theme === "dark";
  const navigation = useNavigation();

  const handlePress = (roomId) => {
    navigation.navigate("ChatRoom", { id: roomId });
  };

  return (
    <TouchableOpacity
      onPress={() => handlePress(item.id)}
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "rgb(30,30,30)" : "#fff" },
      ]}
    >
      <View style={styles.content}>
        <Text
          style={[styles.roomName, { color: isDarkTheme ? "#EAEAEA" : "#333" }]}
        >
          {item.name}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={isDarkTheme ? "#EAEAEA" : "#333"}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roomName: {
    fontSize: 16,
    fontWeight: "600",
  },
});
