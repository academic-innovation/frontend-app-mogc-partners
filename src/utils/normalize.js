// eslint-disable-next-line
export const noralizeSliceData = (data, key) => {
  const normalizedData = { entities: { [key]: {} }, result: [] };
  return data.reduce((_, item) => {
    normalizedData.entities[key][item.id] = item;
    normalizedData.result.push(item.id);
    return normalizedData;
  }, {});
};
