import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AppContextProvider, { AppContext } from "./store/app-context";
import { useContext } from "react";
import HomeScreen from "./screens/HomeScreen";
import ChatRoom from "./screens/ChatRoom";
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import CreateRoom from "./screens/CreateRoom";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen component={LoginScreen} name="LoginScreen" />
    </Stack.Navigator>
  );
}

function MainAppStack() {
  const { user, setUser, theme, toggleTheme } = useContext(AppContext);
  const isDarkTheme = theme === "dark";
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleStyle: styles.headerTitle,
        headerTintColor: "#6993ff",
        headerStyle: {
          backgroundColor: isDarkTheme ? "rgb(30, 30, 30)" : "white",
        },
      }}
    >
      <Stack.Screen
        component={HomeScreen}
        name="HomeScreen"
        options={{
          headerRight: ({ tintColor }) => (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  marginRight: 15,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  toggleTheme();
                }}
              >
                <Ionicons
                  name={isDarkTheme ? "sunny" : "moon"}
                  size={20}
                  color={isDarkTheme ? "white" : "black"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 20,
                }}
                onPress={() => {
                  navigation.navigate("CreateRoom");
                }}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={tintColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
                onPress={() => setUser(null)}
              >
                <Ionicons name="exit-outline" size={20} color={tintColor} />
              </TouchableOpacity>
            </View>
          ),
          title: `ChatSphere`,
        }}
      />
      <Stack.Screen
        component={ChatRoom}
        name="ChatRoom"
        options={{ title: "" }}
      />
      <Stack.Screen
        component={CreateRoom}
        name="CreateRoom"
        options={{ title: "Create Room" }}
      />
    </Stack.Navigator>
  );
}

function Navigation() {
  const { user, theme } = useContext(AppContext);
  const isDarkTheme = theme === "dark";
  return (
    <>
      {user ? <MainAppStack /> : <AuthStack />}
      <StatusBar
        backgroundColor={isDarkTheme ? "black" : "white"}
        style={isDarkTheme ? "light" : "dark"}
      />
    </>
  );
}

export default function App() {
  return (
    <>
      <NavigationContainer>
        <AppContextProvider>
          <Navigation />
        </AppContextProvider>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Orbitron_400Regular",
    fontSize: 20,
    color: "#6993ff",
  },
});
