export const MAX_MESSAGE_LENGTH = 2000;

// Maximum AI requests allowed per user
// within one rolling minute.
export const REQUESTS_PER_MINUTE_PER_USER = 2;

// Maximum successful AI requests allowed
// per user per UTC calendar day.
export const MESSAGES_PER_DAY_PER_USER = 10;

// Maximum successful AI requests allowed
// globally per UTC calendar day.
export const GLOBAL_AI_REQUESTS_PER_DAY = 100;

const userMinuteUsage = new Map();
const userDailyUsage = new Map();

let globalDailyUsage = {
  date: null,
  count: 0,
};

//---->>> GET UTC DATE KEY

const getDateKey = () => {
  return new Date().toISOString().slice(0, 10);
};

//--->>> USER MINUTE LIMIT

export const checkUserMinuteLimit = (userId) => {
  const now = Date.now();

  const existing = userMinuteUsage.get(userId);

  if (!existing) {
    return {
      allowed: true,
      count: 0,
    };
  }

  //--->>>> Reset after 60 seconds.
  if (now - existing.windowStart >= 60 * 1000) {
    userMinuteUsage.delete(userId);

    return {
      allowed: true,
      count: 0,
    };
  }

  if (existing.count >= REQUESTS_PER_MINUTE_PER_USER) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((60 * 1000 - (now - existing.windowStart)) / 1000),
    );

    return {
      allowed: false,
      count: existing.count,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    count: existing.count,
  };
};

//--->>> USER DAILY LIMIT

export const checkUserDailyLimit = (userId) => {
  const today = getDateKey();

  const existing = userDailyUsage.get(userId);

  if (!existing || existing.date !== today) {
    return {
      allowed: true,
      count: 0,
    };
  }

  if (existing.count >= MESSAGES_PER_DAY_PER_USER) {
    return {
      allowed: false,
      count: existing.count,
    };
  }

  return {
    allowed: true,
    count: existing.count,
  };
};

//---->>> GLOBAL DAILY LIMIT

export const checkGlobalDailyLimit = () => {
  const today = getDateKey();

  if (globalDailyUsage.date !== today) {
    globalDailyUsage = {
      date: today,
      count: 0,
    };
  }

  if (globalDailyUsage.count >= GLOBAL_AI_REQUESTS_PER_DAY) {
    return {
      allowed: false,
      count: globalDailyUsage.count,
    };
  }

  return {
    allowed: true,
    count: globalDailyUsage.count,
  };
};

//--->>> RECORD SUCCESSFUL AI REQUEST

export const recordSuccessfulAiRequest = (userId) => {
  const now = Date.now();
  const today = getDateKey();

  const minuteUsage = userMinuteUsage.get(userId);

  if (!minuteUsage || now - minuteUsage.windowStart >= 60 * 1000) {
    userMinuteUsage.set(userId, {
      windowStart: now,
      count: 1,
    });
  } else {
    minuteUsage.count += 1;
  }

  const dailyUsage = userDailyUsage.get(userId);

  if (!dailyUsage || dailyUsage.date !== today) {
    userDailyUsage.set(userId, {
      date: today,
      count: 1,
    });
  } else {
    dailyUsage.count += 1;
  }

  if (globalDailyUsage.date !== today) {
    globalDailyUsage = {
      date: today,
      count: 1,
    };
  } else {
    globalDailyUsage.count += 1;
  }
};
