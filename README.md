
## Introduction
Text-change-digest is a fast digest/hash optimized for detecting changes to text. This makes it well-suited for low-latency, interactive applications. Our goal is to get the text change detection comfortably under 60ms, so that 60fps can be achieved on systems where text changes are polled at hundreds if not thousands of points.

## Optimizations
Our main method of providing fast change detection is to pick a hashing algorithm with sufficient characteristics, and to avoid calculating it until the very last stage in our change detection sequence. We picked 32-bit [Fowler-Noll-Vo] 1a as our hashing algorithm. [Fowler-Noll-Vo] gives pretty good diffusion, and is fast to compute.

Most JavaScript number system are all 64-bit floating point based, and give 53 bits of precision. A 32-bit version of FNV would fit comfortably on all the major JavaScript VM's. 64-bit would not fit without folding. We felt that folding was unnecessary. It is an extra round that we would like to avoid.

Since calculating the hash is relatively expensive, we will push it as far back as possible. To do this, we add quick fields for detecting changes to text. We chose the first character, the last character, and the length. Most changes can be quickly detected by fluctuations in either of the three. This will allow us to avoid computing the hash in order to detect a change most of the time.

## Installation
### Node
You can use NPM to install text-change-digest. With NPM:
```javascript
npm install text-change-digest
```

And then in your Node source, you would do:

```javascript
var tcdigest = require('text-change-digest');
```

### Bower
You can use Bower to install text-change-digest. With Bower:

```javascript
bower install text-change-digest
```

And then in your web page, you can load text-change-digest simply by pointing a script tag to the location of tcdigest.js

```html
<script src="/bower_components/text-change-digest/tcdigest.js"></script>
<!-- window.tcdigest should now point to the tcdigest function -->
```


## License

The MIT License (MIT)

Copyright (c) 2015 Dickson Tam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[Fowler-Noll-Vo]: http://www.isthe.com/chongo/tech/comp/fnv/
