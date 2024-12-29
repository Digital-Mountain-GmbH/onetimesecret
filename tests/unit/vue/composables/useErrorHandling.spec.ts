// tests/unit/composables/useErrorHandler.spec.ts
import { useErrorHandler } from '@/composables/useErrorHandler';
import { createError } from '@/schemas/errors/factory';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useErrorHandler', () => {
  const mockOptions = {
    notify: vi.fn(),
    log: vi.fn(),
    setLoading: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loading state management', () => {
    it('manages loading state for successful operations', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const mockOperation = vi.fn().mockResolvedValue('success');

      await withErrorHandling(mockOperation);

      expect(mockOptions.setLoading).toHaveBeenCalledTimes(2);
      expect(mockOptions.setLoading).toHaveBeenNthCalledWith(1, true);
      expect(mockOptions.setLoading).toHaveBeenNthCalledWith(2, false);
    });

    it('ensures loading state is cleared after error', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const mockOperation = vi.fn().mockRejectedValue(new Error('fail'));

      await expect(withErrorHandling(mockOperation)).rejects.toThrow();

      expect(mockOptions.setLoading).toHaveBeenCalledTimes(2);
      expect(mockOptions.setLoading).toHaveBeenLastCalledWith(false);
    });
  });

  describe('error classification', () => {
    it('classifies raw errors into ApplicationErrors', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const mockOperation = vi.fn().mockRejectedValue(new Error('raw error'));

      await expect(withErrorHandling(mockOperation)).rejects.toMatchObject({
        message: 'raw error',
        type: 'technical',
        severity: 'error',
      });
    });

    it('preserves existing ApplicationErrors', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const applicationError = createError('known error', 'human', 'warning');
      const mockOperation = vi.fn().mockRejectedValue(applicationError);

      await expect(withErrorHandling(mockOperation)).rejects.toMatchObject({
        message: 'known error',
        type: 'human',
        severity: 'warning',
      });
    });
  });

  describe('user feedback', () => {
    it('notifies only for human errors', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const humanError = createError('user message', 'human', 'warning');
      const mockOperation = vi.fn().mockRejectedValue(humanError);

      await expect(withErrorHandling(mockOperation)).rejects.toThrow();

      expect(mockOptions.notify).toHaveBeenCalledWith('user message', 'warning');
    });

    it('logs but does not notify for technical errors', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const technicalError = createError('system error', 'technical', 'error');
      const mockOperation = vi.fn().mockRejectedValue(technicalError);

      await expect(withErrorHandling(mockOperation)).rejects.toThrow();

      expect(mockOptions.log).toHaveBeenCalled();
      expect(mockOptions.notify).not.toHaveBeenCalled();
    });

    it('handles notification failures gracefully', async () => {
      const notifyError = new Error('notification failed');
      const mockOptions = {
        notify: vi.fn().mockImplementation(() => {
          throw notifyError;
        }),
        log: vi.fn(),
        setLoading: vi.fn(),
      };
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const humanError = createError('user message', 'human', 'warning');
      const mockOperation = vi.fn().mockRejectedValue(humanError);

      await expect(withErrorHandling(mockOperation)).rejects.toThrow(humanError);
      expect(mockOptions.log).toHaveBeenCalledTimes(2); // Original error and notify error
    });
  });

  describe('error classification behavior', () => {
    it('correctly identifies human errors for notification', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const humanErrors = [
        createError('user message 1', 'human', 'warning'),
        createError('user message 2', 'human', 'error'),
        createError('user message 3', 'human', 'info'),
      ];

      for (const error of humanErrors) {
        const mockOperation = vi.fn().mockRejectedValue(error);
        await expect(withErrorHandling(mockOperation)).rejects.toThrow();
        expect(mockOptions.notify).toHaveBeenLastCalledWith(
          error.message,
          error.severity
        );
      }
    });

    it('correctly identifies technical errors for suppressing notifications', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const technicalErrors = [
        createError('system error', 'technical', 'error'),
        new TypeError('type error'),
        new ReferenceError('reference error'),
      ];

      for (const error of technicalErrors) {
        const mockOperation = vi.fn().mockRejectedValue(error);
        await expect(withErrorHandling(mockOperation)).rejects.toThrow();
        expect(mockOptions.notify).not.toHaveBeenCalled();
        vi.clearAllMocks();
      }
    });

    it('handles various non-error throwables consistently', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const throwables = ['string error', 123, { custom: 'error' }, null, undefined];

      for (const throwable of throwables) {
        const mockOperation = vi.fn().mockRejectedValue(throwable);
        await expect(withErrorHandling(mockOperation)).rejects.toMatchObject({
          type: 'technical',
          severity: 'error',
          message: String(throwable),
        });
        expect(mockOptions.notify).not.toHaveBeenCalled();
        vi.clearAllMocks();
      }
    });

    it('preserves error details when classifying ApplicationErrors', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const originalError = createError('known error', 'human', 'warning', {
        code: 'VALIDATION_ERROR',
        field: 'email',
      });
      const mockOperation = vi.fn().mockRejectedValue(originalError);

      await expect(withErrorHandling(mockOperation)).rejects.toMatchObject({
        message: 'known error',
        type: 'human',
        severity: 'warning',
        details: {
          code: 'VALIDATION_ERROR',
          field: 'email',
        },
      });
    });

    it('ensures classified errors maintain instanceof Error', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const mockOperation = vi.fn().mockRejectedValue('string error');

      try {
        await withErrorHandling(mockOperation);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('type');
        expect(error).toHaveProperty('severity');
      }
    });
  });

  describe('error propagation', () => {
    it('preserves stack traces when classifying errors', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const originalError = new Error('original error');
      const mockOperation = vi.fn().mockRejectedValue(originalError);

      try {
        await withErrorHandling(mockOperation);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.stack).toBeDefined();
        expect(error.stack).toContain('original error');
      }
    });

    it('maintains error chain for nested operations', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const innerOp = () => Promise.reject(new Error('inner error'));
      const outerOp = async () => {
        try {
          await withErrorHandling(innerOp);
        } catch (e) {
          throw new Error('outer error', { cause: e });
        }
      };

      await expect(withErrorHandling(outerOp)).rejects.toThrow('outer error');
      expect(mockOptions.log).toHaveBeenCalledTimes(2); // Both errors logged
    });

    it('maintains error context through multiple handling layers', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);

      const level3 = () => Promise.reject(createError('db error', 'technical'));
      const level2 = async () => {
        try {
          await level3();
        } catch (e) {
          throw createError('service error', 'technical', 'error', { cause: e });
        }
      };
      const level1 = async () => {
        try {
          await withErrorHandling(level2);
        } catch (e) {
          throw createError('api error', 'human', 'error', { cause: e });
        }
      };

      await expect(withErrorHandling(level1)).rejects.toMatchObject({
        message: 'api error',
        type: 'human',
        details: {
          cause: expect.objectContaining({
            message: 'service error',
            details: {
              cause: expect.objectContaining({
                message: 'db error',
              }),
            },
          }),
        },
      });
    });
  });

  describe('operation handling', () => {
    it('allows successful operations to pass through unchanged', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const expectedResult = { data: 'success' };
      const mockOperation = vi.fn().mockResolvedValue(expectedResult);

      const result = await withErrorHandling(mockOperation);
      expect(result).toEqual(expectedResult);
    });

    it('handles async operations that return undefined', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const mockOperation = vi.fn().mockResolvedValue(undefined);

      const result = await withErrorHandling(mockOperation);
      expect(result).toBeUndefined();
    });

    it('handles synchronous errors in async operations', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const mockOperation = vi.fn().mockImplementation(() => {
        throw new Error('sync error');
      });

      await expect(withErrorHandling(mockOperation)).rejects.toThrow('sync error');
    });
  });

  describe('optional dependencies', () => {
    it('functions without notification handler', async () => {
      const { withErrorHandling } = useErrorHandler({
        log: mockOptions.log,
        setLoading: mockOptions.setLoading,
      });
      const humanError = createError('user message', 'human', 'warning');
      const mockOperation = vi.fn().mockRejectedValue(humanError);

      await expect(withErrorHandling(mockOperation)).rejects.toThrow();
      // Should not throw due to missing notify handler
    });

    it('functions without logging handler', async () => {
      const { withErrorHandling } = useErrorHandler({
        notify: mockOptions.notify,
        setLoading: mockOptions.setLoading,
      });
      const mockOperation = vi.fn().mockRejectedValue(new Error('test'));

      await expect(withErrorHandling(mockOperation)).rejects.toThrow();
      // Should not throw due to missing log handler
    });

    it('functions without loading state handler', async () => {
      const { withErrorHandling } = useErrorHandler({
        notify: mockOptions.notify,
        log: mockOptions.log,
      });
      const mockOperation = vi.fn().mockResolvedValue('success');

      await withErrorHandling(mockOperation);
      // Should not throw due to missing setLoading handler
    });
  });

  describe('API operation scenarios', () => {
    it('handles API timeout errors appropriately', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      const mockApiCall = vi.fn().mockRejectedValue(timeoutError);

      await expect(withErrorHandling(mockApiCall)).rejects.toMatchObject({
        type: 'technical',
        severity: 'error',
        message: 'Request timeout',
      });
      expect(mockOptions.notify).not.toHaveBeenCalled();
    });

    it('handles API validation errors as human errors', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const validationError = createError('Invalid email format', 'human', 'warning', {
        field: 'email',
      });
      const mockApiCall = vi.fn().mockRejectedValue(validationError);

      await expect(withErrorHandling(mockApiCall)).rejects.toMatchObject({
        type: 'human',
        severity: 'warning',
        details: { field: 'email' },
      });
      expect(mockOptions.notify).toHaveBeenCalledWith('Invalid email format', 'warning');
    });

    it('manages loading state through entire API call duration', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      let isLoadingDuringCall = false;

      const mockApiCall = vi.fn().mockImplementation(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        isLoadingDuringCall = mockOptions.setLoading.mock.calls[0][0];
        return 'success';
      });

      await withErrorHandling(mockApiCall);

      expect(isLoadingDuringCall).toBe(true);
      expect(mockOptions.setLoading).toHaveBeenLastCalledWith(false);
    });
  });

  describe('API error notification strategies', () => {
    it('notifies users of recoverable API errors', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const recoverableErrors = [
        createError('Your session has expired, please login again', 'human', 'warning'),
        createError('This file is too large, max size is 5MB', 'human', 'warning'),
        createError('This secret has already been viewed', 'human', 'info'),
      ];

      for (const error of recoverableErrors) {
        const mockApiCall = vi.fn().mockRejectedValue(error);
        await expect(withErrorHandling(mockApiCall)).rejects.toThrow();
        expect(mockOptions.notify).toHaveBeenLastCalledWith(
          error.message,
          error.severity
        );
        vi.clearAllMocks();
      }
    });

    it('suppresses notifications for network/infrastructure errors', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const technicalErrors = [
        new TypeError('Failed to fetch'), // Browser network error
        createError('ECONNREFUSED', 'technical'), // Server connection refused
        createError('Request timed out', 'technical'), // Timeout
        new Error('Network error'), // Generic network error
      ];

      for (const error of technicalErrors) {
        const mockApiCall = vi.fn().mockRejectedValue(error);
        await expect(withErrorHandling(mockApiCall)).rejects.toThrow();
        expect(mockOptions.notify).not.toHaveBeenCalled();
        expect(mockOptions.log).toHaveBeenCalled();
        vi.clearAllMocks();
      }
    });

    it('handles API rate limiting as a human error', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const rateLimitError = createError(
        'Too many requests, please try again in 5 minutes',
        'human',
        'warning',
        { retryAfter: 300 }
      );
      const mockApiCall = vi.fn().mockRejectedValue(rateLimitError);

      await expect(withErrorHandling(mockApiCall)).rejects.toMatchObject({
        type: 'human',
        details: { retryAfter: 300 },
      });
      expect(mockOptions.notify).toHaveBeenCalledWith(rateLimitError.message, 'warning');
    });
  });

  describe('loading state management during API calls', () => {
    it('handles rapid successive API calls correctly', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const mockApiCall1 = vi
        .fn()
        .mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 50)));
      const mockApiCall2 = vi
        .fn()
        .mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 30)));

      // Start both calls almost simultaneously
      const call1 = withErrorHandling(mockApiCall1);
      const call2 = withErrorHandling(mockApiCall2);

      await Promise.all([call1, call2]);

      // Loading should stay true until both calls complete
      const loadingCalls = mockOptions.setLoading.mock.calls;
      expect(loadingCalls).toEqual([
        [true], // First call starts
        [true], // Second call starts
        [false], // Second call ends
        [false], // First call ends
      ]);
    });

    it('maintains loading state during retries', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      let attempts = 0;
      const mockApiCall = vi.fn().mockImplementation(async () => {
        attempts++;
        if (attempts === 1) {
          // Need to create a proper ApplicationError
          throw createError('First attempt failed', 'technical');
        }
        return 'success';
      });

      const result = await withErrorHandling(async () => {
        try {
          return await mockApiCall();
        } catch (error) {
          // Retry once
          return await mockApiCall();
        }
      });

      expect(result).toBe('success');
      expect(attempts).toBe(2);
      expect(mockOptions.setLoading).toHaveBeenCalledTimes(2);
      expect(mockOptions.setLoading).toHaveBeenNthCalledWith(1, true);
      expect(mockOptions.setLoading).toHaveBeenNthCalledWith(2, false);
    });

    it('properly resets loading state after unexpected promise behavior', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const mockApiCall = vi.fn().mockImplementation(() => {
        // This creates an invalid async operation
        return Promise.reject(createError('Invalid operation', 'technical'));
      });

      await expect(withErrorHandling(mockApiCall)).rejects.toMatchObject({
        message: 'Invalid operation',
        type: 'technical',
      });

      expect(mockOptions.setLoading).toHaveBeenCalledTimes(2);
      expect(mockOptions.setLoading).toHaveBeenNthCalledWith(1, true);
      expect(mockOptions.setLoading).toHaveBeenNthCalledWith(2, false);
    });

    it('handles cancellation of API calls gracefully', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const abortController = new AbortController();
      const mockApiCall = vi.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
          abortController.signal.addEventListener('abort', () => {
            reject(new Error('Request aborted'));
          });
        });
      });

      const apiPromise = withErrorHandling(mockApiCall);
      abortController.abort();

      await expect(apiPromise).rejects.toThrow('Request aborted');
      expect(mockOptions.setLoading).toHaveBeenLastCalledWith(false);
    });

    // Add to "loading state management during API calls" describe block
    it('handles overlapping async operations correctly', async () => {
      const { withErrorHandling } = useErrorHandler(mockOptions);
      const slowOp = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve('slow'), 50))
        );
      const fastOp = vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(() => resolve('fast'), 20))
        );

      const results = await Promise.all([
        withErrorHandling(slowOp),
        withErrorHandling(fastOp),
      ]);

      expect(results).toEqual(['slow', 'fast']);
      const loadingCalls = mockOptions.setLoading.mock.calls;
      expect(loadingCalls[0]).toEqual([true]); // First operation starts
      expect(loadingCalls[loadingCalls.length - 1]).toEqual([false]); // Last operation ends
    });
  });
});
