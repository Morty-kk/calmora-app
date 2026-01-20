import { useEffect, useState } from "react";
import {
    Image,
    ImageBackground,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import BottomTabs from "../components/BottomTabs";
import CustomDrawer from "../components/Customrawer";

export default function Profile() {
  const [editMode, setEditMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("männlich");
  const [imageUri, setImageUri] = useState("");

  // ----------------------------------------------------------
  // Load stored user data
  // ----------------------------------------------------------
  useEffect(() => {
    async function loadUser() {
      const stored = await AsyncStorage.getItem("user");
      if (!stored) return;

      const u = JSON.parse(stored);

      setName(u.name || "");
      setPhone(u.phone || "");
      setBirthdate(u.birthdate || "");
      setGender(u.gender || "männlich");
      setImageUri(u.imageUri || "");
    }

    loadUser();
  }, []);

  // ----------------------------------------------------------
  // Pick image
  // ----------------------------------------------------------
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // ----------------------------------------------------------
  // Save updated data
  // ----------------------------------------------------------
  async function saveProfile() {
    const stored = await AsyncStorage.getItem("user");
    const previous = stored ? JSON.parse(stored) : {};

    const updated = {
      ...previous,
      name,
      phone,
      birthdate,
      gender,
      imageUri,
    };

    await AsyncStorage.setItem("user", JSON.stringify(updated));

    setEditMode(false);
    alert("Profil gespeichert!");
  }

  // ----------------------------------------------------------

  return (
    <ImageBackground
      source={require("../assets/bg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#2B2B2B" />
          </TouchableOpacity>

          <Text style={styles.brand}>Calmora</Text>

          <TouchableOpacity onPress={() => setMenuOpen(true)} activeOpacity={0.7}>
            <Ionicons name="menu" size={24} color="#2B2B2B" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroIconContainer}>
            <Ionicons name="person" size={36} color="#9E86B9" />
          </View>
          <Text style={styles.heroTitle}>Mein Profil</Text>
        </View>

        {/* Profile Image */}
        <TouchableOpacity
          onPress={() => editMode && pickImage()}
          style={styles.imageWrapper}
          activeOpacity={0.7}
          disabled={!editMode}
        >
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require("../assets/profile-placeholder.jpg")
            }
            style={styles.profileImage}
          />

          {editMode && (
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {/* Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={20} color="#9E86B9" />
            <Text style={styles.sectionTitle}>Persönliche Informationen</Text>
          </View>

          {/* Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Name</Text>
            <View style={[styles.inputWrapper, !editMode && styles.disabledInputWrapper]}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <TextInput
                editable={editMode}
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Phone */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Telefonnummer</Text>
            <View style={[styles.inputWrapper, !editMode && styles.disabledInputWrapper]}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <TextInput
                editable={editMode}
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="Telefonnummer"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Birthdate */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Geburtsdatum</Text>
            <View style={[styles.inputWrapper, !editMode && styles.disabledInputWrapper]}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <TextInput
                editable={editMode}
                style={styles.input}
                value={birthdate}
                onChangeText={setBirthdate}
                placeholder="DD.MM.YYYY"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Gender */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Geschlecht</Text>
            <View style={[styles.pickerBox, !editMode && styles.disabledInputWrapper]}>
              <Ionicons name="male-female-outline" size={20} color="#666" style={styles.pickerIcon} />
              <Picker
                enabled={editMode}
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Männlich" value="männlich" />
                <Picker.Item label="Weiblich" value="weiblich" />
                <Picker.Item label="Divers" value="divers" />
              </Picker>
            </View>
          </View>

          {/* Buttons */}
          {!editMode ? (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setEditMode(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="create" size={20} color="#fff" />
              <Text style={styles.btnText}>Bearbeiten</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setEditMode(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#fff" />
                <Text style={styles.btnText}>Abbrechen</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={saveProfile}
                activeOpacity={0.7}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.btnText}>Speichern</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Drawer Modal */}
      {menuOpen && (
        <Modal
          visible={menuOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuOpen(false)}
        >
          <View style={styles.drawerContainer}>
            <Pressable
              style={styles.drawerOverlay}
              onPress={() => setMenuOpen(false)}
            />
            <View style={styles.drawerContent}>
              <CustomDrawer
                navigation={{
                  navigate: (route: string) => {
                    router.push(route as any);
                    setMenuOpen(false);
                  },
                }}
                onLogout={() => {
                  setMenuOpen(false);
                }}
              />
            </View>
          </View>
        </Modal>
      )}

      <BottomTabs />
    </ImageBackground>
  );
}

// ================================================================
//                        STYLES
// ================================================================
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    marginBottom: 8,
  },
  brand: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2B2B2B",
  },

  hero: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 12,
  },
  heroIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2B2B2B",
  },

  imageWrapper: {
    alignSelf: "center",
    marginBottom: 24,
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#9E86B9",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#9E86B9",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },

  section: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B2B2B",
  },

  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  disabledInputWrapper: {
    backgroundColor: "#F3F3F3",
    opacity: 0.7,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2B2B2B",
  },

  pickerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  pickerIcon: {
    marginRight: 10,
  },
  picker: {
    flex: 1,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  editBtn: {
    backgroundColor: "#9E86B9",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },

  /* Drawer */
  drawerContainer: {
    flex: 1,
    flexDirection: "row",
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  drawerContent: {
    width: 280,
    height: "100%",
  },
});





