import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/auth-context";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Svg, { Path, Defs, G } from "react-native-svg";
import { useCurrency } from "@/contexts/currency-context";
export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { loadCurrency } = useCurrency();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      await loadCurrency();
      router.replace("/(dashboard)");
    } catch (error) {
      // Handle different types of errors
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setErrors({
            general: "Invalid email or password",
          });
        } else if (error.response?.status === 429) {
          setErrors({
            general: "Too many attempts. Please try again later",
          });
        } else {
          setErrors({
            general: "An error occurred. Please try again",
          });
        }
      } else {
        setErrors({
          general: "An unexpected error occurred",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.form}>
          <View style={styles.logoContainer}>
            <Svg width="40" height="40" viewBox="0 0 1729.67 1729.67">
              <G transform="translate(165, 240) scale(0.8)" id="Layer_2">
                <Path
                  strokeMiterlimit={10}
                  strokeWidth={60}
                  fill="#5932EA"
                  stroke="#5932EA"
                  d="M1229.28,632.22c-25.17,43.65-86.07,149.19-129.26,224A163.24,163.24,0,0,1,958.9,937.83L1136.17,632.3a40.29,40.29,0,0,0,0-40.4c-22.88-39.52-76-131.29-129.26-223.21-39.9-68.82-79.84-137.79-107.15-185-15.54-26.78-54.17-26.74-69.67,0C757.49,309.62,592.54,595.23,547.4,673.42a40.31,40.31,0,0,1-34.89,20.12h-.08c-31,0-50.34-33.55-34.88-60.4L830,21.19c15.5-26.89,54.28-26.93,69.78,0L1229.28,592A40.23,40.23,0,0,1,1229.28,632.22Z"
                />
                <Path
                  strokeMiterlimit={10}
                  strokeWidth={60}
                  fill="#5932EA"
                  stroke="#5932EA"
                  d="M1688.33,1507.86l-659.2.07a40.31,40.31,0,0,1-34.89-20.16L864.45,1262.84a161.49,161.49,0,0,1,0-161.47l.38-.69,176.43,305.65a40.24,40.24,0,0,0,34.89,20.16l472.78-.08c31,0,50.38-33.62,34.85-60.44L1300.51,876.32a40.11,40.11,0,0,1-.19-40c15.37-27.13,54.35-27.28,69.92-.31l353,611.41C1738.71,1474.27,1719.35,1507.86,1688.33,1507.86Z"
                />
                <Path
                  strokeMiterlimit={10}
                  strokeWidth={60}
                  fill="#5932EA"
                  stroke="#5932EA"
                  d="M748.16,1507.93H41.34c-31,0-50.38-33.58-34.89-60.44L336,876.51a40.35,40.35,0,0,1,34.92-20.16H629.72a163.11,163.11,0,0,1,141.16,81.44H418A40.29,40.29,0,0,0,383.1,958L147.53,1366c-15.53,26.86,3.86,60.44,34.85,60.44l565.28.08a40.33,40.33,0,0,1,34.93,20.16l.49.88C798.54,1474.38,779.14,1507.93,748.16,1507.93Z"
                />
              </G>
            </Svg>
            <Text style={styles.logoText}>AvenCRM</Text>
          </View>
          {/* <Text style={styles.title}>Welcome Back</Text> */}
          <Text style={styles.subtitle}>Sign in to continue</Text>

          {errors.general && (
            <Text style={[styles.errorText, styles.generalError]}>
              {errors.general}
            </Text>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text.trim());
                setErrors((prev) => ({
                  ...prev,
                  email: undefined,
                  general: undefined,
                }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholderTextColor="#666"
              editable={!isLoading}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({
                  ...prev,
                  password: undefined,
                  general: undefined,
                }));
              }}
              secureTextEntry
              autoComplete="password"
              placeholderTextColor="#666"
              editable={!isLoading}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push("/")}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  logoContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#5932EA",
    marginLeft: 2,
  },
  form: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  inputError: {
    borderColor: "#dc2626",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#7c3aed",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: "#9d71f3",
  },
  forgotPassword: {
    marginTop: 16,
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#7c3aed",
    fontSize: 14,
    fontWeight: "500",
  },
  generalError: {
    textAlign: "center",
    marginBottom: 16,
    backgroundColor: "#fee2e2",
    padding: 8,
    borderRadius: 4,
  },
});
