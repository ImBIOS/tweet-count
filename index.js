// A social media company is trying to monitor activity on their site by analyzing the number of tweets that occur in select periods of time. These periods can be partitioned into smaller time chunks based on a certain frequency (every minute, hour, or day).

// For example, the period [10, 10000] (in seconds) would be partitioned into the following time chunks with these frequencies:

// Every minute (60-second chunks): [10,69], [70,129], [130,189], ..., [9970,10000]
// Every hour (3600-second chunks): [10,3609], [3610,7209], [7210,10000]
// Every day (86400-second chunks): [10,10000]
// Notice that the last chunk may be shorter than the specified frequency's chunk size and will always end with the end time of the period (10000 in the above example).

// Design and implement an API to help the company with their analysis.

// Implement the TweetCounts class:

// TweetCounts() Initializes the TweetCounts object.

// void recordTweet(string tweetName, int time) Stores the tweetName at the recorded time (in seconds).

// Array<Integer> getTweetCountsPerFrequency(string freq, string tweetName, int startTime, int endTime) Returns a list of integers representing the number of tweets with tweetName in each time chunk for the given period of time [startTime, endTime] (in seconds) and frequency freq.

// freq is one of "minute", "hour", or "day" representing a frequency of every minute, hour, or day respectively.

// Example

// Explanation
// TweetCounts tweetCounts = new TweetCounts();
// tweetCounts.recordTweet("tweet3", 0);                              // New tweet "tweet3" at time 0
// tweetCounts.recordTweet("tweet3", 60);                             // New tweet "tweet3" at time 60
// tweetCounts.recordTweet("tweet3", 10);                             // New tweet "tweet3" at time 10
// tweetCounts.getTweetCountsPerFrequency("minute", "tweet3", 0, 59); // return [2]; chunk [0,59] had 2 tweets
// tweetCounts.getTweetCountsPerFrequency("minute", "tweet3", 0, 60); // return [2,1]; chunk [0,59] had 2 tweets, chunk [60,60] had 1 tweet
// tweetCounts.recordTweet("tweet3", 120);                            // New tweet "tweet3" at time 120
// tweetCounts.getTweetCountsPerFrequency("hour", "tweet3", 0, 210);  // return [4]; chunk [0,210] had 4 tweets

// global variable initialization
let times;
let chunk;

const TweetCounts = function () {
  // create all maps for time
  day = new Map();
  minute = new Map();
  hour = new Map();
  times = { day, minute, hour };

  // chunk to make it easier to call the required
  // time value and can be reused
  chunk = {
    day: 86400,
    hour: 3600,
    minute: 60,
  };
};

/**
 * @param {string} tweetName
 * @param {number} time
 * @return {void}
 */
TweetCounts.prototype.recordTweet = function (tweetName, time) {
  // addTweet calls for minutes, hours and days
  addTweet(tweetName, time, times.minute);
  addTweet(tweetName, time, times.hour);
  addTweet(tweetName, time, times.day);
};

// function to add tweet and time into an initialized variable
const addTweet = function (tweetName, time, map) {
  const tweetAtTime = map.get(time);
  if (tweetAtTime !== undefined) {
    tweetAtTime.push({ tweetName, time });
  } else {
    map.set(time, [{ tweetName, time }]);
  }
};

/**
 * @param {string} freq
 * @param {string} tweetName
 * @param {number} startTime
 * @param {number} endTime
 * @return {number}
 */
TweetCounts.prototype.getTweetCountsPerFrequency = function (
  freq,
  tweetName,
  startTime,
  endTime
) {
  let frequency = [];
  // magic happens here
  // the interval is calculated to determine
  // the tweet frequency between interval
  while (startTime <= endTime) {
    let count = 0;
    const endInterval = startTime + chunk[freq] - 1;
    const tweetTimes = times[freq];

    for (let key of tweetTimes.keys()) {
      if (key < startTime || key > endInterval) {
        continue;
      }

      const tweets = tweetTimes.get(key);

      tweets.forEach((tweet) => {
        if (tweet.tweetName === tweetName) {
          count++;
        }
      });
    }

    frequency.push(count);
    startTime = endInterval >= endTime ? endTime + 1 : endInterval + 1;
  }
  return frequency;
};

/**
 * Your TweetCounts object will be instantiated and called as such:
 * var obj = new TweetCounts()
 * obj.recordTweet(tweetName,time)
 * var param_2 = obj.getTweetCountsPerFrequency(freq,tweetName,startTime,endTime)
 */