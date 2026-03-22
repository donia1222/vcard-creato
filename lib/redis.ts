import Redis from 'ioredis'

// Persist in-memory store on globalThis so Next.js dev mode doesn't lose it
// across hot-reloads or module re-evaluations between routes
declare global {
  // eslint-disable-next-line no-var
  var __vcardMemStore: Map<string, string> | undefined
  // eslint-disable-next-line no-var
  var __vcardRedisReady: boolean | undefined
}

const memStore: Map<string, string> =
  globalThis.__vcardMemStore ?? (globalThis.__vcardMemStore = new Map())

// Redis is only used when REDIS_URL is explicitly set (not the default localhost)
const redisUrl = process.env.REDIS_URL

let redisClient: Redis | null = null
let redisFailed = globalThis.__vcardRedisReady === false

function getRedis(): Redis {
  if (!redisClient) {
    redisClient = new Redis(redisUrl!, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      enableOfflineQueue: false,
      retryStrategy: () => null,
      connectTimeout: 3000,
    })
    redisClient.on('error', (err) => {
      if (!redisFailed) {
        redisFailed = true
        globalThis.__vcardRedisReady = false
        console.warn('[Redis] Unavailable, using in-memory store:', err.message)
      }
    })
  }
  return redisClient
}

const store = {
  async get(key: string): Promise<string | null> {
    // No REDIS_URL configured → use memory directly
    if (!redisUrl || redisFailed) return memStore.get(key) ?? null
    try {
      const val = await getRedis().get(key)
      return val
    } catch {
      redisFailed = true
      globalThis.__vcardRedisReady = false
      return memStore.get(key) ?? null
    }
  },

  async set(key: string, value: string): Promise<string | null> {
    // Always write to memory as backup
    memStore.set(key, value)

    if (!redisUrl || redisFailed) return 'OK'
    try {
      return await getRedis().set(key, value)
    } catch {
      redisFailed = true
      globalThis.__vcardRedisReady = false
      return 'OK' // already saved to memStore above
    }
  },
}

export default store
