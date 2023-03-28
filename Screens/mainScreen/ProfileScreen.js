import { useEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  Image,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { authSignOutUser } from "../../redux/auth/authOperations";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

const ProfileScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);
  const [like, setLike] = useState(0);
  const [comment, setComment] = useState(0);
  // const { id, photo, photoName } = route.params;

  const getUserPosts = async () => {
    try {
      const q = query(collection(db, "posts"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const allPosts = querySnapshot.docs.map((post) => ({
        ...post.data(),
        id: post.id,
      }));
      setUserPosts(allPosts);
      console.log(userPosts);
      console.log(allPosts);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUserPosts();
  }, [userId]);

  const signOut = () => {
    dispatch(authSignOutUser());
  };

  const onPress = () => {
    setLike(like + 1);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.image}
        source={require("../../assets/images/mountains.jpg")}
      >
        <View>
          <Image
            source={require("../../assets/images/avatar.jpg")}
            style={styles.imageAvatar}
          />

          <Text> It's me</Text>
        </View>
        <Button title="singOut" onPress={signOut} />
        <View style={styles.flatContainer}>
          <FlatList
            data={userPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.photo }} style={styles.imagePost} />
                <View>
                  <Text>{item.photoName.postName}</Text>
                </View>

                <View style={styles.commentsContainer}>
                  <TouchableOpacity
                    title={"Comments"}
                    style={{ marginRight: 30 }}
                    onPress={() =>
                      navigation.navigate("Comments", {
                        id: item.id,
                        photo: item.photo,
                      })
                    }
                  >
                    <Text style={{ color: "grey" }}>
                      <FontAwesome5 name="comments" size={24} color="black" />
                      {comment ?? 0}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    title={"Like"}
                    style={{ marginRight: 20 }}
                    onPress={onPress}
                  >
                    <Text style={{ color: "grey" }}>
                      <Fontisto name="like" size={24} color="black" />
                      {like}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    title={"Map"}
                    style={{ marginRight: 5 }}
                    onPress={() =>
                      navigation.navigate("Map", {
                        // location: {latitude: item.location.latitude,longitude: item.location.longitude},
                        location: item.location,
                      })
                    }
                  >
                    <Text style={{ color: "grey" }}>
                      <Ionicons
                        name="location-outline"
                        size={24}
                        color="black"
                      />
                      <View>
                        <Text>{item.photoName.location}</Text>
                      </View>
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
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
  imageContainer: {
    marginBottom: 10,
  },
  imagePost: {
    marginHorizontal: 10,
    height: 200,
    width: 250,
    borderRadius: 10,
  },
  commentsContainer: {
    flexDirection: "row",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 10,
  },
  flatContainer: {
    backgroundColor: "#ffffff",
    marginHorizontal: 30,
    padding: 16,
    height: "80%",
    width: "100%",
    borderRadius: 16,
    display: "flex",
    justifyContent: "flex-end",
  },
});

export default ProfileScreen;
