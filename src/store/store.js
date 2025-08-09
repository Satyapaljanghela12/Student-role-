import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import classSlice from './slices/classSlice';
import assignmentSlice from './slices/assignmentSlice';
import attendanceSlice from './slices/attendanceSlice';
import quizSlice from './slices/quizSlice';
import resourceSlice from './slices/resourceSlice';
import communicationSlice from './slices/communicationSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    classes: classSlice,
    assignments: assignmentSlice,
    attendance: attendanceSlice,
    quizzes: quizSlice,
    resources: resourceSlice,
    communication: communicationSlice,
  },
});

export default store;