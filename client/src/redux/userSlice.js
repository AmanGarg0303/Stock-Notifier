import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
  updateLoading: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    updateStart: (state) => {
      state.updateLoading = true;
      state.error = false;
    },
    updateSuccess: (state, action) => {
      state.updateLoading = false;
      state.error = false;
      state.currentUser = action.payload;
    },
    updateFailure: (state) => {
      state.updateLoading = false;
      state.error = true;
    },
    addToFav: (state, action) => {
      state.currentUser?.favourites?.push(action.payload);
    },
    removeFromFav: (state, action) => {
      state?.currentUser?.favourites?.splice(
        state?.currentUser?.favourites?.findIndex(
          (userId) => userId === action.payload
        ),
        1
      );
    },
    updateFavourites: (state, action) => {
      if (!state.currentUser.favourites.includes(action.payload)) {
        state.currentUser.favourites.push(action.payload);
      } else {
        state.currentUser?.favourites?.splice(
          state.currentUser?.favourites.findIndex(
            (id) => id === action.payload
          ),
          1
        );
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateStart,
  updateSuccess,
  updateFailure,
  updateFavourites,
  addToFav,
  removeFromFav,
} = userSlice.actions;

export default userSlice.reducer;
