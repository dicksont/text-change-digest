## Introduction
Text-change-digest is a fast digest/hash optimized for detecting changes to text. This makes it well-suited for low-latency, interactive applications. Our goal is to get the text change detection comfortably under 60ms, so that 60fps can be achieved on systems where text changes are polled at hundreds if not thousands of points.

## Optimizations
Our main method of providing fast change detection is to pick a hashing algorithm with sufficient characteristics, and to avoid calculating it until the very last stage in our change detection sequence. We picked 32-bit [Fowler-Noll-Vo] 1a as our hashing algorithm. [Fowler-Noll-Vo] gives pretty good diffusion, and is fast to compute.

Most JavaScript number system are all 64-bit floating point based, and give 53 bits of precision. A 32-bit version of FNV would fit comfortably on all the major JavaScript VM's. 64-bit would not fit without folding. We felt that folding was unnecessary. It is an extra round that we would like to avoid.

Since calculating the hash is relatively expensive, we will push it as far back as possible. To do this, we add quick fields for detecting changes to text. We chose the first character, the last character, and the length. Most changes can be quickly detected by fluctuations in either of the three. This will allow us to avoid computing the hash in order to detect a change most of the time.

[Fowler-Noll-Vo]: http://www.isthe.com/chongo/tech/comp/fnv/
