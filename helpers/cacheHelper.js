import NodeCache from 'node-cache';

const myCache = new NodeCache();

export const setCache = (key, value) => {
  myCache.set(key, value);
};

export const getCache = (key) => {
  return myCache.get(key);
};

export const isCacheValid = (cacheDate) => {
    if (!cacheDate) return false;
  
    const today = new Date();
  
    const todayHours = today.getUTCHours();
    const todayMinutes = today.getUTCMinutes();
    const cacheHours = cacheDate.getUTCHours();
    const cacheMinutes = cacheDate.getUTCMinutes();
  
    const isTodayWeekend = today.getDay() === 6 || today.getDay() === 0; // Saturday (6) or Sunday (0)
    const isCacheWeekend = cacheDate.getDay() === 6 || cacheDate.getDay() === 0;
  
    // UTC 10:30 is EST 5:30
    const isCachePast1030PM = cacheHours > 22 || (cacheHours === 22 && cacheMinutes > 30);
    const isTodayPast1030PM = todayHours > 22 || (todayHours === 22 && todayMinutes > 30);
  
    // Compare cache and today dates
    const isSameDate = today.getUTCDate() === cacheDate.getUTCDate() && today.getUTCMonth() === cacheDate.getUTCMonth();
  
    // 1 day in milliseconds
    const isWithinOneDay = today - cacheDate <= 86400000;
    const isSaturdayWithValidCache = isCacheWeekend && cacheDate.getDay() === 6 && isWithinOneDay;
  
    // Valid cache checks
    // Cache is from Friday after 5:30pm EST, and today is a weekend
    if (isTodayWeekend && cacheDate.getDay() === 5 && isCachePast1030PM) {
      return true;
    }
  
    // Cache and today are both on the same day and it's a weekend
    if (isTodayWeekend && isSameDate) {
      return true;
    }
  
    // Cache is from Saturday, today is Sunday, and the cache is less than 2 days old.
    if (isTodayWeekend && isSaturdayWithValidCache) {
      return true;
    }
  
    // Cache is from today, and it's past 5:30 PM EST.
    if (isSameDate && isCachePast1030PM) {
      return true;
    }
  
    // Cache is from today, and it's not yet past 5:30 PM EST for either cache or current time.
    if (isSameDate && !isCachePast1030PM && !isTodayPast1030PM) {
      return true;
    }
  
    // Cache is from yesterday after 5:30 PM EST but right now it's before 5:30pm EST
    if (isWithinOneDay && isCachePast1030PM && !isTodayPast1030PM) {
      return true;
    }
  
    return false;
  };
  
export default myCache;
