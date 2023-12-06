export const getCohortFilterOptions = (cohorts) => {
  return cohorts.reduce((options, cohort) => {
    options.push({
      name: cohort.name,
      value: cohort.uuid,
    });
    return options;
  }, []);
};
