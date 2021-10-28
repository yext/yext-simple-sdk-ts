/**
 * Interfaces for modeling entities.
 *
 * This module should not be imported outside of @yext/api. For
 * \@yext/api's public exports, see the index module.
 *
 * @module
 * @internal
 */

import * as fields from './fields';

/**
 * The primary object stored in Yext's Knowledge Graph.
 *
 * For more information, see
 * https://hitchhikers.yext.com/modules/kg121-entity-types-intro/01-what-is-an-entity/
 * (registration required)
 *
 * This interface models the basic format the Yext API uses when
 * returning or expecting entities.
 *
 * Except for the meta property, the properties of an Entity represent
 * the entity's data, with field IDs as keys for the corresponding field
 * values.
 *
 * This base interface explicitly defines only the name field, as that
 * is the only field required in all entity types. Users of this SDK are
 * encouraged to define their own interfaces extending this interface
 * with fields specific to their account's enabled entity types.
 */
export interface Entity {
  /**
   * Metatdata for the entity.
   *
   * For more information, see the documentation for the response.meta
   * field in the response schema for the 200 Success Response from the
   * Entities: Get endpoint:
   * https://hitchhikers.yext.com/docs/knowledgeapis/knowledgegraph/entities/entities/#operation/getEntity
   */
  meta?: {
    accountId?: string;
    countryCode?: string;
    entityType?: string;
    folderId?: string;
    id?: string;
    labels?: number[];
    language?: string;
    timestamp?: string;
    uid?: string;
  };

  name?: string;
  [fieldId: string]: fields.FieldValue;
}

/**
 * Physical locations, like retail stores, offices, or auto service
 * centers.
 *
 * This interface models the Location built-in entity type.
 *
 * This interface is a work in progress and does not yet model the full
 * range of Location's fields.
 */
export interface Location extends Entity {
  address?: fields.AddressValue;
}
