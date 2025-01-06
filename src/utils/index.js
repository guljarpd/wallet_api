/**
 * Generate unique transaction id
 * generateTransactionId() is faster and it ensures uniqueness as well.
 * @returns 
 */
const generateTransactionId = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000); // Random number between 0 and 999,999
    return `${timestamp}${randomNum}`;
}

module.exports = {
    generateTransactionId,
}
  