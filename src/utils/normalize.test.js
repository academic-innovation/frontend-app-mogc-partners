import normalizeSliceData from './normalize';

describe('normalizeSliceData', () => {
  it('maps items by ID under the given key', () => {
    const data = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ];

    const normalized = normalizeSliceData(data, 'someKey');

    expect(normalized.entities).toContainKey('someKey');
    expect(normalized.entities.someKey).toEqual({
      1: { id: 1 },
      2: { id: 2 },
      3: { id: 3 },
    });
    expect(normalized.result).toIncludeSameMembers(['1', '2', '3']);
  });

  it('returns the expected object shape when data is an empty array', () => {
    const normalized = normalizeSliceData([], 'someKey');

    expect(normalized.entities.someKey).toBeEmptyObject();
    expect(normalized.result).toBeArrayOfSize(0);
  });
});
