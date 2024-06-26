# Concurrent Promise Batcher

Concurrent Promise Batcher is a Node.js utility for executing asynchronous tasks concurrently in batches, providing better control over resource usage and improved performance. This package allows you to fetch data concurrently for multiple batches while managing the maximum number of concurrent promises being executed.

## Installation

```bash
npm install @imrandil/concurrent-promise-batcher
```

## Usage

```javascript
const concurrentPromise = require('@imrandil/concurrent-promise-batcher');

// Define a function to execute for each item in the batch
async function fetchData(item) {
    // Perform asynchronous operation (e.g., fetching data from an API)
    // Return a Promise
}

// Define your batches
const batches = [/* Array of items representing each batch */];

// Set the maximum number of concurrent promises to execute
const batchConcurrency = 5;

// Execute promises concurrently for batches
concurrentPromise(batchConcurrency, batches, fetchData)
    .then((result) => {
        console.log('Results:', result.results);
        console.log('Execution Time:', result.executionTime);
        console.log('Number of Batches Processed:', result.numBatchesProcessed);
        console.log('Average Execution Time per Batch:', result.avgExecutionTimePerBatch);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });
```

### One of the use cases ->

```javascript
const concurrentPromise = require('@imrandil/concurrent-promise-batcher');

// Function to fetch data from an API
async function fetchDataFromAPI(url) {
    const response = await fetch(url);
    return response.json();
}

// Array of API endpoints
const apiEndpoints = [
    'https://hotels4.p.rapidapi.com/v2/get-meta-data',
    'https://api.publicapis.org/entries',
    'https://api.coindesk.com/v1/bpi/currentprice.json',
    'https://www.boredapi.com/api/activity',
    'https://dog.ceo/api/breeds/image/random'
];

// Define the maximum concurrency level
const maxConcurrency = 3; // For example, fetching data from 3 APIs concurrently

// Fetch data concurrently from multiple APIs
concurrentPromise(maxConcurrency, apiEndpoints, fetchDataFromAPI, true)
    .then(({ results, executionTime, numBatchesProcessed, avgExecutionTimePerBatch }) => {
        console.log('Results:', results);
        console.log('Execution time:', executionTime);
        console.log('Number of batches processed:', numBatchesProcessed);
        console.log('Average execution time per batch:', avgExecutionTimePerBatch);
    })
    .catch(error => {
        console.error('Error:', error);
    });

```

## Parameters

- `batchConcurrency`: The maximum number of concurrent promises to execute. Must be a positive integer.
- `batches`: An array of items representing each batch. Must be a non-empty array.
- `fn`: The function to execute concurrently for each batch item. Must be a function.
- `settled`: Whether to use `Promise.allSettled` or `Promise.all`. Default is `false` (`Promise.all`).

## Examples

- Fetching data from multiple APIs concurrently.
- Processing multiple files concurrently.
- Bulk operations on a database concurrently.

## Using `Promise.all` vs `Promise.allSettled`

By default, `concurrentPromise` uses `Promise.all` to await the fulfillment of all promises in each batch. This means that if any promise rejects (encounters an error), the entire batch will fail and the rejection will be propagated to the caller.

If you want to handle individual promise rejections separately or continue processing even if some promises fail, you can set the `settled` parameter to `true`. This will make `concurrentPromise` use `Promise.allSettled` instead. With `Promise.allSettled`, the returned promise will fulfill with an array of objects representing the status of each promise, whether fulfilled or rejected.

## License

[MIT](https://opensource.org/licenses/MIT)
