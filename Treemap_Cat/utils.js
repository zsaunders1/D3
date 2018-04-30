// example of how to export functions
// this particular util only doubles a value so it shouldn't be too useful
export function groupBy(data, accesor) {
  return data.reduce((acc, row) => {
    if (!acc[row[accesor]]) {
      acc[row[accesor]] = [];
    }
    acc[row[accesor]].push(row);
    return acc;
  }, {});
}

export function recursiveGroupBy(data, keys) {
  const grouping = groupBy(data, keys[0]);
  return Object.keys(grouping)
    .map(name => {
      if (keys.length > 1) {
        return {
          name,
          children: recursiveGroupBy(grouping[name], keys.slice(1))
        };
      }
      return {
        name,
        size: data.reduce((acc) => acc + 1, 0)
      };
    });
}
