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
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error);
        return rejectWithValue("Wrong email or password");
    }
});

// Async thunk for getting user info
export const getUserInfo = createAsyncThunk('user/getUserInfo', async (_, { getState, rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.post('http://localhost:3001/api/v1/user/profile', _, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        });
        return response.data;
    } catch (error) {
        // console.error('Error getting user info:', error);
        return rejectWithValue('Failed to fetch user info');
    }
});


// Async thunk for updating user info
export const updateUserInfo = createAsyncThunk('user/profile', async (userData, {rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.put('http://localhost:3001/api/v1/user/profile', userData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        });
        return response.data;
    } catch (error) {
        // console.error('Error getting user info:', error);
        return rejectWithValue('Failed to fetch user info');
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        token: null,
        isLoggedIn: false,
        isLoading: false,
        error: null
    },
    reducers: {
        logoutUser(state) {
            state.userInfo = null;
            state.isLoggedIn = false;
            state.isLoading = false;
            state.token = null;
            localStorage.removeItem('token');
            window.location.href = '/login'; // TODO Redirect to login page from component
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.token = action.payload.body.token;
                localStorage.setItem('token', action.payload.body.token);
                getUserInfo();
                state.isLoggedIn = true;
                state.isLoading = false;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            })
            .addCase(getUserInfo.pending, (state, action) => {
                state.error = null;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.userInfo = action.payload.body;
                state.isLoading = false;
                state.isLoggedIn = true;
            })
            .addCase(updateUserInfo.fulfilled, (state, action) => {
                state.userInfo = action.payload.body;
                state.isLoading = false;
                state.isLoggedIn = true;
            })
    }
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
