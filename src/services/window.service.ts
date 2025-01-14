// src/services/window.service.ts
import type { OnetimeWindow } from '@/types/declarations/window';

/**
 * Service for accessing typed window properties defined in window.d.ts.
 * Provides type-safe access to server-injected window properties with
 * optional default values.
 *
 * Can safely be used prior to full store hydration.
 *
 */
export const WindowService = {
  /**
   * Retrieves a single window property with type inference.
   * @param key - Property name defined in OnetimeWindow interface
   * @returns The typed window property value
   */
  get<K extends keyof OnetimeWindow>(key: K): OnetimeWindow[K] {
    if (!window.__ONETIME_STATE__) {
      throw `Window.__ONETIME_STATE__ is not set (${key})`;
    }
    return (window.__ONETIME_STATE__ as OnetimeWindow)[key];
  },

  /**
   * Retrieves multiple window properties with flexible input patterns.
   * Supports both default value objects and property name arrays.
   *
   * @example
   * // With defaults
   * const props = WindowService.getMultiple({
   *   authenticated: false,
   *   ot_version: ''
   * });
   *
   * @example
   * // Without defaults
   * const { regions_enabled, regions } = WindowService.getMultiple([
   *   'regions_enabled',
   *   'regions'
   * ]);
   *
   * @param input - Either an array of property names or an object with default values
   * @returns Object containing requested window properties with proper typing
   */
  getMultiple<K extends keyof OnetimeWindow>(
    input: K[] | Partial<Record<K, OnetimeWindow[K]>>
  ): Pick<OnetimeWindow, K> {
    if (Array.isArray(input)) {
      return Object.fromEntries(input.map((key) => [key, this.get(key)])) as Pick<
        OnetimeWindow,
        K
      >;
    }

    return Object.fromEntries(
      Object.entries(input).map(([key, defaultValue]) => [
        key,
        this.get(key as K) ?? defaultValue,
      ])
    ) as Pick<OnetimeWindow, K>;
  },
};