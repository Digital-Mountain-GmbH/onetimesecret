// src/stores/csrfStore.ts
import { PiniaPluginOptions } from '@/plugins/pinia';
import { responseSchemas } from '@/schemas/api/responses';
import { AxiosInstance } from 'axios';
import { defineStore, PiniaCustomProperties } from 'pinia';
import { handleError, inject, ref } from 'vue';

interface StoreOptions extends PiniaPluginOptions {
  shrimp?: string;
}

/**
 * Store for managing CSRF token (shrimp) state and validation.
 *
 * Key concepts:
 * - Token validity is determined by server validation, not just presence
 * - Server returns both validity status and optionally a new token
 * - Periodic validation ensures token stays valid during session
 *
 * @example
 * import { useCsrfStore } from '@/stores/csrfStore';
 *
 * const csrfStore = useCsrfStore();
 *
 * // Start periodic validation
 * csrfStore.startPeriodicCheck(60000); // Check every minute
 *
 * // Stop validation when no longer needed
 * csrfStore.stopPeriodicCheck();
 *
 * // Update token (typically handled by API interceptors)
 * csrfStore.updateShrimp(newToken);
 *
 * // Check if token is valid according to server
 * if (csrfStore.isValid) {
 *   // Proceed with protected action
 * } else {
 *   // Handle invalid token scenario
 * }
 */

/**
 * Type definition for CsrfStore.
 */
export type CsrfStore = {
  // State
  shrimp: string;
  isValid: boolean;
  intervalChecker: number | null;
  _initialized: boolean;

  // Actions
  init: () => void;
  updateShrimp: (newShrimp: string) => void;
  checkShrimpValidity: () => Promise<void>;
  startPeriodicCheck: (intervalMs?: number) => void;
  stopPeriodicCheck: () => void;
  $reset: () => void;
} & PiniaCustomProperties;

/* eslint-disable max-lines-per-function */
export const useCsrfStore = defineStore('csrf', () => {
  const $api = inject('api') as AxiosInstance;

  // State
  const shrimp = ref('');
  const isValid = ref(false);
  const intervalChecker = ref<number | null>(null);
  const _initialized = ref(false);

  function init(options?: StoreOptions) {
    if (_initialized.value) return;
    shrimp.value = options?.shrimp || window.shrimp || '';
    _initialized.value = true;
    return _initialized;
  }

  function updateShrimp(newShrimp: string) {
    shrimp.value = newShrimp;
  }

  async function checkShrimpValidity() {
    const response = await $api.post('/api/v2/validate-shrimp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'O-Shrimp': shrimp.value,
      },
    });

    const validated = responseSchemas.csrf.parse(response.data);
    isValid.value = validated.isValid;
    if (validated.isValid) {
      updateShrimp(validated.shrimp);
    }
    return validated;
  }

  function startPeriodicCheck(intervalMs: number = 60000) {
    stopPeriodicCheck();
    intervalChecker.value = window.setInterval(() => {
      checkShrimpValidity();
    }, intervalMs);
  }

  function stopPeriodicCheck() {
    if (intervalChecker.value !== null) {
      clearInterval(intervalChecker.value);
      intervalChecker.value = null;
    }
  }

  /**
   * Resets store to initial state, including re-reading window.shrimp.
   * We preserve window.shrimp behavior to maintain consistency with store
   * initialization and ensure predictable reset behavior across the app.
   */
  function $reset() {
    shrimp.value = window.shrimp || ''; // back to how it all began
    isValid.value = false;
    _initialized.value = false;
    stopPeriodicCheck();
  }

  return {
    // State
    shrimp,
    isValid,
    intervalChecker,

    // Actions
    init,
    handleError,
    updateShrimp,
    checkShrimpValidity,
    startPeriodicCheck,
    stopPeriodicCheck,
    $reset,
  };
});
