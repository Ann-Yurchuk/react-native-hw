// import { moduleName } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import DefaultScreenPost from "../nestedScreen/DefaultScreenPost";
import CommentsScreen from "../nestedScreen/CommentsScreen";
import MapScreen from "../nestedScreen/MapScreen";

const NestedScreen = createStackNavigator();

const PostsScreen = () => {
  return (
    <NestedScreen.Navigator>
      <NestedScreen.Screen
        name="Default"
        component={DefaultScreenPost}
        options={{ headerShown: true }}
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
