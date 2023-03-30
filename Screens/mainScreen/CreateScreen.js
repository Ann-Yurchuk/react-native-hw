import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Text,
  View,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Camera } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const initialState = {
  postName: "",
  location: "",
};

const CreateScreen = ({ navigation }) => {
  const cameraRef = useRef();
  const [photo, setPhoto] = useState(null);
  const [photoName, setPhotoName] = useState(initialState);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const { userId, login } = useSelector((state) => state.auth);
  const db = getFirestore();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 0.5, base64: true, skipProcessing: true };
        const data = await cameraRef.current.takePictureAsync(options);
        let location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setLocation(coords);
        const source = data.uri;
        if (source) {
          await cameraRef.current.pausePreview();
          setIsPreview(true);
          console.log("photo", source);
          setPhoto(source);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const uploadPhoto = async () => {
    try {
      const storage = getStorage();
      const response = await fetch(photo);
      const file = await response.blob();
      const uniquePostId = Date.now().toString();
      const data = await ref(storage, `postImage/${uniquePostId}`);
      const uploadTask = await uploadBytes(data, file);
      return await getDownloadURL(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const uploadPost = async () => {
    try {
      const photo = await uploadPhoto();
      const uniquePostId = Date.now().toString();
      await setDoc(doc(db, "posts", `${uniquePostId}`), {
        photo,
        photoName,
        location,
        login,
        userId,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const sendPhoto = () => {
    uploadPost();
    navigation.navigate("Default");
    setPhoto(null);
    setPhotoName(initialState);
  };

  if (photo) {
    const sharePic = () => {
      shareAsync(photo.uri);
      setPhoto(photo.uri);
    };

    const savePhoto = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(result);
      setHasMediaLibraryPermission(result.status === "granted");
      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
      setPhoto(undefined);
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
          style={styles.preview}
        />
        <Button title="Share" onPress={sharePic} />
        {!hasMediaLibraryPermission ? (
          <Button title="Save" onPress={savePhoto} />
        ) : undefined}
        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={sendPhoto}
            style={styles.sendContainer}
          >
            <Text style={styles.textButton}>Publish</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setPhoto(undefined)}
            style={styles.buttonContainer}
          >
            <AntDesign name="delete" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} type={cameraType}>
        <View style={styles.takePhotoContainer} onPress={switchCamera}>
          <Image source={{ uri: photo }} style={{ width: 190, height: 190 }} />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={takePhoto}
          style={styles.buttonContainer}
        >
          <EvilIcons name="camera" size={25} color="black" />
        </TouchableOpacity>
      </Camera>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name post"
          style={styles.input}
          textAlign={"center"}
          value={photoName.postName}
          onFocus={() => {
            setIsShowKeyboard(true);
          }}
          onChangeText={(value) =>
            setPhotoName((prevState) => ({ ...prevState, postName: value }))
          }
        />
      </View>
      <View style={{ marginTop: 20 }}>
        <TextInput
          placeholder="Location"
          style={styles.input}
          textAlign={"center"}
          value={photoName.location}
          onFocus={() => {
            setIsShowKeyboard(true);
          }}
          onChangeText={(value) =>
            setPhotoName((prevState) => ({ ...prevState, location: value }))
          }
        />
      </View>
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={sendPhoto}
          style={styles.sendContainer}
        >
          <Text style={styles.textButton}>Public</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setPhoto(undefined)}
          style={styles.buttonContainer}
        >
          <AntDesign name="delete" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  camera: {
    height: "50%",
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 20,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
  buttonContainer: {
    width: 60,
    height: 60,
    marginBottom: 25,
    marginHorizontal: 170,
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  takePhotoContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    borderColor: "#e8e8e8",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    width: 200,
    height: 200,
  },

  sendContainer: {
    width: 350,
    height: 40,
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: "6%",
    borderWidth: 1,
    borderColor: "#f6f6f6",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
  },
  textButton: {
    color: "#bdbdbd",
    fontSize: 16,
  },
  inputContainer: {
    marginHorizontal: 10,
  },

  input: {
    borderWidth: 1,
    borderBottomColor: "#e8e8e8",
    borderColor: "#ffffff",
    height: 50,
    borderRadius: 8,
    color: "#212121",
    backgroundColor: "#ffffff",
  },
});

export default CreateScreen;
