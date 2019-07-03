# :point_up_2: React Double Tap Hook :point_up_2:

> React hook for handling double tap on mobile devices

[![NPM](https://img.shields.io/npm/v/use-double-tap.svg)](https://www.npmjs.com/package/use-double-tap)
[![NPM](https://img.shields.io/npm/l/use-double-tap.svg)](https://www.npmjs.com/package/use-double-tap)
## Install

```bash
npm install --save use-double-tap
```
or
```bash
yarn add use-double-tap
```

## Basic Usage

```javascript
import React from 'react';

import { useDoubleTap } from 'use-double-tap';

const Example = () => {
    const bind = useDoubleTap(() => {
      // Your action here
      console.log('Double tapped');
    });
    
    return <button {...bind}>Tap me</button>;
}
```

## Advanced usage
### Custom capture threshold
You can also manually specify time threshold for capturing double tap event (default: 300ms).
```javascript
useDoubleTap(() => {
  // Your action here
}, 500);
```
In the example above, second tap must occur within 500ms period to register double tap.

### Disable binding
If you pass falsy value as callback (like `null`) double tap will not bind to the component.
```javascript
useDoubleTap(null);
``` 
This allows you to dynamically determine if event should be bound.

## :warning: Warning
This hook internally use `onClick` event to detect double tap, so be careful not to override your existing event listener.

This is where disabling listener binding may come handy - you can use double tap detection only when necessary.

## Why `onClick`?
Because it leverages built in event handler which can also detect mobile tap event. 

This way we can get rid of complicated edge cases when combining `onTouchCancel onTouchEnd onTouchMove onTouchStart` events.

Also this approach greatly reduce package size as well as increase speed and flexibility.

## License

MIT © [minwork](https://github.com/minwork)
