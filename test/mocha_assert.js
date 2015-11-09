var assert = require('assert');
describe('Array',function(){
		describe('indexof',function(){
			it('it should return true when the array not contains the num',function(){
				assert.equal(-1,[1,2,3].indexOf(5));
			});			
		});
});