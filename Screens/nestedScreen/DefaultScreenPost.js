import { useState, useEffect } from "react";
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

const DefaultScreenPost = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (route.params) {
      setPosts((prevState) => [...prevState, route.params]);
    }
  }, [route.params]);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.photo }}
              style={{ marginHorizontal: 10, height: 200, width: 250 }}
            />
            <View style={styles.commentsContainer}>
              <TouchableOpacity
                title={"Comments"}
                onPress={() => navigation.navigate("Comments")}
              >
                <Text style={{ color: "grey" }}>
                  <FontAwesome5 name="comments" size={24} color="black" />
                  {item.commentsCount ?? 0}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                title={"Map"}
                onPress={() => navigation.navigate("Map")}
              >
                <Text style={{ color: "grey" }}>
                  <Ionicons name="location-outline" size={24} color="black" />
                  {item.location ?? ""}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        activeOpacity={0.8}
        style={{ alignSelf: "center" }}
        onPress={() => navigation.navigate("Map")}
      >
        <Text style={{ marginRight: 5, marginTop: 16 }}>go to map{""}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{ alignSelf: "center" }}
        onPress={() => navigation.navigate("Comments")}
      >
        <Text style={{ marginRight: 5, marginTop: 16 }}>
          go to comments{""}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  imageContainer: {
    marginBottom: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  commentsContainer: {
    flexDirection: "row",
    display: "flex",
    marginTop: 5,
    marginBottom: 20,
  },
});

export default DefaultScreenPost;
