[![Build Status](https://travis-ci.org/dicksont/text-change-digest.svg?branch=master)](https://travis-ci.org/dicksont/text-change-digest)
[![npm version](https://badge.fury.io/js/text-change-digest.svg)](http://badge.fury.io/js/text-change-digest)
[![Bower version](https://badge.fury.io/bo/text-change-digest.svg)](http://badge.fury.io/bo/text-change-digest)

# Introduction
Text-change-digest is a fast digest/hash optimized for detecting changes to text. This makes it well-suited for low-latency, interactive applications. Our goal is to get the text change detection comfortably under 16ms, so that 60fps can be achieved on systems where text changes are polled at hundreds if not thousands of points.

# Optimizations
Our main method of providing fast change detection is to pick a hashing algorithm with sufficient characteristics, and to avoid calculating it until the very last stage in our change detection sequence. We picked 32-bit [Fowler-Noll-Vo] 1a as our hashing algorithm. [Fowler-Noll-Vo] gives pretty good diffusion, and is fast to compute.

Most JavaScript number system are all 64-bit floating point based, and give 53 bits of precision. A 32-bit version of FNV would fit comfortably on all the major JavaScript VM's. 64-bit would not fit without folding. We felt that folding was unnecessary. It is an extra round that we would like to avoid.

Since calculating the hash is relatively expensive, we will push it as far back as possible. To do this, we add quick fields for detecting changes to text. We chose the first character, the last character, and the length. Most changes can be quickly detected by fluctuations in either of the three. This will allow us to avoid computing the hash in order to detect a change most of the time.

# Benchmarks

To get an estimate of its performance characteristics, we created a benchmark. We repeatedly called the update method with a new performance.now() string, recorded the gap time til the update callback, then averaged all the recorded timings.

Here are the results in microseconds:

- **Browser:** Google Chrome 43.0.2357.124 (64-bit)  
- **Operating System:** Mac OS X 10.10.3
- **CPU:** 2.4 GHz Intel Core i7

- **Update cycles / run :** 100,000


Run 1 | Run 2 | Run 3 | Run 4 | Run 5 | Run 6 | Run 7 | Run 8
------|-------|-------|-------|-------|-------|-------|------
0.944 | 0.982 | 1.002 | 1.129 | 0.944 | 0.984 | 1.015 | 1.081


- **Avg Latency:** 1.010 microseconds
- **Max Latency:** 1.129 microseconds
- **Min Latency:** 0.944 microseconds

# Installation
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

# API
## Constructor([text])
Create a new digest.

Example:

```javascript
var createDigest = require('../tcdigest.js');
var digest = createDigest('Hello');
```

## .equals(otherDigest)
Returns true if this digest equals **otherDigest**.

Example:
```javascript
var createDigest = require('../tcdigest.js');
var digest = createDigest('Hello');
digest.equals(digest) // Returns true;
```

## .update(newText, [fxChange])
Updates this digest using **newText**. If a change is detected anytime in the process, then **fxChange** is called immediately. When **fxChange** is called, the digest will be in an indeterminate state. We advise against accessing or modifying digest state during this span.

Example:

```javascript
var createDigest = require('../tcdigest.js');
var digest = createDigest('Hello');
digest.update('world', function() {
  console.log('updated');
})

```

# Corner Cases : Null & Undefined
While we anticipate most the time, text-change-digest will be called with well-defined pieces of text, sometimes it can be useful to extend its functions to non-string values. Most useful among these are *null* and *undefined*. What happens for example, when the constructor is called with *null*, or **.update** is called with *undefined*. Rest assured, these cases are taken care of. Anytime a text-change-digest is called with *null* or *undefined* instead of text, the *null/undefined* value will map to the empty string before undergoing any processing.

We thought this would make the most sense and preserve the behavior that developers would expect. Please let us know if otherwise.


# License

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
