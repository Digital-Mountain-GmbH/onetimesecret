/**
 * About this project (as a whole):
 *
 * We're dealing with type safety across multiple layers:
 *    - Redis (database)
 *    - Ruby Rack app models (backend)
 *    - JSON REST API (transport)
 *    - Vue 3 + TypeScript frontend stores
 *    - Vue components
 *
 * The key challenge we're using zod for is maintaining type consistency across these boundaries, particularly:
 *    - How Ruby models are serialized to JSON
 *    - How that JSON is transformed into frontend state
 *    - How components interact with that state
 *
 * Challenges:
 * 1. Type Boundary Mismatches:
 *    - Ruby/Redis stores everything as strings
 *    - API transmits these string representations
 *    - Frontend needs proper JavaScript types (boolean, number, Date)
 *    - Vue components expect proper TypeScript types
 *
 * 2. Validation Gaps:
 *    - Some fields lack explicit validation
 *    - Inconsistent handling of optional fields
 *    - Missing runtime type checks at boundaries
 *
 * 3. Transformation Complexity:
 *    - Multiple layers of transformation
 *    - Potential for data loss or corruption
 *    - Error handling across boundaries
 *
 * 4. Schema Evolution:
 *    - Ruby model changes need TypeScript updates
 *    - Risk of outdated type definitions
 *    - Missing fields in transformations
 *
 * Strategy:
 * 1. Single Source of Truth:
 *    - Define complete Zod schemas matching Ruby models
 *    - Generate TypeScript types from schemas
 *    - Share types between stores and components
 *
 * 2. Clear Boundaries:
 *    - Transform only at API edges (input/output)
 *    - Keep internal store state typed
 *    - Validate before state updates
 *
 * 3. Consistent Transformations:
 *    - Standardize string → type conversions
 *    - Handle all edge cases explicitly
 *    - Proper error handling with details
 *
 * */
// src/schemas/index.ts
// Base exports
export * from './api/base';
export * from './models/base';

// Error handling
export * from './api/errors';

// Core models
export * from './models/customer';
export * from './models/feedback';
export * from './models/metadata';
export * from './models/secret';

// Domain models
export * from './api/endpoints/colonel';
export * from './models/domain/index';

// API endpoints
export * from './api/endpoints';

// Response types - consolidated
export type {
  ApiBaseResponse,
  ApiErrorResponse,
  ApiRecordResponse,
  ApiRecordsResponse,
} from './api/base';

export type {
  AccountResponse,
  ApiTokenResponse,
  MetadataResponse,
  SecretResponse,
} from './api/responses';

export type { ColonelData } from './api/endpoints/colonel';

// Model types - consolidated
export type { BaseModel, CustomDomain, Customer, Feedback, Metadata, Secret } from './models';
