/*
 * Copyright (c) 2015 Dickson Tam
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 */


(function() {

  /* We will use Fowler-Noll-Vo as the hashing function, because FNV gives a
   * good mixture of speed and collision avoidance for the use cases, we are
   * interested in.
   */

  function fnv1a(text) {
    var offset = 2166136261;
    var prime = 16777619;
    var hash = offset;

    for (var i=0; i < text.length; i++) {
        hash = ((hash << 5) + hash) ^ text[i];
    }

    return hash;
  }

  function times33(text) {
    var offset = 5381;
    var prime = 33;
    var hash = offset;

    for (var i=0; i < text.length; i++) {
        hash = hash ^ text[i];
        hash = hash * prime;
    }

    return hash;
  }

  var hash = fnv1a;


  function TextChangeDigest(text) {
    if (text == null) return;

    this.firstCharacter = text[0];
    this.lastCharacter = text[text.length - 1];
    this.length = text.length;
    this.hash = hash(text);
  }


  TextChangeDigest.prototype.equals = function(digest) {

    return (this.firstCharacter == digest.firstCharacter) &&
           (this.lastCharacter == digest.lastCharacter) &&
           (this.length == digest.length) &&
           (this.hash == digest.hash);

  }

  TextChangeDigest.prototype.update = function(text, fxChange) {

    if (fxChange == null) {
      this.firstCharacter = text[0];
      this.lastCharacter = text[text.length - 1];
      this.length = text.length;
      this.hash = hash(text);
      return this;
    }

    if (this.firstCharacter != text[0] || this.lastCharacter != text[text.length - 1] || this.length != text.length) {
      fxChange();
      return this.update(text);
    }

    var newHash = hash(text);

    if (newHash != this.hash) fxChange();
    return this.update(text);
  }

  function factory(text) {
    return new TextChangeDigest(text);
  }


  if (typeof define === 'function' && define.amd) { // Require.js & AMD
    define('text-change-digest', [], function() {
      return factory;
    });
  } else if (typeof module !== 'undefined' && module && module.exports) { // Node.js & CommonJS
    module.exports = factory;
  } else { // Browser
    window.tcdigest = factory;
  }

})();
