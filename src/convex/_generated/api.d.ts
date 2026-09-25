/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as http from "../http.js";
import type * as mutations_biogas from "../mutations/biogas.js";
import type * as mutations_businesses from "../mutations/businesses.js";
import type * as mutations_donations from "../mutations/donations.js";
import type * as mutations_employees from "../mutations/employees.js";
import type * as mutations_notifications from "../mutations/notifications.js";
import type * as mutations_seed from "../mutations/seed.js";
import type * as mutations_users from "../mutations/users.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "auth/emailOtp": typeof auth_emailOtp;
  http: typeof http;
  "mutations/biogas": typeof mutations_biogas;
  "mutations/businesses": typeof mutations_businesses;
  "mutations/donations": typeof mutations_donations;
  "mutations/employees": typeof mutations_employees;
  "mutations/notifications": typeof mutations_notifications;
  "mutations/seed": typeof mutations_seed;
  "mutations/users": typeof mutations_users;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
