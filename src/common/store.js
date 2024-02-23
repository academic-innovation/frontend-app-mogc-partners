import { configureStore } from '@reduxjs/toolkit';

import partnersReducer from '../features/partners/partnersSlice';
import cohortsReducer from '../features/cohorts/cohortsSlice';
import offeringsReducer from '../features/offerings/offeringsSlice';
import membersReducer from '../features/members/membersSlice';
import enrollmentsReducer from '../features/enrollments/enrollmentsSlice';
import recordsReducer from '../features/enrollments/recordsSlice';

export default configureStore({
  reducer: {
    partners: partnersReducer,
    cohorts: cohortsReducer,
    offerings: offeringsReducer,
    members: membersReducer,
    enrollments: enrollmentsReducer,
    records: recordsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
