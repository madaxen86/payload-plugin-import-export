import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { MongoMemoryReplSet } from 'mongodb-memory-server'
import path from 'path'
import { buildConfig } from 'payload'
import importExportPlugin from 'payload-plugin-import-export'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { testEmailAdapter } from './helpers/testEmailAdapter.js'
import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname
}

const buildConfigWithMemoryDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    const memoryDB = await MongoMemoryReplSet.create({
      replSet: {
        count: 3,
        dbName: 'payloadmemory',
      },
    })

    process.env.DATABASE_URI = `${memoryDB.getUri()}&retryWrites=true`
  }

  return buildConfig({
    admin: {
      importMap: {
        baseDir: path.resolve(dirname),
      },
    },
    collections: [
      {
        slug: 'posts',
        fields: [
          {
            name: 'media',
            type: 'relationship',
            relationTo: 'media',
          },
          {
            type: 'tabs',
            tabs: [
              {
                name: 'Tab 1',
                fields: [
                  {
                    name: 'title',
                    type: 'text',
                  },
                ],
              },
              {
                name: 'Tab 2',
                fields: [
                  {
                    name: 'title',
                    type: 'text',
                  },
                ],
              },
            ],
          },
          {
            type: 'group',
            fields: [
              {
                name: 'title',
                type: 'text',
              },
              {
                name: 'title2',
                type: 'text',
              },
            ],
          },
        ],
      },
      {
        slug: 'media',
        fields: [
          {
            name: 'title',
            type: 'text',
          },
        ],
        // upload: {
        //   staticDir: path.resolve(dirname, 'media'),
        // },
      },
    ],
    db: mongooseAdapter({
      ensureIndexes: true,
      url: process.env.DATABASE_URI || '',
    }),
    editor: lexicalEditor(),
    email: testEmailAdapter,
    onInit: async (payload) => {
      await seed(payload)
    },
    plugins: [importExportPlugin({})],
    secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
    sharp,
    typescript: {
      outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
  })
}

export default buildConfigWithMemoryDB()
