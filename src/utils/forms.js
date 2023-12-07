// eslint-disable-next-line
export const getCohortFilterOptions = (cohorts) => cohorts.reduce((options, cohort) => {
  options.push({
    name: cohort.name,
    value: cohort.uuid,
  });
  return options;
}, []);
