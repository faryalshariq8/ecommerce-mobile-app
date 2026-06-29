import { SafeAreaProvider } from "react-native-safe-area-context";
import { StripeProvider } from "@stripe/stripe-react-native";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey="pk_test_xxx">
        <AppNavigator />
      </StripeProvider>
    </SafeAreaProvider>
  );
}