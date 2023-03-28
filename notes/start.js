import {Parcel} from '@parcel/core';

let bundler = new Parcel({
  entries: 'a.js',
  defaultConfig: '@parcel/config-default',
  targets: ['modern']
});