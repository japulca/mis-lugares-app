import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UsuariosScreen from "./screens/UsuariosScreen";
import LugaresScreen from "./screens/LugaresScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Usuarios"
          component={UsuariosScreen}
          options={{ title: "Mis Usuarios", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="Lugares"
          component={LugaresScreen}
          options={{ title: "Mis Lugares", headerTitleAlign: "center" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
