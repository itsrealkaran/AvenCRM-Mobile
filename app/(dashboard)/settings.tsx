import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Card } from "../../components/ui/card";
import { Button } from "@/components/ui/button";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/auth-context";
import { Path } from "react-native-svg";
import { G } from "react-native-svg";
import Svg from "react-native-svg";
import { api } from "@/utils/api-client";

export default function Settings() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || "User");
  const [email, setEmail] = useState(user?.email || "user@avencrm.com");
  const [role, setRole] = useState(user?.role || "User");
  const [phone, setPhone] = useState("+1234567890");
  const [gender, setGender] = useState("Male");
  const [dateOfBirth, setDateOfBirth] = useState("January 6th, 2004");
  const [designation, setDesignation] = useState("Product Manager");

  // Modal states
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Form states for personal info
  const [formName, setFormName] = useState(name);
  const [formEmail, setFormEmail] = useState(email);
  const [formPhone, setFormPhone] = useState(phone);
  const [formGender, setFormGender] = useState(gender);
  const [formDob, setFormDob] = useState(dateOfBirth);
  const [formDesignation, setFormDesignation] = useState(designation);

  // Form states for security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profileData = await api.getProfile();

      // Update state with profile data
      if (profileData) {
        setName(profileData.name || user?.name || "");
        setEmail(profileData.email || user?.email || "");
        setRole(profileData.role || "");
        setPhone(profileData.phone || "");
        setGender(profileData.gender || "");
        setDateOfBirth(profileData.dob || "");
        setDesignation(profileData.designation || "");

        // Update form states as well
        setFormName(profileData.name || user?.name || "");
        setFormEmail(profileData.email || user?.email || "");
        setFormPhone(profileData.phone || "");
        setFormGender(profileData.gender || "");
        setFormDob(profileData.dob || "");
        setFormDesignation(profileData.designation || "");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePersonalInfo = async () => {
    try {
      setLoading(true);
      const profileData = {
        name: formName,
        email: formEmail,
        phone: formPhone,
        gender: formGender,
        dob: formDob,
        designation: formDesignation,
      };

      await api.updateProfile(profileData);

      setName(formName);
      setEmail(formEmail);
      setPhone(formPhone);
      setGender(formGender);
      setDateOfBirth(formDob);
      setDesignation(formDesignation);
      setShowPersonalInfo(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordError("");

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }

    if (!currentPassword || !newPassword) {
      setPasswordError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await api.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      // Close the modal and reset fields
      setShowSecurity(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Show success message
      alert("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError(
        "Failed to update password. Please check your current password and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {role
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Text>
          </View>
        </View>

        {/* Account Settings */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowPersonalInfo(true)}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="person-outline" size={22} color="#5932EA" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Personal Information</Text>
              <Text style={styles.settingDescription}>
                Update your profile details
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowSecurity(true)}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#5932EA" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Password & Security</Text>
              <Text style={styles.settingDescription}>
                Manage your password
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </Card>

        {/* Support & About */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Support & About</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowHelp(true)}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons name="help-circle-outline" size={22} color="#5932EA" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Help & Support</Text>
              <Text style={styles.settingDescription}>Get assistance</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => setShowAbout(true)}
          >
            <View style={styles.settingIconContainer}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color="#5932EA"
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>About</Text>
              <Text style={styles.settingDescription}>App version 1.0.0</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </Card>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            AvenCRM ©{new Date().getFullYear()}
          </Text>
        </View>
      </ScrollView>

      {/* Personal Information Modal */}
      <Modal
        visible={showPersonalInfo}
        animationType="slide"
        onRequestClose={() => setShowPersonalInfo(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowPersonalInfo(false)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Personal Information</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={formName}
                onChangeText={setFormName}
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formEmail}
                onChangeText={setFormEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={formPhone}
                onChangeText={setFormPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Gender</Text>
              <TextInput
                style={styles.input}
                value={formGender}
                onChangeText={setFormGender}
                placeholder="Enter your gender"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={styles.input}
                value={formDob}
                onChangeText={setFormDob}
                placeholder="Enter your date of birth"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Designation</Text>
              <TextInput
                style={styles.input}
                value={formDesignation}
                onChangeText={setFormDesignation}
                placeholder="Enter your designation"
              />
            </View>

            <Button
              style={styles.updateButton}
              onPress={handleUpdatePersonalInfo}
              disabled={loading}
            >
              <Text style={styles.updateButtonText}>
                {loading ? "Updating..." : "Update Profile"}
              </Text>
            </Button>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Password & Security Modal */}
      <Modal
        visible={showSecurity}
        animationType="slide"
        onRequestClose={() => setShowSecurity(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowSecurity(false)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Password & Security</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                secureTextEntry
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                secureTextEntry
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
              />
            </View>

            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}

            <Button
              style={styles.updateButton}
              onPress={handleUpdatePassword}
              disabled={loading}
            >
              <Text style={styles.updateButtonText}>
                {loading ? "Updating..." : "Update Password"}
              </Text>
            </Button>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Help & Support Modal */}
      <Modal
        visible={showHelp}
        animationType="slide"
        onRequestClose={() => setShowHelp(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowHelp(false)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Help & Support</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Card style={styles.helpCard}>
              <TouchableOpacity
                style={styles.helpItem}
                onPress={() => Linking.openURL("mailto:info@avencrm.com")}
              >
                <Ionicons
                  name="mail-outline"
                  size={24}
                  color="#5932EA"
                  style={styles.helpIcon}
                />
                <View>
                  <Text style={styles.helpTitle}>Contact Support</Text>
                  <Text style={styles.helpDescription}>info@avencrm.com</Text>
                </View>
              </TouchableOpacity>
            </Card>

            <Card style={styles.helpCard}>
              <TouchableOpacity
                style={styles.helpItem}
                onPress={() => Linking.openURL("tel:+15873324685")}
              >
                <Ionicons
                  name="call-outline"
                  size={24}
                  color="#5932EA"
                  style={styles.helpIcon}
                />
                <View>
                  <Text style={styles.helpTitle}>Call Us</Text>
                  <Text style={styles.helpDescription}>+1 (587) 332-4685</Text>
                </View>
              </TouchableOpacity>
            </Card>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={showAbout}
        animationType="slide"
        onRequestClose={() => setShowAbout(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowAbout(false)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>About</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.aboutLogoContainer}>
              <View style={styles.aboutLogo}>
                <Svg width="50" height="50" viewBox="0 0 1729.67 1729.67">
                  <G transform="translate(165, 240) scale(0.8)" id="Layer_2">
                    <Path
                      strokeMiterlimit={10}
                      strokeWidth={60}
                      fill="#ffffff"
                      stroke="#ffffff"
                      d="M1229.28,632.22c-25.17,43.65-86.07,149.19-129.26,224A163.24,163.24,0,0,1,958.9,937.83L1136.17,632.3a40.29,40.29,0,0,0,0-40.4c-22.88-39.52-76-131.29-129.26-223.21-39.9-68.82-79.84-137.79-107.15-185-15.54-26.78-54.17-26.74-69.67,0C757.49,309.62,592.54,595.23,547.4,673.42a40.31,40.31,0,0,1-34.89,20.12h-.08c-31,0-50.34-33.55-34.88-60.4L830,21.19c15.5-26.89,54.28-26.93,69.78,0L1229.28,592A40.23,40.23,0,0,1,1229.28,632.22Z"
                    />
                    <Path
                      strokeMiterlimit={10}
                      strokeWidth={60}
                      fill="#ffffff"
                      stroke="#ffffff"
                      d="M1688.33,1507.86l-659.2.07a40.31,40.31,0,0,1-34.89-20.16L864.45,1262.84a161.49,161.49,0,0,1,0-161.47l.38-.69,176.43,305.65a40.24,40.24,0,0,0,34.89,20.16l472.78-.08c31,0,50.38-33.62,34.85-60.44L1300.51,876.32a40.11,40.11,0,0,1-.19-40c15.37-27.13,54.35-27.28,69.92-.31l353,611.41C1738.71,1474.27,1719.35,1507.86,1688.33,1507.86Z"
                    />
                    <Path
                      strokeMiterlimit={10}
                      strokeWidth={60}
                      fill="#ffffff"
                      stroke="#ffffff"
                      d="M748.16,1507.93H41.34c-31,0-50.38-33.58-34.89-60.44L336,876.51a40.35,40.35,0,0,1,34.92-20.16H629.72a163.11,163.11,0,0,1,141.16,81.44H418A40.29,40.29,0,0,0,383.1,958L147.53,1366c-15.53,26.86,3.86,60.44,34.85,60.44l565.28.08a40.33,40.33,0,0,1,34.93,20.16l.49.88C798.54,1474.38,779.14,1507.93,748.16,1507.93Z"
                    />
                  </G>
                </Svg>
              </View>
              <Text style={styles.aboutAppName}>AvenCRM</Text>
              <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            </View>

            <Card style={styles.aboutCard}>
              <Text style={styles.aboutSectionTitle}>About AvenCRM</Text>
              <Text style={styles.aboutText}>
                AvenCRM is a comprehensive customer relationship management
                solution designed specifically for real estate professionals.
                Our platform helps you manage leads, deals, properties, and
                client communications all in one place.
              </Text>
            </Card>

            <Card style={styles.aboutCard}>
              <Text style={styles.aboutSectionTitle}>Legal</Text>
              <TouchableOpacity
                style={styles.aboutLink}
                onPress={() =>
                  Linking.openURL("https://avencrm.com/terms-of-service")
                }
              >
                <Text style={styles.aboutLinkText}>Terms of Service</Text>
                <Ionicons name="chevron-forward" size={18} color="#5932EA" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.aboutLink}
                onPress={() =>
                  Linking.openURL("https://avencrm.com/privacy-policy")
                }
              >
                <Text style={styles.aboutLinkText}>Privacy Policy</Text>
                <Ionicons name="chevron-forward" size={18} color="#5932EA" />
              </TouchableOpacity>
            </Card>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  profileImageContainer: {
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#5932EA",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  roleBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#EBF3FF",
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    color: "#3182CE",
    fontWeight: "500",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  settingDescription: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  logoutText: {
    color: "#FF3B30",
    fontWeight: "600",
    marginLeft: 8,
  },
  footer: {
    alignItems: "center",
    marginBottom: 24,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  backButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: "#5932EA",
    marginTop: 16,
    marginBottom: 32,
  },
  updateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  // Help & Support styles
  helpCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  helpIcon: {
    marginRight: 16,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  helpDescription: {
    fontSize: 14,
    color: "#666",
  },

  // About styles
  aboutLogoContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  aboutLogo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#5932EA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  aboutLogoText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  aboutAppName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  aboutVersion: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  aboutCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  aboutSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  aboutLink: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  aboutLinkText: {
    fontSize: 15,
    color: "#333",
  },

  errorText: {
    color: "#FF3B30",
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
  },
});
