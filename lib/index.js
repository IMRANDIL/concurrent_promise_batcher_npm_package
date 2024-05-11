/**
 * Fetches data concurrently for multiple batches.
 * @param batchConcurrency The maximum number of concurrent promises to execute. Must be a positive integer.
 * @param batches An array of items representing each batch. Must be a non-empty array.
 * @param fn The function to execute concurrently for each batch item. Must be a function.
 * @param settled Whether to use Promise.allSettled or Promise.all. Default is false (Promise.all).
 * @returns A promise that resolves to an object containing the results of all promises, execution time, number of batches processed, and average execution time per batch.
 */
async function concurrentPromise(batchConcurrency, batches, fn, settled = false) {
    // Validate batchConcurrency
    if (!Number.isInteger(batchConcurrency) || batchConcurrency <= 0) {
        throw new Error('batchConcurrency must be a positive integer.');
    }

    // Validate batches
    if (!Array.isArray(batches) || batches.length === 0) {
        throw new Error('batches must be a non-empty array.');
    }

    // Validate fn
    if (typeof fn !== 'function') {
        throw new Error('fn must be a function.');
    }

    const results = [];
    let currentIndex = 0;
    const startTime = Date.now();
    let numBatchesProcessed = 0;
    let totalBatchExecutionTime = 0;

    // Execute promises concurrently in batches
    while (currentIndex < batches.length) {
        const concurrentPromises = [];
        
        // Create promises for the current batch
        for (let i = currentIndex; i < Math.min(currentIndex + batchConcurrency, batches.length); i++) {
            concurrentPromises.push(fn(batches[i]));
        }
        
        // Wait for all promises in the batch to settle
        const batchStartTime = Date.now();
        const batchResults = settled ? await Promise.allSettled(concurrentPromises) : await Promise.all(concurrentPromises);
        const batchExecutionTime = Date.now() - batchStartTime;
        
        // Add batch results to the overall results array
        results.push(...batchResults);

        // Update statistics
        numBatchesProcessed++;
        totalBatchExecutionTime += batchExecutionTime;
        
        // Move to the next batch
        currentIndex += batchConcurrency;
    }

    // Calculate the overall execution time
    const executionTime = `${Date.now() - startTime} ms`;

    // Calculate the average execution time per batch
    const avgExecutionTimePerBatch = `${totalBatchExecutionTime / numBatchesProcessed} ms`;

    // Return the overall results, execution time, number of batches processed, and average execution time per batch
    return { results, executionTime, numBatchesProcessed, avgExecutionTimePerBatch };
}


module.exports = concurrentPromise;
