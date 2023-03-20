import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import MainScreen from "./app/screens/MainScreen";

const Stack = createStackNavigator();

export default function App() {
  const [calendarNotes, setCalendarNotes] = useState({});

  const findCalendarNotes = async () => {
    const result = await AsyncStorage.getItem("calendarNotes");
    if (result !== null) setCalendarNotes(JSON.parse(result));
  };
  useEffect(() => {
    findCalendarNotes();
  }, []);

  const RenderMainScreen = (props) => (
    <MainScreen {...props} renderedCalendarNotes={calendarNotes} />
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          component={RenderMainScreen}
          name="MainScreen"
          options={{
            title: "Calendar Notes",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
