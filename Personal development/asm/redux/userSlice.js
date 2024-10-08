import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userId: null,
        username: null,
        email: null,
        image:null,
    },
    reducers: {
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setEmail1: (state, action) => {
            state.email = action.payload;
        },
        setImage: (state, action) => {
            state.image = action.payload;
        },
        updateUser: (state, action) => {
            const { userId, username, image } = action.payload;
            if (userId !== undefined) state.userId = userId;
            if (username !== undefined) state.username = username;
            if (image !== undefined) state.image = image;
          },
    },
});

export const { setUserId, setUsername, setEmail1,setImage ,updateUser} = userSlice.actions;
export default userSlice.reducer;
