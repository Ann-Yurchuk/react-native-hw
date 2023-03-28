import { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { collection, getDocs, doc, query, setDoc } from "firebase/firestore";

import { AntDesign } from "@expo/vector-icons";

const CommentsScreen = ({ route }) => {
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [commentId, setCommentId] = useState(null);
  const { id, photo } = route.params;
  const { login, userId } = useSelector((state) => state.auth);

  const createComment = async () => {
    try {
      const uniquePostId = Date.now().toString();
      await setDoc(doc(db, "posts", id, "comments", `${uniquePostId}`), {
        comment,
        login,
        userId,
      });
      setCommentId(uniquePostId);
      setComment(null);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getAllComments = async () => {
    try {
      const q = query(collection(db, "posts", id, "comments"));
      const querySnapshot = await getDocs(q);
      const allComments = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAllComments(allComments);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAllComments();
  }, [commentId]);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={{ width: 150, height: 150 }} />
        </View>
        <SafeAreaView style={styles.containerComit}>
          <FlatList
            data={allComments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <View style={styles.userComment}>
                  <Image source={require("../../assets/images/ellipse.png")} />
                  <Text>{item.login}</Text>
                </View>
                <Text>{item.comment}</Text>
              </View>
            )}
          />
        </SafeAreaView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={comment}
            onChangeText={(value) => setComment(value)}
            placeholder="comment"
          ></TextInput>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={createComment}
          style={styles.sendContainer}
        >
          <Text style={styles.textButton}>Add comment</Text>
          <AntDesign name="upcircle" size={24} color="black" />
        </TouchableOpacity>
        <View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setAllComments(null)}
            style={styles.buttonContainer}
          >
            <AntDesign name="delete" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  photoContainer: {
    borderColor: "#e8e8e8",
    borderRadius: 10,
    borderWidth: 1,
    top: 10,
    left: 10,
  },
  containerComit: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    padding: 7,
    height: "40%",
    width: "100%",
    backgroundColor: "white",
  },
  commentContainer: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    marginHorizontal: 10,
    padding: 10,
    marginBottom: 10,
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userComment: {
    flexDirection: "row",
    display: "flex",

    alignItems: "flex-start",
  },
  sendContainer: {
    width: 350,
    height: 50,
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    marginHorizontal: "6%",
    borderWidth: 1,
    borderColor: "#f6f6f6",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    flexDirection: "row",
    display: "flex",
  },
  textButton: {
    color: "#bdbdbd",
    fontSize: 16,
    marginRight: 10,
  },
  inputContainer: {
    marginHorizontal: 10,
    width: 350,
  },

  input: {
    borderWidth: 1,
    borderBottomColor: "#e8e8e8",
    borderColor: "#ffffff",
    height: 50,
    borderRadius: 8,
    color: "#212121",
    backgroundColor: "transparent",
  },
  buttonContainer: {
    width: 60,
    height: 60,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});

export default CommentsScreen;
