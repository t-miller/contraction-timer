// Simple wait script for Maestro
const waitTime = parseInt(WAIT_TIME || '1000', 10);

// Return a promise that resolves after the wait time
// Maestro will wait for this to complete
output.waitTime = waitTime;
