import { configureStore } from '@reduxjs/toolkit';

import partnersReducer from '../features/partners/partnersSlice';
import catalogsReducer from '../features/catalogs/catalogsSlice';
import offeringsReducer from '../features/offerings/offeringsSlice';
import membersReducer from '../features/members/membersSlice';
import enrollmentsReducer from '../features/enrollments/enrollmentsSlice';

export default configureStore({
  reducer: {
    partners: partnersReducer,
    catalogs: catalogsReducer,
    offerings: offeringsReducer,
    members: membersReducer,
    enrollments: enrollmentsReducer,
  },
});
