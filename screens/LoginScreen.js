import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import axios from "axios";
import { AppContext } from "../store/app-context";
import handleApiErrors from "../HandleApiErrors";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const { setUser, setLoading, loading, theme } = useContext(AppContext);
  const isDarkTheme = theme === "dark";

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        "https://chat-api-k4vi.onrender.com/chat/username",
        {
          username: username,
        }
      );

      console.log(response.data);

      setUser(response.data);
    } catch (error) {
      handleApiErrors(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkTheme ? "black" : "white" },
      ]}
    >
      <Image
        source={require("../assets/chat-sphere.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <Text
        style={[styles.title, { color: isDarkTheme ? "#d3c1af" : "#2c3e50" }]}
      >
        Welcome
      </Text>
      <Text style={styles.subtitle}>Enter username to get started!</Text>
      <CustomInput
        placeholder="Username"
        style={styles.input}
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <CustomButton
        style={{ marginBottom: 15 }}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : "Login"}
      </CustomButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    height: 120,
    width: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#7f8c8d",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
    width: "100%",
  },
});
