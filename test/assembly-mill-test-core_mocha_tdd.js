"use strict";
var chai = require('chai');
var assert = chai.assert;
module.exports = function(originalObj,exampleObj,resultObj){
	checkSameDeepTypeAndExitDeepKey(originalObj,resultObj);
	checkSameDeepKeyAndSameDeepValue(originalObj,exampleObj,resultObj);
};
var getArgumentType= function(srcObj,destObj){
	var reg = /(^|\s+)\w/g;
	var patt1 = new RegExp(reg);
	var patt2 = new RegExp(reg);
	var srcObjType = typeof srcObj;
	var destObjType = typeof destObj;
	if(srcObjType === 'object' && (srcObj instanceof Array)){
		srcObjType = 'array';	
	}else if(srcObjType === 'object' && !(srcObj instanceof Array)){
		srcObjType = 'objectNotArray';
	}
	if(destObjType === 'object' && (destObj instanceof Array) ){
		destObjType = 'array';
	}else if(destObjType === 'object' && !(destObj instanceof Array)){
		destObjType = 'objectNotArray';
	}
	srcObjType = (""+srcObjType).replace(reg,(""+(patt1.exec(srcObjType))).toUpperCase());
	destObjType = (""+destObjType).replace(reg,(""+(patt2.exec(destObjType))).toUpperCase());
	return srcObjType.replace(",","")+"And"+destObjType.replace(",","");
};
var checkJsonParse =function(s){
	if(isNaN(s)){
		try{
			JSON.parse(s);
			return true;
		}catch(err){
			return false;
		}
	}else{
		/*
		空字符串，isNaN("")返回false，空字符串对应数字0
		纯数字字符串(String类型)，调用JSON.parse() 方法转换数字为Number类型,没有抛语法异常
		纯数字(Number类型)，调用JSON.parse() 方法转换数字为Number类型,没有抛语法异常
		这里，为适应本包逻辑，认为返回false
		*/
		return false;
	}
};

var checkSameDeepTypeAndExitDeepKey = function(originalObj,resultObj){
	assert.strictEqual((getArgumentType(originalObj,resultObj)),(getArgumentType(resultObj,originalObj)),'类型要相等');
	switch(getArgumentType(originalObj,resultObj)){
		case "StringAndString" :
			if( checkJsonParse(originalObj) && checkJsonParse(resultObj)){
				checkSameDeepTypeAndExitDeepKey(JSON.parse(originalObj),JSON.parse(resultObj));
			}else if( (checkJsonParse(originalObj)) && !(checkJsonParse(resultObj)) ){
				checkSameDeepTypeAndExitDeepKey(JSON.parse(originalObj),resultObj);
			}
			break;
		case "StringAndObjectNotArray" :
			break;
		case "StringAndArray" :
			break;			
		case "ObjectNotArrayAndString" :
		    break;
		case "ArrayAndString" :
		    break;
		case "ObjectNotArrayAndObjectNotArray" :
			if(JSON.stringify(originalObj)>2){
				for(var arg in resultObj){
					if(resultObj.hasOwnProperty(arg)){
						assert.property(originalObj,arg);
						checkSameDeepTypeAndExitDeepKey(originalObj[arg],resultObj[arg]);
					}
				}						
			}
			break;
		case "ObjectNotArrayAndArray" :

			break;
		case "ArrayAndObjectNotArray" :
			break;
		case "ArrayAndArray" :
			if(originalObj.length>0){
				for(var i in resultObj){
					if(resultObj.hasOwnProperty(i)){
						assert.property(originalObj,i);
						checkSameDeepTypeAndExitDeepKey(originalObj[i],resultObj[i]);
					}
				}						
			}
			break;
		default:
			break;
	}
};
var checkSameDeepKeyAndSameDeepValue= function(originalObj,exampleObj,resultObj){
	switch(getArgumentType(exampleObj,originalObj)){
		case "StringAndString" :
			if(originalObj.length<=0){
				assert.strictEqual(resultObj,exampleObj);
			}else{
				if(checkJsonParse(originalObj) && checkJsonParse(exampleObj)){
					checkSameDeepKeyAndSameDeepValue(JSON.parse(originalObj),JSON.parse(exampleObj),JSON.parse(resultObj));
				}else if( !(checkJsonParse(originalObj)) && !(checkJsonParse(exampleObj)) ){
					assert.strictEqual(resultObj,exampleObj);
				}else{
					assert.notStrictEqual(resultObj,exampleObj);
				}
			}
			break;
		case "StringAndObjectNotArray" :
			if(checkJsonParse(exampleObj)){
				checkSameDeepKeyAndSameDeepValue(originalObj,JSON.parse(exampleObj),resultObj);
			}else{
				assert.notStrictEqual(resultObj,exampleObj);
			}
			break;
		case "StringAndArray" :
			if(originalObj.length<=0){
				assert.strictEqual(resultObj.pop(),exampleObj);
			}else{
				if(checkJsonParse(exampleObj)){
					checkSameDeepKeyAndSameDeepValue(originalObj,JSON.parse(exampleObj),resultObj);
				}else{
					assert.notStrictEqual(resultObj,exampleObj);
				}
			}
			break;			
		case "ObjectNotArrayAndString" :
			if(checkJsonParse(originalObj)){
				checkSameDeepKeyAndSameDeepValue(JSON.parse(originalObj),exampleObj,JSON.parse(resultObj));
			}else{
				assert.notStrictEqual(resultObj,exampleObj);
			}
		    break;
		case "ArrayAndString" :
			if(originalObj.length<=0){
				for(var i in exampleObj){
					if(exampleObj.hasOwnProperty(i)){
						if(typeof exampleObj[i] ==='string' && exampleObj[i]>0){
							assert.strictEqual(resultObj,exampleObj[i]);
							break;
						}						
					}

				}
			}else{
				if(checkJsonParse(originalObj)){
					checkSameDeepKeyAndSameDeepValue(JSON.parse(originalObj),exampleObj,JSON.parse(resultObj));
				}else{
					assert.notStrictEqual(resultObj,exampleObj);
				}
			}
		    break;
		case "ObjectNotArrayAndObjectNotArray" :
			if(JSON.stringify(originalObj).length<=2){
				assert.deepEqual(resultObj,exampleObj);
			}else{
				for(var j in originalObj){
					if(originalObj.hasOwnProperty(j)){
						if(exampleObj.hasOwnProperty(j)){
							if( (typeof originalObj[j] ==='number' || typeof originalObj[j] ==='boolean') && typeof originalObj[j] === typeof exampleObj[j]){
								assert.strictEqual(resultObj[j],exampleObj[j]);
							}else{
								checkSameDeepKeyAndSameDeepValue(originalObj[j],exampleObj[j],resultObj[j]);
							}
						}	
					}
				}
			}
			break;
		case "ObjectNotArrayAndArray" :
			if(originalObj.length<=0){
				assert.deepEqual(resultObj.pop(),exampleObj);
			}else{
				for(var k in originalObj){
					if(originalObj.hasOwnProperty(k)){
						if(typeof originalObj[k] ==='number' || typeof originalObj[k] ==='boolean'){
							continue;
						}else{
							checkSameDeepKeyAndSameDeepValue(originalObj[k],exampleObj,resultObj[k]);
						}
					}
				}
			}
			break;
		case "ArrayAndObjectNotArray" :
			for(var m in exampleObj){
				if(exampleObj.hasOwnProperty(m)){
					if(JSON.stringify(originalObj).length<=2){
						if(typeof exampleObj[m] ==='object' && !(exampleObj[m] instanceof Array) && JSON.stringify(exampleObj[m])>2){
							assert.deepEqual(resultObj,exampleObj[m]);
							break;
						}
					}else{
						if(typeof exampleObj[m] ==='number' || typeof exampleObj[m] ==='boolean'){
							continue;
						}else{
							checkSameDeepKeyAndSameDeepValue(originalObj,exampleObj[m],resultObj);
						}
					}
				}
			}
			break;
		case "ArrayAndArray" :
			if(originalObj.length<=0){
				assert.deepEqual(resultObj,exampleObj);
			}else{
				for(var n in originalObj){
					if(originalObj.hasOwnProperty(n)){
						if(n<exampleObj.length){
							if( (typeof originalObj[n] ==='number' || typeof originalObj[n] ==='boolean') && typeof originalObj[n] === typeof exampleObj[n] ){
								assert.strictEqual(resultObj[n],exampleObj[n]);
							}else{
								checkSameDeepKeyAndSameDeepValue(originalObj[n],exampleObj[n],resultObj[n]);
							}
						}
					}
				}
			}
			break;
		default :
			break;
	}	
};	