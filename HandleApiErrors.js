import { Alert } from "react-native";

export default function handleApiErrors(error) {
  const message =
    error.response?.data?.detail?.[0]?.msg ||
    error.response?.data?.message ||
    error.message ||
    "Something went wrong";
  Alert.alert("Error", message);
}
