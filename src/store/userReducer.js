import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for user login
export const loginUser = createAsyncThunk('user/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:3001/api/v1/user/login', userData,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        console.log("response ", response);
        return response.data;
    } catch (error) {
        // console.error('Error logging in user:', error);
        return rejectWithValue("Wrong email or password");
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        isLoggedIn: false,
        isLoading: false,
        error: null
    },
    reducers: {
        logoutUser(state) {
            state.userInfo = null;
            state.isLoggedIn = false;
            window.location.href = '/login';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log("action ", action);
                state.userInfo = action.payload;
                state.isLoggedIn = true;
                state.isLoading = false;
                // redirect to /profile
                window.location.href = '/profile';
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    }
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
