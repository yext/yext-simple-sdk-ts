/**
 * Common needs for interacting with Yext APIs.
 *
 * This module should not be imported outside of @yext/api. For
 * \@yext/api's public exports, see the index module.
 *
 * @module
 * @internal
 */

import crossFetch from 'cross-fetch';

const fetch =
  typeof globalThis.fetch === 'function' ? globalThis.fetch : crossFetch;

/** Common configuration for making calls to Yext APIs. */
export interface Config {
  /**
   * API key for authenticating requests to Yext APIs.
   *
   * Your API keys can found in the Developer Console after logging in
   * to your Yext account. Each app you create in the Developer Console
   * has its own set of API keys.
   *
   * If you're just getting started with trying out Yext, check out the
   * "Get Started with Yext APIs" guide for how to make your first API
   * key: https://hitchhikers.yext.com/guides/get-started-yext-api/
   */
  apiKey: string;

  /**
   * The environment containing the Yext account that apiKey provides
   * access to.
   *
   * Most Yext client accounts and API developer accounts are in 'PROD'
   * (short for "production"), but Hitchhiker Playground Accounts exist
   * in the 'SANDBOX' environment.
   *
   * When unspecified, defaults to 'PROD'.
   */
  env?: 'PROD' | 'SANDBOX';

  /**
   * What to use for the accountId path parameter required for all Yext
   * API calls.
   *
   * For more information about account IDs, see
   * https://hitchhikers.yext.com/docs/policiesandconventions/?target=account-id
   *
   * When unspecified, defaults to 'me', which selects the account that
   * owns the API key apiKey. It is generally unnecessary to change this
   * unless you are a Yext Partner.
   */
  accountId?: string;

  /**
   * What to use for the v parameter required for all Yext API calls.
   *
   * For more information about the v parameter, see
   * https://hitchhikers.yext.com/docs/policiesandconventions/?target=versioning
   *
   * When unspecified, defaults to DEFAULT_V_PARAM. Note that changing
   * away from the default may result in incompatibilities with this
   * version of this SDK.
   */
  vParam?: string;

  /**
   * Alternative host to direct requests to instead of the default.
   *
   * This option is only for internal use by Yext.
   */
  hostOverride?: string;
}

/**
 * Default date this version of this SDK uses for the v parameter when
 * making API calls.
 */
// Force string type to avoid leaking the specific value in the exported type.
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const DEFAULT_V_PARAM: string = '20211028';

/**
 * A well-formed response from the Yext API.
 *
 * In exceptional cases, calls to the Yext API may result in responses
 * with arbitrary content in their bodies that doesn't conform to this
 * structure. But in most cases, including many error cases, the bodies
 * are JSON that can be parsed into this structure.
 *
 * For more information, including the meanings of each field, see
 * https://hitchhikers.yext.com/docs/policiesandconventions/?target=response-format
 */
export interface ApiResponse {
  meta: {
    uuid: string;
    errors: {
      code: number;
      type: 'FATAL_ERROR' | 'NON_FATAL_ERROR' | 'WARNING';
      message: string;
    }[];
  };
  response: {};
}

/**
 * Error thrown when the Yext API returns an error.
 *
 * This error is thrown when a call to the Yext API receives an HTTP
 * response, but the HTTP status code is not from the successful (2xx)
 * class.
 */
export class ApiError extends Error {
  constructor(readonly httpResponse: Response) {
    super();
    this.name = this.constructor.name;
  }
}

/** Client for making calls to Yext APIs. */
export class Client {
  private readonly urlBase: string;
  private readonly apiKey: string;
  private readonly vParam: string;

  constructor(config: Config) {
    let host;
    if (config.hostOverride) {
      host = config.hostOverride;
    } else {
      const env = config.env || 'PROD';
      switch (env) {
        case 'PROD':
          host = 'api.yext.com';
          break;
        case 'SANDBOX':
          host = 'api-sandbox.yext.com';
          break;
        default: {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const exhaustiveCheck: never = env;
          throw new Error(`Unknown Yext environment: ${env}`);
        }
      }
    }

    const accountId = config.accountId || 'me';

    this.urlBase = `https://${host}/v2/accounts/${accountId}/`;
    this.apiKey = config.apiKey;
    this.vParam = config.vParam || DEFAULT_V_PARAM;
  }

  /**
   * Makes a call to the Yext API.
   *
   * @param endpointPath - This string is appended after the common
   *     /v2/accounts/{accountId}/ prefix to define the URL path for the
   *     API request.
   * @param body - JSON.stringify(body) is sent as the HTTP request body.
   *
   * @throws {@link ApiError}
   * when the Yext API returns a response with a non-successful HTTP status code
   */
  async call(
    httpMethod: 'DELETE' | 'GET' | 'POST' | 'PUT',
    endpointPath: string,
    queryParams?: Record<string, string | string[]>,
    body?: {}
  ): Promise<ApiResponse> {
    const url = new URL(this.urlBase + endpointPath);
    url.searchParams.append('api_key', this.apiKey);
    url.searchParams.append('v', this.vParam);
    for (const k in queryParams) {
      const v = queryParams[k];
      if (Array.isArray(v)) {
        for (const individualV of v) {
          url.searchParams.append(k, individualV);
        }
      } else {
        url.searchParams.append(k, v);
      }
    }

    const init: RequestInit = {method: httpMethod};
    if (body) {
      init.body = JSON.stringify(body);
      init.headers = {'Content-Type': 'application/json; charset=utf-8'};
    }

    const response = await fetch(url.toString(), init);
    if (!response.ok) {
      throw new ApiError(response);
    }

    return (await response.json()) as ApiResponse;
  }
}
