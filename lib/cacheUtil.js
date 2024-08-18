import NodeCache from 'node-cache';

// Initialize cache with a default TTL of 10 minutes
const cache = new NodeCache({ stdTTL: 1000000 });

export function getFromCache(key) {
  const value = cache.get(key);
  console.log(`Retrieving cache for key: ${key}`);
  console.log('Retrieved value:', value);
  return value;
}

export function setInCache(key, value, ttl = 1000000) {
  console.log(`Setting cache for key: ${key} with TTL: ${ttl}`);
  console.log('Value being cached:', value);
  cache.set(key, value, ttl);
}

export function deleteFromCache(key) {
  cache.del(key);
}

export function flushCache() {
  cache.flushAll();
}