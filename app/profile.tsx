import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
  const [editMode, setEditMode] = useState(false);

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
        <Text style={styles.header}>Profil</Text>

        {/* ===== PROFILE IMAGE ===== */}
        <TouchableOpacity
          onPress={() => editMode && pickImage()}
          style={styles.imageWrapper}
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
              <Text style={{ color: "#fff", fontSize: 12 }}>Ändern</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* ===== INFO SECTION ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Persönliche Informationen</Text>

          {/* Name */}
          <Text style={styles.label}>Name</Text>
          <TextInput
            editable={editMode}
            style={[styles.input, !editMode && styles.disabledInput]}
            value={name}
            onChangeText={setName}
          />

          {/* Phone */}
          <Text style={styles.label}>Telefonnummer</Text>
          <TextInput
            editable={editMode}
            style={[styles.input, !editMode && styles.disabledInput]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {/* Birthdate */}
          <Text style={styles.label}>Geburtsdatum</Text>
          <TextInput
            editable={editMode}
            style={[styles.input, !editMode && styles.disabledInput]}
            value={birthdate}
            onChangeText={setBirthdate}
            placeholder="DD.MM.YYYY"
          />

          {/* Gender Picker */}
          <Text style={styles.label}>Geschlecht</Text>
          <View style={[styles.pickerBox, !editMode && styles.disabledInput]}>
            <Picker
              enabled={editMode}
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Picker.Item label="Männlich" value="männlich" />
              <Picker.Item label="Weiblich" value="weiblich" />
              <Picker.Item label="Divers" value="divers" />
            </Picker>
          </View>

          {/* Buttons */}
          {!editMode ? (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => setEditMode(true)}
            >
              <Text style={styles.btnText}>Bearbeiten</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.saveBtn} onPress={saveProfile}>
              <Text style={styles.btnText}>Speichern</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

// ================================================================
//                        STYLES
// ================================================================
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 150,
  },

  header: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 20,
    color: "#4b3f72",
  },

  imageWrapper: {
    alignSelf: "center",
    marginBottom: 20,
    position: "relative",
  },

  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "#9E86B9",
  },

  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#9E86B9",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  section: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 18,
    borderRadius: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  label: {
    marginBottom: 5,
    opacity: 0.7,
  },

  input: {
    backgroundColor: "#F8E3D7",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },

  disabledInput: {
    backgroundColor: "#e6d5cf",
    opacity: 0.6,
  },

  pickerBox: {
    backgroundColor: "#F8E3D7",
    borderRadius: 10,
    marginBottom: 12,
  },

  editBtn: {
    backgroundColor: "#9E86B9",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  saveBtn: {
    backgroundColor: "#85C88A",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  btnText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
});




