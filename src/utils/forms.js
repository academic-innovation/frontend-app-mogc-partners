// eslint-disable-next-line
export const getCohortFilterOptions = (cohorts) => (
  cohorts.map((cohort) => ({
    name: cohort.name,
    value: cohort.uuid,
  }))
);
