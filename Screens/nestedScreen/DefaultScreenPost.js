import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../../firebase/config";
import { collection, getDocs, query } from "firebase/firestore";

const DefaultScreenPost = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState(0);
  const { avatar, userId, login } = useSelector((state) => state.auth);

  let uniquePostId = "";
  if (route.params) {
    const { uniquePostId } = route.params;
  }

  const getAllPosts = async () => {
    try {
      const q = query(collection(db, "posts", `${uniquePostId}`));
      const querySnapshot = await getDocs(q);
      const allPosts = querySnapshot.docs.map((post) => ({
        ...post.data(),
        id: post.id,
      }));
      setPosts(allPosts);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, [uniquePostId]);

  return (
    <View style={styles.container}>
      {userId && (
        <View>
          {avatar === true || login === true ? (
            <View>
              <Image style={styles.imageAvatar} source={{ uri: avatar }} />
              <View style={styles.profileText}>
                <Text>Login:{login}</Text>
              </View>
            </View>
          ) : (
            <View>
              <Image
                style={styles.imageAvatar}
                source={require("../../assets/images/avatar.jpg")}
              />
              <View style={styles.profileText}>
                <Text>Login:{login}</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.avatarContainer}>
            {item.userId !== userId ? (
              <View>
                <Image
                  style={styles.imageAvatar}
                  source={require("../../assets/images/avatar.jpg")}
                />
                <View style={styles.profileText}>
                  <Text>{item.login}</Text>
                </View>
              </View>
            ) : (
              <View>
                <Image style={styles.imageAvatar} source={{ uri: avatar }} />
                <View style={styles.profileText}>
                  <Text>{item.login}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      /> */}

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <View>
              <Image source={{ uri: item.photo }} style={styles.imagePost} />
              <View>
                <Text>{item.photoName.postName}</Text>
              </View>
            </View>
            <View style={styles.commentsContainer}>
              <TouchableOpacity
                title={"Comments"}
                onPress={() =>
                  navigation.navigate("Comments", {
                    id: item.id,
                    photo: item.photo,
                  })
                }
              >
                <Text style={{ color: "grey" }}>
                  <FontAwesome5 name="comments" size={24} color="grey" />
                  {comment ?? 0}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                title={"Map"}
                onPress={() =>
                  navigation.navigate("Map", {
                    // location: {latitude: item.location.latitude,longitude: item.location.longitude},
                    location: item.location,
                  })
                }
              >
                <Text style={{ color: "grey" }}>
                  <Ionicons name="location-outline" size={24} color="grey" />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  avatarContainer: {
    marginBottom: 10,
    display: "flex",
    justifyContent: "center",
    marginHorizontal: 10,
    top: 10,
    display: "flex",
  },
  imageContainer: {
    marginBottom: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    color: "#212121",
    marginBottom: 16,
    fontSize: 11,
    fontFamily: "Roboto-Regular",
    padding: 10,
  },
  imageAvatar: {
    width: 80,
    height: 80,
    borderRadius: 10,
    top: 10,
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
    marginTop: 5,
    marginBottom: 10,
    alignItems: "flex-start",
  },
});

export default DefaultScreenPost;
