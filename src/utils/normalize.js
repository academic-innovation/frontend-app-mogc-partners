const noralizeSliceData = (data, key) => {
  const entities = {};
  data.forEach((item) => { entities[item.id] = item; });
  return {
    entities: { [key]: entities },
    result: Object.keys(entities),
  };
};

export default noralizeSliceData;
