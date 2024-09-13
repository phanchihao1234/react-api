import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';
import StudentPage from '../pages/student/StudentPage';

const BASE_URL = 'http://localhost:8080/api/v1';

export const getAlll = createAsyncThunk("student/getAll", async ({ currentPage, limit }, thunkAPI) => {
    const url = BASE_URL + `/student/list?page=${currentPage}&size=${limit}`;
    try {
        const response = await axios.get(url);
        return response.data;
    }
    catch (error) {
        return thunkAPI.rejectWithValue(error.response.data); // Trả về lỗi nếu có
    }
});
export const addNewStudent = createAsyncThunk("student/addNewStudent", async (student, apiThunk) => {
    const url = BASE_URL + `/student/`
    try {
        const response = await axios.post(url, student);
        return response.data
    } catch (error) {
        return apiThunk.rejectWithValue(error.response.data)
    }
})
export const deleteStudent = createAsyncThunk("student/deleteStudent", async (id, apiThunk) => {
    const url = BASE_URL + `/student/${id}`
    try {
        const response = await axios.delete(url);
        return response.data
    } catch (error) {
        return apiThunk.rejectWithValue(error.response.data)
    }
})
export const updateStudent = createAsyncThunk("student/updateStudent", async ({ id, student }, apiThunk) => {
    const url = BASE_URL + `/student/${id}`
    try {
        const response = await axios.put(url, student);
        return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
        return apiThunk.rejectWithValue(error.response.data) // Trả về lỗi nếu có
    }
})
export const searchStudent = createAsyncThunk("student/searchStudent", async (keyWord, apiThunk) => {
    const url = BASE_URL + `/student/search3`
    try {
        const response = await axios.get(url, {
            params: { "name": keyWord }
        });
        return response.data // Trả về dữ liệu từ phản hồi
    } catch (error) {
        return apiThunk.rejectWithValue(error.response.data) // Trả về lỗi nếu có
    }
})
const studentSlice = createSlice({
    name: "student",
    initialState: {
        students: null,
        totalPages: 10,
        status: "",
        message: "",
        error: null
    },
    reducers: {
        resetStatusAndMessage: (state) => {
            state.error = null;
            state.message = ""
            state.status = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAlll.fulfilled, (state, action) => {
                state.students = action.payload.data.studentResponseList
                state.totalPages = action.payload.data.totalPages
            })
            .addCase(addNewStudent.fulfilled, (state, action) => {
                state.status = action.payload.status
                state.message = action.payload.message
                state.students = [...state.students, action.payload.data]

            })
            .addCase(addNewStudent.rejected, (state, action) => {
                state.status = action.payload.status
                state.message = action.payload.message
                state.error = action.payload.data
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.status = action.payload.status
                state.message = action.payload.message
                state.students = state.students.filter(item => item.id !== action.payload.data)
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.status = action.payload.status
                state.message = action.payload.message
                state.error = action.payload.data
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                state.status = action.payload.status
                state.message = action.payload.message
                state.students = state.students.map(student =>
                    student.id === action.payload.data.id ? action.payload.data : student
                );
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.status = action.payload.status
                state.message = action.payload.message
                state.error = action.payload.data
            })
            .addCase(searchStudent.fulfilled, (state, action) => {
                state.students = action.payload.data
                state.status = action.payload.status
            })
            .addCase(searchStudent.rejected, (state, action) => {
                state.status = action.payload.status
                state.message = action.payload.message
                state.error = action.payload.data
            })
        //search khac tuong tu
    }
})
export const { resetStatusAndMessage } = studentSlice.actions
export default studentSlice.reducer