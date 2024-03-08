export function splitResults(res: PromiseSettledResult<{ id: string | number }>[]): [
  PromiseFulfilledResult<{
    id: string | number;
  }>[],
  PromiseRejectedResult[],
] {
  return res.reduce(
    (acc: [PromiseFulfilledResult<{ id: string | number }>[], PromiseRejectedResult[]], val) => {
      acc[val.status === "fulfilled" ? 0 : 1].push(val as any);
      return acc;
    },
    [[], []],
  );
}
