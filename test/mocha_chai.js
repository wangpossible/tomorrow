var assert = require('chai').assert;
var expect = require('chai').expect;

describe('mocha chai test',function(){
	
	before(function(){
		///console.log('run before all tests in this block');		
	});
	after(function(){
		//console.log('run after all tests in this block');
	});
	beforeEach(function(){
		//console.log('run before each test in this block');
	});
	afterEach(function(){
		//console.log('run after each test in this block');
	});	
	
	var foo='bullshit';
	describe('assert',function(){
		it('assert.equal  method',function(){
			assert.equal(foo,'bullshit');				
		});
	});
	
	describe('expect',function(){
		it('expect.to.equal  method',function(){
			expect(foo).to.equal('bullshit');	
			expect(foo).to.not.equal('bullshit-test');					
		});
	});
	
	describe.skip('should',function(){
		it('should method',function(){
						
		});
	});
	
});