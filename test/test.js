var assert = require('assert');
var tcdigest = require('../tcdigest.js');
var fs = require('fs');
var path = require('path');
var constitution = fs.readFileSync(path.resolve(__dirname,'./constitution.txt'), { encoding: 'utf8'});
var sampleText = [
  [ '', ' ' ],
  [ 'hello', 'hell'],
  [ 'hello', 'bye' ],
  [ '0', ' ' ],
  [ '0', '' ],
  [ constitution, constitution + ' ']
];
var strload = require('string-etc');
strload('cram');

function test(text1, text2) {
  describe("'" + text1.cram(32, { 'location' : 'body'}) + "' '" + text2.cram(32, { 'location' : 'body' }) + "'" , function() {
    describe('.equals', function() {
      it('should return true for a digest also from the same source', function() {
        var a = tcdigest(text1);
        var b = tcdigest(text1);
        assert.ok(a.equals(b));
      });

      it('should return false for a digest from a different source', function() {
        var a = tcdigest(text1);
        var b = tcdigest(text2);
        a.equals(b);
      });
    });

    describe('.updates', function() {
      it('should not call callback for same source', function() {
        var a = tcdigest(text1);
        var t = 0;
        a.update(text1, function() {
          t++;
        });
        assert.equal(t, 0);
      });

      it('should call callback for different source', function() {
        var a = tcdigest(text1);
        var t = 0;
        a.update(text2, function() {
          t++;
        });
        assert.equal(t, 1);
      });
    });
  });
};

sampleText.forEach(function(v) {
  test(v[0], v[1]);
});
