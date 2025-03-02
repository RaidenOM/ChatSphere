import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useContext } from "react";
import { AppContext } from "../store/app-context";
import handleApiErrors from "../HandleApiErrors";

export default function CreateRoom() {
  const { theme } = useContext(AppContext);
  const isDarkTheme = theme === "dark";
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleConfirm = async () => {
    if (!name.trim()) {
      alert("Please enter a room name.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("https://chat-api-k4vi.onrender.com/chat/rooms", {
        name: name,
      });
      navigation.goBack();
    } catch (error) {
      handleApiErrors(error);
    } finally {
      setLoading(false);
    }
  };

  function renderContent() {
    return (
      <>
        <View style={styles.content}>
          <Text
            style={[styles.title, { color: isDarkTheme ? "#EAEAEA" : "#333" }]}
          >
            Create a New Room
          </Text>
          <CustomInput
            placeholder="Room Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#999"
            style={[styles.input, { color: isDarkTheme ? "#EAEAEA" : "#333" }]}
          />
          <CustomButton onPress={handleConfirm} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : "Create Room"}
          </CustomButton>
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
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "80%",
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    marginBottom: 20,
  },
});
