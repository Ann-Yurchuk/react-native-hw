import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Keyboard,
  Image,
  ImageBackground,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { authSingUpUser } from "../redux/auth/authOperations";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { EvilIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const initialState = {
  login: "",
  email: "",
  password: "",
};

export default function RegistrationScreen({ navigation }) {
  const cameraRef = useRef();
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);
  const [avatarPhoto, setAvatarPhoto] = useState(null);
  const [makePhoto, setMakePhoto] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 0.5, base64: true, skipProcessing: true };
        const data = await cameraRef.current.takePictureAsync(options);
        const source = data.uri;
        if (source) {
          await cameraRef.current.pausePreview();
          setIsPreview(true);
          setAvatarPhoto(source);
          setMakePhoto("user");
          await ImagePicker.launchImageLibraryAsync(source);
        }
      } catch (error) {
        console.log(error.message);
        alert(error.message);
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

  const uploadPhotoAvatar = async () => {
    try {
      const storage = getStorage();
      const response = await fetch(avatarPhoto);
      const file = await response.blob();
      const uniquePostId = Date.now().toString();
      const data = await ref(storage, `avatars/${uniquePostId}`);
      const uploadTask = await uploadBytes(data, file);
      return await getDownloadURL(data);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  const toggleMakePhoto = () => {
    if (!makePhoto) {
      setMakePhoto("camera");
    }
    if (makePhoto === "camera" || makePhoto === "user") {
      setMakePhoto(null);
    }
  };

  const handleSubmit = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    const userAvatar = uploadPhotoAvatar();
    dispatch(authSingUpUser({ ...state, avatar: userAvatar }));
    setState(initialState);
    navigation.navigate("Home", { authorize: true });
  };

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <TouchableWithoutFeedback onPress={handleSubmit}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ImageBackground
            style={styles.image}
            source={require("../assets/images/mountains.jpg")}
          >
            <View>
              {!makePhoto && (
                <Image
                  style={styles.imageAvatar}
                  source={require("../assets/images/avatar.jpg")}
                />
              )}
              {makePhoto === "camera" && (
                <Camera style={styles.camera} ref={cameraRef} type={cameraType}>
                  <View
                    style={styles.takePhotoContainer}
                    onPress={switchCamera}
                  >
                    {makePhoto && (
                      <TouchableOpacity onPress={takePhoto}>
                        <EvilIcons name="camera" size={25} color="black" />
                      </TouchableOpacity>
                    )}
                  </View>
                </Camera>
              )}
              {makePhoto === "user" && (
                <Image
                  source={{ uri: avatarPhoto }}
                  style={{ width: 120, height: 120 }}
                />
              )}
            </View>

            <TouchableOpacity
              style={styles.addButtonContainer}
              onPress={toggleMakePhoto}
            >
              <View>
                <AntDesign name="pluscircleo" size={24} color="grey" />
              </View>
            </TouchableOpacity>
            <View
              style={{
                ...styles.form,
                marginBottom: isShowKeyboard ? -32 : -50,
              }}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Registration</Text>
              </View>

              <View style={{ marginTop: 20 }}>
                <Text style={styles.inputTitle}>Login</Text>
                <TextInput
                  style={styles.input}
                  textAlign={"center"}
                  value={state.login}
                  onFocus={() => {
                    setIsShowKeyboard(true);
                  }}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, login: value }))
                  }
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.inputTitle}>Email address</Text>
                <TextInput
                  style={styles.input}
                  textAlign={"center"}
                  value={state.email}
                  onFocus={() => {
                    setIsShowKeyboard(true);
                  }}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, email: value }))
                  }
                />
              </View>
              <View style={{ marginTop: 20 }}>
                <Text style={styles.inputTitle}>Password</Text>
                <TextInput
                  style={styles.input}
                  textAlign={"center"}
                  value={state.password}
                  secureTextEntry={true}
                  onFocus={() => {
                    setIsShowKeyboard(true);
                  }}
                  onChangeText={(value) =>
                    setState((prevState) => ({ ...prevState, password: value }))
                  }
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.btn}
                onPress={handleSubmit}
              >
                <Text style={styles.btnTitle}>Sing Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={{ alignSelf: "center" }}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={{ marginRight: 5, marginTop: 16 }}>
                  Already have an account? {""}
                  <Text style={styles.navigate}>Sign in</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-end",
    backgroundColor: "#fff",
  },
  image: {
    minHeight: "100%",
    minWidth: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  imageAvatar: {
    width: 120,
    height: 120,
    top: 20,
    borderRadius: 10,
  },
  form: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    padding: 16,
    minHeight: "80%",
    minWidth: "100%",
    borderRadius: 26,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e8e8e8",
    height: 50,
    borderRadius: 8,
    color: "#212121",
    backgroundColor: "#f6f6f6",
  },
  inputTitle: {
    color: "#212121",
    marginBottom: 16,
    fontSize: 18,
    fontFamily: "Roboto-Regular",
  },
  btn: {
    backgroundColor: "#ff6C00",
    height: 50,
    borderRadius: 30,
    marginTop: 10,
    marginHorizontal: 20,
  },
  btnTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Roboto-Regular",
    textAlign: "center",
    marginVertical: 8,
  },
  navigate: {
    color: "#1B4371",
  },
  header: {
    alignItems: "center",
    marginBottom: 33,
    marginTop: 43,
  },
  headerTitle: {
    fontSize: 30,
    color: "#212121",
    fontFamily: "Roboto-Medium",
  },
  camera: {
    width: 120,
    height: 120,
    marginHorizontal: 16,
    marginTop: 372,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  takePhotoContainer: {
    top: -10,
    left: -10,
    borderColor: "#e8e8e8",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    width: 60,
    height: 60,
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
  addButtonContainer: {
    left: 60,
    top: -20,
    backgroundColor: "#ffffff",
    borderRadius: 50,
  },
});
