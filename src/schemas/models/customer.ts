import { createModelSchema } from '@/schemas/models/base';
import { transforms } from '@/schemas/transforms';
import { withFeatureFlags } from '@/schemas/utils/feature_flags';
import { z } from 'zod';

/**
 * @fileoverview Customer schema with simplified type boundaries
 *
 * Key improvements:
 * 1. Unified transformation layer using base transforms
 * 2. Clearer type flow from API to frontend
 * 3. Simplified schema structure
 */

// Role enum matching Ruby model
export const CustomerRole = {
  CUSTOMER: 'customer',
  COLONEL: 'colonel',
  RECIPIENT: 'recipient',
  USER_DELETED_SELF: 'user_deleted_self',
} as const;

/**
 * Plan options schema matching Ruby model
 */
export const planOptionsSchema = z.object({
  ttl: transforms.fromString.number,
  size: transforms.fromString.number,
  api: transforms.fromString.boolean,
  name: z.string(),
  email: transforms.fromString.boolean.optional(),
  custom_domains: transforms.fromString.boolean.optional(),
  dark_mode: transforms.fromString.boolean.optional(),
  cname: transforms.fromString.boolean.optional(),
  private: transforms.fromString.boolean.optional(),
});

export type PlanOptions = z.infer<typeof planOptionsSchema>;

/**
 * Plan schema for customer plans
 */
export const planSchema = z.object({
  identifier: z.string(),
  planid: z.string(),
  price: transforms.fromString.number,
  discount: transforms.fromString.number,
  options: planOptionsSchema,
});

export type Plan = z.infer<typeof planSchema>;

/**
 * Customer schema with unified transformations
 */
export const customerSchema = withFeatureFlags(
  createModelSchema({
    // Core fields
    custid: z.string(),
    role: z.enum([
      CustomerRole.CUSTOMER,
      CustomerRole.COLONEL,
      CustomerRole.RECIPIENT,
      CustomerRole.USER_DELETED_SELF,
    ]),

    // Boolean fields from API
    verified: transforms.fromString.boolean,
    active: transforms.fromString.boolean,
    contributor: transforms.fromString.boolean.optional(),

    // Counter fields from API with default values
    secrets_created: transforms.fromString.number.default(0),
    secrets_burned: transforms.fromString.number.default(0),
    secrets_shared: transforms.fromString.number.default(0),
    emails_sent: transforms.fromString.number.default(0),

    // Date fields
    last_login: transforms.fromString.dateNullable,

    // Optional fields
    locale: z.string().nullable(),
    planid: z.string().nullable().optional(),

    // Plan data
    plan: planSchema,

    // Stripe-related fields
    stripe_customer_id: z.string().nullable(),
    stripe_subscription_id: z.string().nullable(),
    stripe_checkout_email: z.string().nullable(),
  }).strict()
);

// Update the type to explicitly use Date for timestamps
export type Customer = Omit<z.infer<typeof customerSchema>, 'created' | 'updated'> & {
  created: Date;
  updated: Date;
};