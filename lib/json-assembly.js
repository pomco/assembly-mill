'use strict';
var readConfig = require('read-config');
var Assembly = function (){
	return new Assembly.fn.init();
};
(function(){
	Assembly.fn = Assembly.prototype = {
		init : function(){
			return this ;
		},
		regist : function(fileName){
			return new Assembly.fn.regist.fn.init(fileName);
		}
	};
	Assembly.fn.init.prototype = Assembly.fn;
	Assembly.fn.regist.fn = Assembly.fn.prototype ={
		template : {},
		init : function(fileName){
			this.template = {};
			var opt = {
				basedir : "./"
			};
			var config = readConfig(fileName,opt);
			this.template = config;
			return this;
		},
		render : function(){
			return this.template;
		},
		fill : function(obj){
			this.point = [];
			this.attr =[];
			this.point.push(this.template);
			Assembly.fn.regist.fillIn(this.point,this.attr,obj,this.template);
			delete this.point;
			delete this.attr;
		} 
	};
	Assembly.fn.regist.fn.init.prototype = Assembly.fn.regist.fn;
	Assembly.fn.regist.fillIn = function(point,attr,srcObj,destObj){
		if((typeof srcObj !=='object' && typeof srcObj !=='string') || (typeof destObj !=='object' && typeof destObj !=='string')){
			return;
		}
		switch(Assembly.fn.regist.getArgumentType(srcObj,destObj)){
			case "StringAndString" :
				Assembly.fn.regist.fillInWhenStringAndString(point,attr,srcObj,destObj);
				break;
			case "StringAndObjectNotArray" :
				Assembly.fn.regist.fillInWhenStringAndObjectNotArray(point,attr,srcObj,destObj);
				break;
			case "StringAndArray" :
				Assembly.fn.regist.fillInWhenStringAndArray(point,attr,srcObj,destObj);
				break;			
			case "ObjectNotArrayAndString" :
				Assembly.fn.regist.fillInWhenObjectNotArrayAndString(point,attr,srcObj,destObj);
			    break;
			case "ArrayAndString" :
				Assembly.fn.regist.fillInWhenArrayAndString(point,attr,srcObj,destObj);
			    break;
			case "ObjectNotArrayAndObjectNotArray" :
				Assembly.fn.regist.fillInWhenObjectNotArrayAndObjectNotArray(point,attr,srcObj,destObj);
				break;
			case "ObjectNotArrayAndArray" :
				Assembly.fn.regist.fillInWhenObjectNotArrayAndArray(point,attr,srcObj,destObj);
				break;
			case "ArrayAndObjectNotArray" :
				Assembly.fn.regist.fillInWhenArrayAndObjectNotArray(point,attr,srcObj,destObj);
				break;
			case "ArrayAndArray" :
				Assembly.fn.regist.fillInWhenArrayAndArray(point,attr,srcObj,destObj);
				break;
			default :
				break;
		}
	};

	Assembly.fn.regist.getArgumentType= function(srcObj,destObj){
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
	Assembly.fn.regist.checkJsonParse =function(s){
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
	Assembly.fn.regist.copyObject = function(fromObj,toPoint){
		var obj = fromObj;
		if(typeof fromObj !=='object'){
			if(Assembly.fn.regist.checkJsonParse(fromObj)){
				obj = JSON.parse(fromObj);
			}
		}
		for(var arg in obj){
			if(obj.hasOwnProperty(arg)){
				toPoint[arg] = obj[arg];
			}	
		}
	};
	Assembly.fn.regist.fillInWhenStringAndString = function(point,attr,srcObj,destObj){
		if(typeof srcObj ==='string' && typeof destObj ==='string'){
			if(destObj.length<=0){
				point[point.length-1][attr[attr.length-1]] =srcObj;
			}else{
				if(Assembly.fn.regist.checkJsonParse(destObj) && Assembly.fn.regist.checkJsonParse(srcObj)){
					point[point.length-1][attr[attr.length-1]] ={};
					Assembly.fn.regist.copyObject(JSON.parse(destObj),point[point.length-1][attr[attr.length-1]]);
					var obj = point[point.length-1][attr[attr.length-1]];
					point.push(obj);
					Assembly.fn.regist.fillIn(point,attr,JSON.parse(srcObj),obj);
					point.pop();
					point[point.length-1][attr[attr.length-1]] = JSON.stringify(point[point.length-1][attr[attr.length-1]]);
					
				}else if(!Assembly.fn.regist.checkJsonParse(destObj) && !Assembly.fn.regist.checkJsonParse(srcObj)){
					point[point.length-1][attr[attr.length-1]] =srcObj;
				}		
			}
		}else{// 类型不匹配，跳出
			return;
		}
	};
	Assembly.fn.regist.fillInWhenStringAndObjectNotArray = function(point,attr,srcObj,destObj){
		if(typeof srcObj ==='string' && typeof destObj ==='object' && !(destObj instanceof Array)){
			if(Assembly.fn.regist.checkJsonParse(srcObj)){
				Assembly.fn.regist.fillIn(point,attr,JSON.parse(srcObj),destObj);
			}
		}else{
			return;
		}
	};
	Assembly.fn.regist.fillInWhenStringAndArray = function(point,attr,srcObj,destObj){
		if(typeof srcObj ==='string' && typeof destObj ==='object' && (destObj instanceof Array)){
			if(destObj.length<=0){
				point[point.length-1].push(srcObj);
			}else{
				if(Assembly.fn.regist.checkJsonParse(srcObj)){
					Assembly.fn.regist.fillIn(point,attr,JSON.parse(srcObj),destObj);
				}
			}
		}else{
			return;
		}
	};
	Assembly.fn.regist.fillInWhenObjectNotArrayAndString = function(point,attr,srcObj,destObj){
		if(typeof srcObj ==='object' && !(srcObj instanceof Array) && typeof destObj ==='string'){
			if(Assembly.fn.regist.checkJsonParse(destObj)){
				point[point.length-1][attr[attr.length-1]] ={};
				Assembly.fn.regist.copyObject(JSON.parse(destObj),point[point.length-1][attr[attr.length-1]]);
				var obj = point[point.length-1][attr[attr.length-1]];
				point.push(obj);
				Assembly.fn.regist.fillIn(point,attr,srcObj,obj);
				point.pop();
				point[point.length-1][attr[attr.length-1]] = JSON.stringify(point[point.length-1][attr[attr.length-1]]);		
			}
		}else{
			return;
		}
	};
	Assembly.fn.regist.fillInWhenArrayAndString = function(point,attr,srcObj,destObj){
		if(typeof srcObj ==='object' && (srcObj instanceof Array) && typeof destObj ==='string'){
			if(destObj.length<=0){
				for(var i in srcObj){
					if(srcObj.hasOwnProperty(i)){
						if(typeof srcObj[i] ==='string' && srcObj[i].length>0){
							point[point.length-1][attr[attr.length-1]] =srcObj[i];
							break;
						}					
					}
				}
			}else{
				if(Assembly.fn.regist.checkJsonParse(destObj)){
					point[point.length-1][attr[attr.length-1]] ={};
					Assembly.fn.regist.copyObject(JSON.parse(destObj),point[point.length-1][attr[attr.length-1]]);
					var obj = point[point.length-1][attr[attr.length-1]];
					point.push(obj);
					Assembly.fn.regist.fillIn(point,attr,srcObj,obj);
					point.pop();
					point[point.length-1][attr[attr.length-1]] = JSON.stringify(point[point.length-1][attr[attr.length-1]]);
				}			
			}
		}else{
			return;
		}
	};
	Assembly.fn.regist.fillInWhenObjectNotArrayAndObjectNotArray = function(point,attr,srcObj,destObj){
		if(typeof srcObj ==='object' && !(srcObj instanceof Array) && typeof destObj ==='object' &&!(destObj instanceof Array)){
			if(JSON.stringify(destObj).length<=2){
				point[point.length-2][attr[attr.length-1]] =srcObj;
			}else{
				for(var arg in destObj){
					if(destObj.hasOwnProperty(arg)){
						if(srcObj.hasOwnProperty(arg)){
							if((typeof destObj[arg] === 'number' ||typeof destObj[arg] ==='boolean') && typeof destObj[arg] === typeof srcObj[arg]){
								destObj[arg] = srcObj[arg];
							}else{
								attr.push(arg);
								if(typeof destObj[arg] ==='object'){
									point.push(destObj[arg]);
								}
								Assembly.fn.regist.fillIn(point,attr,srcObj[arg],destObj[arg]);
								attr.pop();
								if(typeof destObj[arg] ==='object'){
									point.pop();
								}
								
							}
						}
					}
				}
			}
		}else{
			return;
		}
	};
	Assembly.fn.regist.fillInWhenObjectNotArrayAndArray =function(point,attr,srcObj,destObj){
		if(typeof srcObj ==='object' && !(srcObj instanceof Array) && typeof destObj ==='object' && (destObj instanceof Array)){
			if(destObj.length<=0){
				point[point.length-1].push(srcObj);
			}else{
				for(var i in destObj){
					if(destObj.hasOwnProperty(i)){
						if(typeof destObj[i] === 'number' || typeof destObj[i] ==='boolean' ){
							continue;
						}else{
							attr.push(i);
							if(typeof destObj[i] ==='object'){
								point.push(destObj[i]);
							}
							Assembly.fn.regist.fillIn(point,attr,srcObj,destObj[i]);
							attr.pop();
							if(typeof destObj[i] ==='object'){
								point.pop();
							}
						}
					}
				}
			}
		}else{
			return;
		}
	};
	Assembly.fn.regist.fillInWhenArrayAndObjectNotArray = function(point,attr,srcObj,destObj){
		if(typeof srcObj ==='object' && (srcObj instanceof Array) && typeof destObj ==='object' && !(destObj instanceof Array)){
			for(var i in srcObj){
				if(srcObj.hasOwnProperty(i)){
					if(JSON.stringify(destObj).length<=2){
						if(typeof srcObj[i] ==='object' && !(srcObj[i] instanceof Array) && JSON.stringify(srcObj[i]).length>2){
							point[point.length-2][attr[attr.length-1]] = srcObj[i];
							break;
						}
					}else{
						if(typeof srcObj[i] ==='number' || typeof srcObj[i] ==='boolean'){
							continue;
						}else{
							Assembly.fn.regist.fillIn(point,attr,srcObj[i],destObj);
						}
					}
				}
			}
		}else{
			return;
		}
	};
	Assembly.fn.regist.fillInWhenArrayAndArray = function(point,attr,srcObj,destObj){
		if(typeof srcObj ==='object' && (srcObj instanceof Array) && typeof destObj ==='object' && (destObj instanceof Array) ){
			if(destObj.length<=0){
				for(var j in srcObj){
					if(srcObj.hasOwnProperty(j)){
						point[point.length-1].push(srcObj[j]);
					}	
				}
			}else{
				for(var i in destObj){
					if(destObj.hasOwnProperty(i)){
						if(i<srcObj.length){
							if((typeof destObj[i] === 'number' ||typeof destObj[i] ==='boolean') && typeof destObj[i] === typeof srcObj[i]){
								destObj[i] = srcObj[i];
							}else{
								attr.push(i);
								if(typeof destObj[i] ==='object'){
									point.push(destObj[i]);
								}
								Assembly.fn.regist.fillIn(point,attr,srcObj[i],destObj[i]);
								attr.pop();
								if(typeof destObj[i] ==='object'){
									point.pop();
								}
							}					
						}
					}
				}		
			}
		}else{
			return;
		}
	};
})();
module.exports = Assembly();
