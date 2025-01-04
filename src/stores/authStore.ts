// stores/authStore.ts
import { responseSchemas } from '@/schemas/api';
import { WindowService } from '@/services/window.service';
import { defineStore, PiniaCustomProperties } from 'pinia';
import { computed, ref } from 'vue';

/**
 * Configuration for authentication check behavior.
 *
 * The timing strategy uses two mechanisms:
 * 1. Base interval (15 minutes) for regular checks
 * 2. Random jitter (±90 seconds) to prevent synchronized client requests
 *    across multiple browser sessions, reducing server load spikes
 *
 * Note: Exponential backoff was intentionally removed in favor of a simpler
 * "3 strikes" model because:
 * 1. Immediate logout after 3 failures provides clearer UX
 * 2. The 15-minute base interval already provides adequate spacing
 * 3. Backoff could mask serious issues by waiting longer between retries
 */
export const AUTH_CHECK_CONFIG = {
  INTERVAL: 15 * 60 * 1000,
  JITTER: 90 * 1000,
  MAX_FAILURES: 3,
  ENDPOINT: '/api/v2/authcheck',
} as const;

/**
 * Type definition for AuthStore.
 */
export type AuthStore = {
  // State
  isLoading: boolean;
  isAuthenticated: boolean | null;
  authCheckTimer: ReturnType<typeof setTimeout> | null;
  failureCount: number | null;
  lastCheckTime: number | null;
  _initialized: boolean;

  // Getters
  needsCheck: boolean;
  isInitialized: boolean;

  // Actions
  init: () => { needsCheck: boolean; isInitialized: boolean };
  checkAuthStatus: () => Promise<boolean>;
  refreshAuthState: () => Promise<boolean>;
  logout: () => Promise<void>;
  $scheduleNextCheck: () => void;
  $stopAuthCheck: () => Promise<void>;
  $dispose: () => Promise<void>;
  $reset: () => void;
  //$logout: () => void;
} & PiniaCustomProperties;

/**
 * Authentication store for managing user authentication state.
 * Uses Pinia for state management, providing reactive auth state
 * that can be observed using storeToRefs:
 *
 * @example
 * ```ts
 * import { useAuthStore } from '@/stores/authStore'
 * import { storeToRefs } from 'pinia'
 *
 * const authStore = useAuthStore()
 * const { isAuthenticated } = storeToRefs(authStore)
 *
 * // React to auth state changes
 * watch(isAuthenticated, (newValue) => {
 *   console.log('Auth state changed:', newValue)
 * })
 * ```
 */
/* eslint-disable max-lines-per-function */
export const useAuthStore = defineStore('auth', () => {
  // State
  const isLoading = ref(false);
  const isAuthenticated = ref<boolean | null>(null);
  const authCheckTimer = ref<ReturnType<typeof setTimeout> | null>(null);
  const failureCount = ref<number | null>(null);
  const lastCheckTime = ref<number | null>(null);
  const _initialized = ref(false);

  // Getters
  const needsCheck = computed((): boolean => {
    /**
     * Determines if the last auth check is older than the check interval.
     * Used to decide whether to perform a fresh check when a tab becomes visible.
     */
    if (!lastCheckTime.value) return true;
    return Date.now() - lastCheckTime.value > AUTH_CHECK_CONFIG.INTERVAL;
  });

  const isInitialized = computed(() => _initialized.value);

  // Actions
  function init(this: AuthStore) {
    if (_initialized.value) return { needsCheck, isInitialized };

    isAuthenticated.value = WindowService.get('authenticated', false) ?? null;

    if (isAuthenticated.value) {
      this.$scheduleNextCheck();
    }

    _initialized.value = true;
    return { needsCheck, isInitialized };
  }

  /**
   * Checks the current authentication status with the server.
   *
   * @description
   * This method implements a robust authentication check mechanism:
   * 1. Validates current auth state with server
   * 2. Updates local and window state
   * 3. Manages failure counting
   *
   * Key behaviors:
   * - Automatic logout after MAX_FAILURES consecutive failures
   * - Resets failure counter on successful check
   * - Maintains sync between local and window state
   *
   * @returns Current authentication state
   */
  async function checkAuthStatus(this: AuthStore) {
    if (!isAuthenticated.value) return false;

    return await this.$asyncHandler
      .wrap(async () => {
        const response = await this.$api.get(AUTH_CHECK_CONFIG.ENDPOINT);
        const validated = responseSchemas.checkAuth.parse(response.data);

        isAuthenticated.value = validated.details.authenticated;
        failureCount.value = 0;
        lastCheckTime.value = Date.now();

        return isAuthenticated.value;
      })
      .catch(() => {
        failureCount.value = (failureCount.value ?? 0) + 1;
        if (failureCount.value >= AUTH_CHECK_CONFIG.MAX_FAILURES) {
          this.logout();
        }
        return false;
      });
  }

  /**
   * Forces an immediate auth check and reschedules next check.
   * Useful when the application needs to ensure fresh auth state.
   */
  async function refreshAuthState(this: AuthStore) {
    return this.checkAuthStatus().then(() => {
      this.$scheduleNextCheck();
    });
  }

  /**
   * Schedules the next authentication check with a randomized interval.
   *
   * The random jitter added to the base interval helps prevent
   * synchronized requests from multiple clients hitting the server
   * at the same time, which could cause load spikes.
   *
   * The jitter is ±90 seconds, providing a good balance between
   * regular checks and load distribution.
   */
  function $scheduleNextCheck(this: AuthStore) {
    this.$stopAuthCheck();

    if (!isAuthenticated.value) return;

    const jitter = (Math.random() - 0.5) * 2 * AUTH_CHECK_CONFIG.JITTER;
    const nextCheck = AUTH_CHECK_CONFIG.INTERVAL + jitter;

    authCheckTimer.value = setTimeout(async () => {
      await this.checkAuthStatus(); // Make sure to await this
      this.$scheduleNextCheck(); // Schedule next check after current one completes
    }, nextCheck);
  }

  /**
   * Stops the periodic authentication check.
   * Clears the existing timeout and resets the authCheckTimer.
   */
  async function $stopAuthCheck(this: AuthStore) {
    if (authCheckTimer.value !== null) {
      clearTimeout(authCheckTimer.value);
      authCheckTimer.value = null;
    }
  }

  /**
   * Logs out the current user and resets the auth state.
   * Uses the global $logout plugin which handles:
   * - Clearing cookies
   * - Resetting all related stores
   * - Clearing session storage
   * - Updating window state
   */
  async function logout(this: AuthStore) {
    await this.$stopAuthCheck();
    this.$logout();
  }
  /**
   * Disposes of the store, stopping the auth check.
   *
   * - Disposing of a store does not reset its state. If you recreate the store,
   *   it will start with its initial state as defined in the store definition.
   * - Once a store is disposed of, it should not be used again.
   *
   */
  async function $dispose(this: AuthStore) {
    await this.$stopAuthCheck();
  }

  function $reset(this: AuthStore) {
    isLoading.value = false;
    isAuthenticated.value = null;
    authCheckTimer.value = null;
    failureCount.value = null;
    lastCheckTime.value = null;
    _initialized.value = false;
  }

  return {
    // State
    isLoading,
    isAuthenticated,
    authCheckTimer,
    failureCount,
    lastCheckTime,
    _initialized,

    // Getters
    needsCheck,
    isInitialized,

    // Actions
    init,
    checkAuthStatus,
    refreshAuthState,
    logout,

    $scheduleNextCheck,
    $stopAuthCheck,
    $dispose,
    $reset,
  };
});
