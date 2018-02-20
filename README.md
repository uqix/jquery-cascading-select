# jquery-cascading-select

[![npm version](https://img.shields.io/npm/v/jquery-cascading-select.svg)](https://www.npmjs.com/package/jquery-cascading-select)
[![npm downloads](https://img.shields.io/npm/dt/jquery-cascading-select.svg)](https://www.npmjs.com/package/jquery-cascading-select)
[![David](https://david-dm.org/zenkiezhu/jquery-cascading-select.svg)](https://david-dm.org/zenkiezhu/jquery-cascading-select)

Unlimited level cascading select


## Installation

### npm
`npm install jquery-cascading-select --save`

### bower
`bower install jquery-cascading-select --save`


## Usage

See [demo](https://zenkiezhu.github.io/jquery-cascading-select/)


## API

### Init
```javascript
$('level 1 select').cascadingSelect(options)
```

### Options
| Name        | type     | default | description                                                |
|-------------|----------|---------|------------------------------------------------------------|
| subSelects | string array | | jQuery selectors for sub selects  |
| data | node array | | model of option tree |
| placeholder | string | false | text to show when no option selected |
| placeholderWhenEmpty | string | false | text to show when no option available |

#### Node format

A node describes an option(its text, value, sub options) by one of following formats:

* Leaf
  * object __{text, value?}__, e.g. { text: 't', value: 'v' }, { text: 't' } expands to { text: 't', value: 't' }
  * string, e.g. 't' expands to { text: 't', value: 't' }

* Parent
  * object __{text, value?, children}__, e.g. { text: 't', children: [ node1, node2, ... ] }
