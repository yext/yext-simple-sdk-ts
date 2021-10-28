/**
 * Interfaces for calling the Knowledge Graph API.
 *
 * This module should not be imported outside of @yext/api. For
 * \@yext/api's public exports, see the index module.
 *
 * @module
 * @internal
 */

import {ApiError, Client, Config} from './api';
import {Entity} from './entities';

/**
 * Provides access to the Knowledge Graph API.
 *
 * For more information, see
 * https://hitchhikers.yext.com/docs/knowledgeapis/knowledgegraph/
 */
export class KnowledgeGraphApi {
  private readonly client: Client;

  constructor(config: Config) {
    this.client = new Client(config);
  }

  /**
   * Calls the Entities: Create endpoint.
   *
   * For more information, see
   * https://hitchhikers.yext.com/docs/knowledgeapis/knowledgegraph/entities/entities/#operation/createEntity
   *
   * @param entityId - the external ID to assign to the new entity
   * @param entityType - the type of entity to be created, like
   *     'location' or 'faq'
   * @param entity - the data to populate the new entity with
   *
   * @returns the full newly created entity
   */
  async createEntity<T extends Entity>(
    entityId: string,
    entityType: string,
    entity: T
  ): Promise<T> {
    const body = {
      ...entity,
      meta: {...entity.meta, id: entityId},
    };
    const apiResponse = await this.client.call(
      'POST',
      'entities',
      {entityType},
      body
    );
    return apiResponse.response as T;
  }

  /**
   * Calls the Entities: Get endpoint.
   *
   * For more information, see
   * https://hitchhikers.yext.com/docs/knowledgeapis/knowledgegraph/entities/entities/#operation/getEntity
   *
   * @param entityId - the external ID of the requested entity
   *
   * @returns the requested entity, or null if no such entity exists
   */
  async getEntity<T extends Entity = Entity>(
    entityId: string
  ): Promise<T | null> {
    try {
      const apiResponse = await this.client.call('GET', `entities/${entityId}`);
      return apiResponse.response as T;
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.httpResponse.status === 404) {
          return null;
        }
      }
      throw e;
    }
  }

  /**
   * Calls the Entities: Update endpoint.
   *
   * For more information, see
   * https://hitchhikers.yext.com/docs/knowledgeapis/knowledgegraph/entities/entities/#operation/updateEntity
   *
   * @param entityId - the external ID of the entity to update
   * @param partialEntity - data to update on the entity
   *
   * @returns the full entity including the requested updates
   */
  async updateEntity<T extends Entity>(
    entityId: string,
    partialEntity: T
  ): Promise<T> {
    const apiResponse = await this.client.call(
      'PUT',
      `entities/${entityId}`,
      {},
      partialEntity
    );
    return apiResponse.response as T;
  }

  /**
   * Calls the Entities: Delete endpoint.
   *
   * For more information, see
   * https://hitchhikers.yext.com/docs/knowledgeapis/knowledgegraph/entities/entities/#operation/deleteEntity
   *
   * @param entityId - the external ID of the entity to delete
   *
   * @returns true if the entity was deleted, or false if no such entity exists
   */
  async deleteEntity(entityId: string): Promise<boolean> {
    try {
      await this.client.call('DELETE', `entities/${entityId}`);
      return true;
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.httpResponse.status === 404) {
          return false;
        }
      }
      throw e;
    }
  }
}
