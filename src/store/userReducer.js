import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// Create an async thunk for loginUser
export const loginUser = createAsyncThunk('user/login',
    async (userData, { rejectWithValue }) => {
    try {
        localStorage.removeItem('token');
        // Check if the email and password are empty
        if (userData.email === '') return rejectWithValue("Email is required");
        if (userData.password === '') return rejectWithValue("Password is required");
        // Make a POST request to the server
        const response = await axios.post('http://localhost:3001/api/v1/user/login', userData,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
        // Return the response data
        return response.data;
    } catch (error) {
        return rejectWithValue("Wrong email or password");
    }
});

// Create an async thunk for getUserInfo
export const getUserInfo = createAsyncThunk('user/getUserInfo',
    async (_, { _getState, rejectWithValue }) => {
    try {
        // Get the token from the local storage
        const token = localStorage.getItem('token');
        // Make a POST request to the server
        const response = await axios.post('http://localhost:3001/api/v1/user/profile', _, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue('Failed to fetch user info');
    }
});

// Create an async thunk for updateUserInfo
export const updateUserInfo = createAsyncThunk('user/profile',
    async (userData, {rejectWithValue }) => {
    try {
        // Get the token from the local storage
        const token = localStorage.getItem('token');
        // Make a PUT request to the server
        const response = await axios.put('http://localhost:3001/api/v1/user/profile', userData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue('Failed to fetch user info');
    }
});

// Create userSlice
const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null, // the user info
        token: null, // the token for the user
        isLoggedIn: false, // if the user is logged in
        isLoading: false, // if the data is loading
        error: null // if there is an error
    },
    reducers: {
        logoutUser(state) {
            state.userInfo = null;
            state.isLoggedIn = false;
            state.isLoading = false;
            state.token = null;
            localStorage.removeItem('token');
        }
    },

    // Add extra reducers
    extraReducers: (builder) => {
        builder

            // Add reducers for loginUser
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

            // Add reducers for getUserInfo
            .addCase(getUserInfo.pending, (state) => {
                state.error = null;
                state.isLoading = true;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.userInfo = action.payload.body;
                state.isLoading = false;
                state.isLoggedIn = true;
            })

            // Add reducers for updateUserInfo
            .addCase(updateUserInfo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUserInfo.fulfilled, (state, action) => {
                state.userInfo = action.payload.body;
                state.isLoading = false;
                state.isLoggedIn = true;
            })
            .addCase(updateUserInfo.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
            });
    }
});

export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
