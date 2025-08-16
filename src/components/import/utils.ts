export function splitResults(res: PromiseSettledResult<{ id: number | string }>[]): [
  PromiseFulfilledResult<{
    id: number | string
  }>[],
  PromiseRejectedResult[],
] {
  return res.reduce(
    (acc: [PromiseFulfilledResult<{ id: number | string }>[], PromiseRejectedResult[]], val) => {
      acc[val.status === 'fulfilled' ? 0 : 1].push(val as any)
      return acc
    },
    [[], []],
  )
}
