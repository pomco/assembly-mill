"use strict";
var mocha = require('mocha');
var chai = require('chai');
var fs = require('fs');
var path = require('path');

var assert = chai.assert;
//var expect = chai.expect;
//var should = chai.should();

var suite = mocha.suite;
var setup = mocha.setup;
var suiteSetup = mocha.suiteSetup;
var test = mocha.test;
var teardown = mocha.teardown;
var suiteTeardown = mocha.suiteTeardown;

//target
var assembly = require('./../index.js');
var test_core = require('./assembly-mill-test-core_mocha_tdd.js');
// 
var template  = "";
var original_template ="";
var result_template = {};
var demoPath ="";
var one = {};
var back = {};


//
suiteSetup('suiteSetup()在所有测试用例执行前，仅仅执行1次',function(){ // 在所有测试用例执行前，仅仅执行1次
	template  = "";
	demoPath =path.join(__dirname,'/demo.json');

});
setup('setup()在执行每个测试用例前，都要执行1次',function(){ // 执行每个测试用例前，都要执行1次
 	template = assembly.regist(demoPath);
 	original_template = template.template;
 	one = template.template;
 	back = template.template;
});
teardown('teardown()在每个测试用例执行后，都要执行1次',function(){ // 每个测试用例执行后，都要执行1次
	result_template = template.render();
	one = {};
	back = {};
});

suiteTeardown('suiteTeardown()在所有测试用例执行后，仅仅执行1次',function(){ // 在所有测试用例执行后，仅仅执行1次
	template  = "";
	result_template = {};
});


//
suite('Assembly Mill TDD Test\n',function(){ // 定义多组测试用例

	suite(' ^_^  regist()函数功能测试\n',function(){ // 测试分组-01
		suite(' -> regist() 被调用前...\n',function(){
			test(' -->> demo.json模板内容符合标准json格式.\n',function(){ // 测试用例-01
				var fileContent = fs.readFileSync(demoPath,{encoding:'utf-8'});
				assert.typeOf(JSON.parse(fileContent),'object','模板内容应该要可以转换成json对象!\n');
			});
		});
		suite(' -> regist() 被调用后...\n',function(){
			suite(' -->> 应返回...\n',function(){
				test('应该要返回Object对象,但不是数组.\n',function(){ // 测试用例-01
					assert.typeOf(template,'object',"应该要返回Object对象!\n");
					assert.notInstanceOf(template,Array,"应该不是数组!\n");
				});
			});

			suite(' -->> 返回的对象\n',function(){
				test('应包含属性template.\n',function(){
					assert.property(template,'template','应包含属性template!\n');
				});
				test('应包含属性fill.\n',function(){
					assert.property(template,'fill','应包含属性fill!\n');
				});
				test('应包含属性render.\n',function(){
					assert.property(template,'render','应包含属性render!\n');
				});							
			});
			suite(' -->> 属性:\n',function(){
				test('template --是json对象,并且存放完整模板内容.\n',function(){ 
					var fileContent = fs.readFileSync(demoPath,{encoding:'utf-8'});
					assert.deepEqual(template.template,JSON.parse(fileContent),"template 并且要存放完整模板内容!\n");
				});
				test('fill -- 是Function对象.\n',function(){
					assert.isFunction(template.fill,'fill应该是Function对象!\n');
				});
				test('render --是Function对象.\n',function(){
					assert.isFunction(template.render,'render应该是Function对象!\n');
				});	
			});	
		});
	});
	suite('  ^_^  fill()函数功能测试\n',function(){
		test(' example-01.json \n',function(){
			var example_01_path = path.join(__dirname,'/example-01.json');
			var example_01_content = fs.readFileSync(example_01_path,{encoding:'utf-8'});
			assert.typeOf(JSON.parse(example_01_content),'object','文件example-01.json内容应该要可以转换成json对象!\n');
			template.fill(JSON.parse(example_01_content));
			test_core(original_template,JSON.parse(example_01_content),template.template);
		});
	});
/*
	suite(' ^_^  fill()函数功能测试\n',function(){ // 测试分组-02
		suite(' String <-- String -> 两两非空字符串赋值,即 (template.a !="" <-- one.a !="")\n',function(){
		   suite(' >>如果字符串都不能解析成json对象,即 JSON.parse(template.a) throw syntax error, JSON.parse(one.a) throw syntax error\n',function(){
				test('应该成功赋值.\n',function(){
					one.zoo.name = "Changlong Zoo";
					template.fill(one);	
					assert.strictEqual(template.template.zoo.name,one.zoo.name);
				});
				test('赋值后应该保持原有数据类型.\n',function(){
					one.zoo.name = "Changlong Zoo";
					template.fill(one);	
					assert.strictEqual( (typeof one.zoo.name),(typeof original_template.zoo.name));
				});
				test('赋值后不改变原有数据结构.\n',function(){
					one.zoo.name = "Changlong Zoo";
					template.fill(one);					
					back.zoo.name = original_template.zoo.name;
					template.fill(back);
					assert.deepEqual(template.template, original_template);
				});		   	
		   });
		   suite(' >>如果两字符串都能解析成json对象,JSON.parse(template.a) , JSON.parse(one.a)\n',function(){
		   		suite(' >>>解析后的json对象.\n',function(){
			   		test('属性', function() {
			   			one.zoo.breeder.zone_E="{\"name\":\"json\"}";
			   			template.fill(one);
			   			assert.strictEqual(template.template.zoo.breeder.zone_E,original_template.zoo.breeder.zone_E);
			   		});
			   		test('查找属性相同的赋值', function() {
			   			one.zoo.breeder.zone_E="{\"name\":\"json\"}";
			   			template.fill(one);
			   			assert.strictEqual(template.template.zoo.breeder.zone_E,original_template.zoo.breeder.zone_E);
			   		});			   		
		   		});


		   });
		   suite(' >>如果模板中字符串能解析成json对象,赋值的字符串不能解析成json对象,即JSON.parse(template.a) , JSON.parse(one.a) throw syntax error\n',function(){
		   		test('不允许这类赋值.\n',function(){
		   			one.zoo.breeder.zone_E="can't JSON.parse()";
		   			template.fill(one);
		   			assert.strictEqual(template.template.zoo.breeder.zone_E,original_template.zoo.breeder.zone_E);
		   		});
		   		test('更不能改变原有数据结构.\n',function(){
		   			one.zoo.breeder.zone_E="can't JSON.parse()";
		   			template.fill(one);
		   			assert.deepEqual(template.template, original_template);
		   		});
		   });
		   suite(' >>如果模板中字符串不能解析成json对象,赋值的字符串能解析成json对象,即JSON.parse(template.a) throw syntax error , JSON.parse(one.a)\n',function(){
		   		test('不允许这类赋值.\n',function(){
		   			one.zoo.breeder.zone_D="{\"name\":\"json\"}";
		   			template.fill(one);
		   			assert.strictEqual(template.template.zoo.breeder.zone_D,original_template.zoo.breeder.zone_D);
		   		});
		   		test('更不能改变原有数据结构.\n',function(){
		   			one.zoo.breeder.zone_D="{\"name\":\"json\"}";
		   			template.fill(one);
		   			assert.deepEqual(template.template, original_template);
		   		});		   		
		   });

		});
		suite(' String <-- String -> 给非空字符串赋空值,即(template.a !="" <-- one.a ="" )\n',function(){
			suite(' >>如果模板非空字符串不能解析成json对象,即JSON.parse(template.a) throw syntax error\n',function(){
				test('应该成功赋值.\n',function(){
					one.zoo.name = "";
					template.fill(one);	
					assert.strictEqual(template.template.zoo.name,one.zoo.name);
				});
				test('赋值后应该保持原有数据类型.\n',function(){
					one.zoo.name = "";
					template.fill(one);	
					assert.strictEqual( (typeof one.zoo.name),(typeof original_template.zoo.name));
				});
				test('赋值后不改变原有数据结构.\n',function(){
					one.zoo.name = "";
					template.fill(one);					
					back.zoo.name = original_template.zoo.name;
					template.fill(back);
					assert.deepEqual(template.template, original_template);
				});
			});
			suite(' 如果模板非空字符串能解析成json对象,即JSON.parse(template.a)\n',function(){
		   		test('不允许这类赋值.\n',function(){
		   			one.zoo.breeder.zone_E="";
		   			template.fill(one);
		   			assert.strictEqual(template.template.zoo.breeder.zone_E,original_template.zoo.breeder.zone_E);
		   		});
		   		test('更不能改变原有数据结构.\n',function(){
		   			one.zoo.breeder.zone_E="";
		   			template.fill(one);
		   			assert.deepEqual(template.template, original_template);
		   		});
			});

		});
		suite(' String <-- String -> 给空字符串赋非空值,即(template.a ="" <-- one.a !="" )\n',function(){
			test('应该成功赋值.\n',function(){
				one.zoo.alias = "Changlong Zoo";
				one.zoo.breeder.zone_A.name ="{\"career\":\"nba\"}";
				template.fill(one);	
				assert.strictEqual(template.template.zoo.alias,one.zoo.alias);
				assert.strictEqual(template.template.zoo.breeder.zone_A.name,one.zoo.breeder.zone_A.name);
			});
			test('赋值后应该保持原有数据类型.\n',function(){
				one.zoo.alias = "Changlong Zoo";
				one.zoo.breeder.zone_A.name ="{\"career\":\"nba\"}";
				template.fill(one);	
				assert.strictEqual( (typeof template.template.zoo.alias),(typeof original_template.zoo.alias));
				assert.strictEqual( (typeof template.template.zoo.breeder.zone_A.name),(typeof original_template.zoo.breeder.zone_A.name));
			});
			test('赋值后不改变原有数据结构.\n',function(){
				one.zoo.alias = "Changlong Zoo";
				one.zoo.breeder.zone_A.name ="{\"career\":\"nba\"}";
				template.fill(one);					
				back.zoo.alias = original_template.zoo.alias;
				back.zoo.breeder.zone_A.name = original_template.zoo.breeder.zone_A.name;
				template.fill(back);
				assert.deepEqual(template.template, original_template);
			});
		});
		suite(' String <-- Number or Boolean -> 给字符串赋数字或布尔值.\n',function(){
			test('不允许这类赋值.\n', function() {
			   one.zoo.name = 123;
			   one.zoo.alias = 456;
			   one.zoo.breeder.zone_E=009;
			   template.fill(one);
			   assert.strictEqual(template.template.zoo.name,original_template.zoo.name);
			   assert.strictEqual(template.template.zoo.alias,original_template.zoo.alias);
			   assert.strictEqual(template.template.zoo.breeder.zone_E,original_template.zoo.breeder.zone_E);
			   one.zoo.name = true;
			   one.zoo.alias = false;
			   one.zoo.breeder.zone_E=false;
			   template.fill(one);
			   assert.strictEqual(template.template.zoo.name,original_template.zoo.name);
			   assert.strictEqual(template.template.zoo.alias,original_template.zoo.alias);
			   assert.strictEqual(template.template.zoo.breeder.zone_E,original_template.zoo.breeder.zone_E);
			});
			test('更不能改变原有数据结构.\n',function() {
			   one.zoo.name = 123;
			   one.zoo.alias = 456;
			   one.zoo.breeder.zone_E=009;
			   template.fill(one);
			   assert.deepEqual(template.template, original_template);
			   one.zoo.name = true;
			   one.zoo.alias = false;
			   one.zoo.breeder.zone_E=false;
			   template.fill(one);
			   assert.deepEqual(template.template, original_template);		   
			});
		});
	});
*/
	suite(' ^_^   render()函数功能测试\n',function(){ // 测试分组 -03 
		suite(' -> render() 被调用后...',function(){
			test('返回json对象,并且与template属性相等.\n',function(){
				assert.deepEqual(template.render(),template.template,'返回json对象,并且与template属性相等!\n');
			});
		});
	});
});
