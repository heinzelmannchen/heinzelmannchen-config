Heinzelmannchen-config
======================

This module handles the configuration of `heinzelmannchen`.
It uses [rc](https://www.npmjs.org/package/rc) to obtain the nearest configfile.

Usage
-----

sample config
```
{
    key: 'value',
    array: [1, 2, 3],
    sub: {
        key: 'anOtherValue'
    }
}
```

```javascript
var config = require('heinzelmannchen-config');

config.get('key'); // value
config.get('sub.key'); // anOtherValue
```
