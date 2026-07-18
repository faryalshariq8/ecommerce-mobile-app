import { SafeAreaProvider } from "react-native-safe-area-context";
import { StripeProvider } from "@stripe/stripe-react-native";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <StripeProvider publishableKey="pk_test_51Tng0LDUbJLupWez2KyCZGzmraTqxrzgmfb8Lxws2fk2qbbiEf5Mn2TURD56qz7hKPQxicsFVLAZBHd1liTOcHwL00EKFK1x76">
        <AppNavigator />
      </StripeProvider>
    </SafeAreaProvider>
  );
}