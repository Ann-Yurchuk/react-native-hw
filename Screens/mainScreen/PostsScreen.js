
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { authSignOutUser } from "../../redux/auth/authOperations";

import { Ionicons } from "@expo/vector-icons";

import DefaultScreenPost from "../nestedScreen/DefaultScreenPost";
import CommentsScreen from "../nestedScreen/CommentsScreen";
import MapScreen from "../nestedScreen/MapScreen";

import { createStackNavigator } from "@react-navigation/stack";

const NestedScreen = createStackNavigator();

const PostsScreen = () => {
  const dispatch = useDispatch();
  const signOut = () => {
    dispatch(authSignOutUser());
  };
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="Default"
        component={DefaultScreenPost}
        options={{
          title: "Posts",
          headerTitleAlign: "center",
          headerRightContainerStyle: {
            paddingRight: 30,
          },
          headerRight: () => (
            <TouchableOpacity onPress={signOut} title="LogOut">
              <Ionicons name="log-out-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerLeft: null,
        }}
      />
      <NestedScreen.Screen
        name="Comments"
        component={CommentsScreen}
        options={{ headerShown: true }}
      />
      <NestedScreen.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: true }}
      />
    </NestedScreen.Navigator>
  );
};

export default PostsScreen;
