import type { Payload } from 'payload'

import { devUser } from './helpers/credentials.js'
const numbers = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
} as const

export const seed = async (payload: Payload) => {
  const { totalDocs } = await payload.count({
    collection: 'users',
    where: {
      email: {
        equals: devUser.email,
      },
    },
  })

  if (!totalDocs) {
    await payload.create({
      collection: 'users',
      data: devUser,
    })
  }
  const { docs, totalDocs: totalMediaDocs } = await payload.find({
    collection: 'media',
  })
  if (totalMediaDocs < 3) {
    await payload.create({
      collection: 'media',
      data: {
        title: numbers[(totalMediaDocs + 1) as [1, 2, 3, 4][number]],
      },
    })
  }
  const { totalDocs: totalPosts } = await payload.count({
    collection: 'posts',
  })
  if (!totalPosts) {
    await payload.create({
      collection: 'posts',
      data: {
        media: docs[0].id,
      },
    })
  }
}
