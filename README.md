# TypeScript Client for Yext APIs

A package that makes it easy to call [Yext APIs] from TypeScript and
JavaScript. Currently covers just a few of the most popular endpoints.

[Yext APIs]: https://hitchhikers.yext.com/docs/

## Quick Start

### Node.js and npm

This package is available as an npm package:

```
npm install @yext/api
```

To call the [Entities: Get] endpoint, do something like the following:

[Entities: Get]: https://hitchhikers.yext.com/docs/knowledgeapis/knowledgegraph/entities/entities/#operation/getEntity

```TypeScript
import {KnowledgeGraphApi} from '@yext/api';
...
  const kg = new KnowledgeGraphApi({apiKey: 'YOUR_API_KEY'});
  const entity = await kg.getEntity('ENTITY_ID');
```

### Deno

This package can be used on [Deno] via the [esm.sh] CDN.

[Deno]: https://deno.land/
[esm.sh]: https://esm.sh/

```TypeScript
import {KnowledgeGraphApi} from 'https://esm.sh/@yext/api';
const kg = new KnowledgeGraphApi({apiKey: 'YOUR_API_KEY'});
const entity = await kg.getEntity('ENTITY_ID');
```
