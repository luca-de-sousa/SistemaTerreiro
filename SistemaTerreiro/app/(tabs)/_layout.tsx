import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="estoque" options={{ headerShown: false }} />
      <Stack.Screen name="financas" options={{ headerShown: false }} />
      <Stack.Screen name="gerenciarAuxiliar" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="perfil" options={{ headerShown: false }} />
      <Stack.Screen name="relatorios" options={{ headerShown: false }} />
    </Stack>
  );
}