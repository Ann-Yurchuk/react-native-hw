import { auth } from "../../firebase/config";
import { authSlice } from "./authReducer";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";

const { updateUserProfile, authSignOut, authStateChange } = authSlice.actions;

export const authSingUpUser =
  ({ login, email, password }) =>
  async (dispatch, getState) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: login,
      });

      const { uid, displayName } = auth.currentUser;
      dispatch(
        updateUserProfile({
          userId: uid,
          login: displayName,
        })
      );
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
    }
  };

export const authSingInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        const { uid, displayName } = auth.currentUser;
        dispatch(
          updateUserProfile({
            userId: uid,
            login: displayName,
          })
        );
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
    }
  };
export const authSignOutUser = () => async (dispatch, getState) => {
  try {
    await auth.signOut(auth);
    dispatch(authSignOut());
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  try {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, displayName } = auth.currentUser;
        dispatch(
          updateUserProfile({
            userId: uid,
            login: displayName,
          })
        );
        dispatch(authStateChange({ stateChange: true }));
      }
    });
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
};
