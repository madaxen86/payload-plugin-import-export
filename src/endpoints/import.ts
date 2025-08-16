/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PayloadHandler } from 'payload'

export const importEndpointConfig: PayloadHandler = async (req) => {
  const slug = req.routeParams?.collection as string | undefined
  if (req.method?.toUpperCase() === 'GET') {
    return Response.json({ message: 'GET not allowed' })
  }
  const data = await req?.json?.()
  if (!data) {
    return Response.json({
      message: 'No data provided',
      status: 203,
    })
  }
  const { payload, user } = req
  if (!slug) {
    throw Error('Must be used in collection')
  }
  const locale = req.locale

  const results = await Promise.allSettled(
    data?.map(async (item: Record<string, any>) => {
      const data = await payload
        .update({
          id: item.id,
          collection: slug,
          data: item,
          overrideAccess: false,
          user,
          ...(locale && { locale }),
        })
        .catch(async (err: any) => {
          //create if update failed
          const createIfNotExist = !!req?.headers?.get('x-import-if-not-exists') // header('x-import-if-not-exists')
          if (createIfNotExist === true) {
            try {
              const created = await payload.create({
                collection: slug,
                data: item,
                overrideAccess: false,
                user,
                ...(locale && { locale }),
              })
              return created
            } catch (err: any) {
              const data = [...err, { data: item.id }]
              throw Error(JSON.stringify(data))
            }
          }
          const data = [...err, { data: item.id }]
          throw Error(JSON.stringify(data))
        })

      return data
    }),
  )
  return Response.json(results)
}
