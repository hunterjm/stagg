# Stagg MongoDB Integration

Provided by [Stagg.co](https://stagg.co)

## Getting Started

Install the package

```
yarn install @stagg/mdb
```

Configure the connection on startup (only done once).

```typescript
import * as mdb from '@stagg/mdb'
(async () => {
    mdb.config({ host, user, password })
    const db = await mdb.client('dbName')
    // ... do stuff
})()
```

In any subsequent requests, only the client needs to be fetched.


```typescript
import * as mdb from '@stagg/mdb'
(async () => {
    const db = await mdb.client('dbName')
    // ... do stuff
})()
```

The config interface can be found in `<PKG>.config`

```typescript
export interface Config {
    host:string
    user:string
    password:string
}
```

### Call of Duty

Currently supports Warzone
