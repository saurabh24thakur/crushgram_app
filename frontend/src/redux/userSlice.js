import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    profileData:null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload; 
    },
    setProfileData: (state, action) => {
      state.profileData = action.payload; 
    },
    
  },
});

export const { setUserData ,setProfileData} = userSlice.actions;
export default userSlice.reducer;
