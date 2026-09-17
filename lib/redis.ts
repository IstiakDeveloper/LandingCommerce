type RedisLike = {
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<unknown>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, opts?: { ex?: number }): Promise<unknown>;
  del(key: string): Promise<unknown>;
  ping(): Promise<unknown>;
};

const memory = new Map<string, { value: string; expires: number }>();

function memGet(key: string) {
  const hit = memory.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expires) {
    memory.delete(key);
    return null;
  }
  return hit.value;
}

const memoryRedis: RedisLike = {
  async incr(key) {
    const now = Date.now();
    const hit = memory.get(key);
    if (!hit || now > hit.expires) {
      memory.set(key, { value: "1", expires: now + 60_000 });
      return 1;
    }
    const next = Number(hit.value) + 1;
    hit.value = String(next);
    return next;
  },
  async expire(key, seconds) {
    const hit = memory.get(key);
    if (hit) hit.expires = Date.now() + seconds * 1000;
  },
  async get(key) {
    return memGet(key);
  },
  async set(key, value, opts) {
    memory.set(key, {
      value,
      expires: Date.now() + (opts?.ex ?? 60) * 1000,
    });
  },
  async del(key) {
    memory.delete(key);
  },
  async ping() {
    return "PONG";
  },
};

let client: RedisLike | null = null;
let backend: "upstash" | "ioredis" | "memory" = "memory";

async function connect(): Promise<RedisLike> {
  if (client) return client;
  backend = "memory";
  client = memoryRedis;
  return client;
}

export function redisBackend() {
  return backend;
}

export async function redis() {
  return connect();
}

export async function redisPing() {
  try {
    const r = await connect();
    await r.ping();
    return true;
  } catch {
    return false;
  }
}
