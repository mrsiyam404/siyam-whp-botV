/**
 * Author: 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
 */

async function retry(task, attempts = 3, delay = 1500) {
  let lastError;

  for (let i = 0; i < attempts; i++) {
    try {
      return await task();
    } catch (error) {
      lastError = error;

      if (i < attempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

module.exports = { retry };
