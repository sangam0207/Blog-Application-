import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {

    signInStart:(state,action)=>{
        state.loading=true;
        state.error=null;
    },

    signInSuccess:(state,action)=>{
        state.currentUser=action.payload;
        state.loading=false;
        state.error=null;
    },
    
    signInFailed:(state,action)=>{
        state.loading=false;
        state.error=action.payload;
    },
    
    updateSuccess:(state,action)=>{
      state.loading=false;
      state.currentUser=action.payload;
      state.error=null

    },

    deleteProfileSuccess:(state)=>{
      state.currentUser=null;
    },

    signOutProfileSuccess:(state)=>{
      state.currentUser=null;
    }

  },
});

export const{signInFailed,signInStart,signInSuccess,updateSuccess,deleteProfileSuccess,signOutProfileSuccess}=userSlice.actions;
export default userSlice.reducer;