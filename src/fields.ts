/**
 * Models for common types of entity field values.
 *
 * This module should not be imported outside of @yext/api. For
 * \@yext/api's public exports, see the index module.
 *
 * @module
 * @internal
 */

/** Possibile shapes for field values in Entity objects. */
export type FieldValue =
  | string
  | number
  | boolean
  | null
  | FieldValue[]
  | {[k: string]: FieldValue}
  | undefined;

/** An address specifying a physical location. */
export type AddressValue = {
  line1?: string;
  line2?: string;
  line3?: string;
  sublocality?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  countryCode?: string;
  extraDescription?: string;
};
