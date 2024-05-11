// Import the concurrentPromise function
const concurrentPromise = require('../lib/index')

// Function to fetch user data by ID (simulated asynchronous operation)
async function fetchUserById(userId) {
    // Simulated asynchronous operation (e.g., querying database)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id: userId, name: `User ${userId} }`});
        }, Math.random() * 1000); // Simulate random processing time
    });
}

// Example usage of concurrentPromise with Promise.all (fetching user data concurrently)
async function fetchUsersWithAll() {
    // Generate an array of user IDs (simulated dataset)
    const userIds = Array.from({ length: 10000 }, (_, index) => index + 1);

    try {
        console.time('test')
        // Fetch user data concurrently using Promise.all
        const users = await concurrentPromise(1000, userIds, fetchUserById);
        console.timeEnd('test')
        console.log('Users:', users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Example usage of concurrentPromise with Promise.allSettled (fetching user data concurrently)
async function fetchUsersWithAllSettled() {
    // Generate an array of user IDs (simulated dataset)
    const userIds = Array.from({ length: 100000 }, (_, index) => index + 1);

    try {
        // Fetch user data concurrently using Promise.allSettled
        const users = await concurrentPromise(10, userIds, fetchUserById, true);
        console.log('Users (allSettled):', users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Example usage
fetchUsersWithAll(); // Fetch users concurrently with Promise.all

//fetchUsersWithAllSettled(); // Fetch users concurrently with Promise.allSettled