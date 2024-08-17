import NodeCache from 'node-cache';

// Initialize cache with a default TTL of 10 minutes
const cache = new NodeCache({ stdTTL: 1000000 });

export function getFromCache(key) {
  return cache.get(key);
}

export function setInCache(key, value, ttl = 1000000) {
  cache.set(key, value, ttl);
}

export function deleteFromCache(key) {
  cache.del(key);
}

export function flushCache() {
  cache.flushAll();
}