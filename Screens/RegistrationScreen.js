import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Keyboard,
  ImageBackground,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { authSingUpUser } from "../redux/auth/authOperations";

const initialState = {
  login: "",
  email: "",
  password: "",
};

export default function RegistrationScreen({ navigation }) {
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [state, setState] = useState(initialState);

  const dispatch = useDispatch();

  const handleSubmit = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    dispatch(authSingUpUser(state));
    setState(initialState);
    navigation.navigate("Home", { authorize: true });
  };

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
              <View>
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
  },
  headerTitle: {
    fontSize: 30,
    color: "#212121",
    fontFamily: "Roboto-Medium",
  },
});
