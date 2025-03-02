# ChatSphere - React Native Chat Application

## Overview

ChatSphere is a simple, real-time chat application built with React Native. It allows users to set a username, create or join chat rooms, and send/receive messages in real-time using WebSocket connections. The app integrates with a backend API for managing user registration, room creation, and message handling.

## Features

1. **User Authentication**:
   - Set a username to join the chat.
2. **Room Management**:
   - View a list of available chat rooms.
   - Create new chat rooms.
3. **Real-Time Messaging**:
   - Send and receive messages in real-time using WebSocket.
   - Display the last 10 messages in a room.
4. **Notifications**:
   - Notify users when someone joins or leaves a room.
5. **Theme Support**:
   - Toggle between light and dark themes.
6. **Error Handling**:
   - Gracefully handle API and WebSocket errors.

## Technologies Used

- **Frontend**: React Native, Expo
- **State Management**: React Context API
- **Backend Integration**: REST API, WebSocket
- **Styling**: React Native StyleSheet, LinearGradient
- **Error Handling**: Custom error handler

## Installation

1. **Clone the repository**:

```bash
git clone https://github.com/your-username/chatsphere.git
cd chatsphere
```

2. **Install dependencies**:

```bash
npm install
```

3. **Start the development server**:

```bash
npm start
```

4. **Run the app on an emulator or physical device**:

```bash
npm run android # For Android
npm run ios     # For iOS
```

## API Integration

The app uses the following API endpoints:

### Rest API

- **Set Username**: `POST https://chat-api-k4vi.onrender.com/chat/username`
- **Get Rooms**: `GET https://chat-api-k4vi.onrender.com/chat/rooms`
- **Create Room**: `POST https://chat-api-k4vi.onrender.com/chat/rooms`
- **Get Room Messages**: `GET https://chat-api-k4vi.onrender.com/chat/rooms/{roomID}/messages`

### WebSocket

- **Join Room**: `ws://chat-api-k4vi.onrender.com/ws/{roomID}/{username}`
- Message Payload:

```json
{
  "event": "message",
  "content": "your-message-content"
}
```

## Screens

- **Login Screen**:
  Set a username to join the chat.
- **Home Screen**:
  View a list of available chat rooms.
  Search for rooms by name.
- **Create Room Screen**:
  Create a new chat room.
- **Chat Room Screen**:
  Send and receive messages in real-time.
  View the last 10 messages.

## Error Handling

The app handles the following errors gracefully:

- Failed API requests (e.g., network issues, server errors).
- WebSocket connection issues.
- Edge cases like no rooms available or invalid input.

## Code Structure

- **App.js**: Main entry point with navigation setup.
  AppContext.js\*\*: Context API for managing global state (user, theme, etc.).
- **Screens**:
  - `LoginScreen.js`: Handles user login.
  - `HomeScreen.js`: Displays a list of chat rooms.
  - `CreateRoom.js`: Allows users to create new rooms.
  - `ChatRoom.js`: Handles real-time messaging.
- **Components**:
  - `CustomInput.js`: Reusable input component.
  - `CustomButton.js`: Reusable button component.
  - `ChatRoomItem.js`: Displays a chat room in the list.

## Styling

The app uses React Native's StyleSheet for styling and LinearGradient for background gradients. It supports both light and dark themes, which can be toggled from the Home Screen.

## Future Improvements

- **Persistent Notifications**: Store join/leave notifications for later reference.
- **WebSocket Reconnection**: Implement automatic reconnection for WebSocket.
- **User Profiles**: Allow users to set profile pictures or statuses.
- **Message History**: Load more messages when scrolling up.

## Submission

**GitHub Repository**: [Link to your repository]
**APK File**: [Link to the APK file]

## Resources

- **API Documentation**:
  - [Swagger UI](https://chat-api-k4vi.onrender.com/docs)
  - [Redocly UI](https://chat-api-k4vi.onrender.com/redoc)

## License

This project is licensed under the MIT License
