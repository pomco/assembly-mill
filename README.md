[![Build Status](https://travis-ci.org/pomco/assembly-mill.svg)](https://travis-ci.org/pomco/assembly-mill)
# asseambly-mill
*Assemble  data according to the designated  template file.*

---------------------
## example
> - file structure
``` schema     
         └──  home
               └── pomco
				├──  example.js
				└──  demo.json	
```
 > - demo.json 
*the designated file*
```js
{
      "zoo"  :  "",
      "canteen " : [
		{
			"name" : "star wark",
			"capacity" : 30,
			"food" : []
		 },
		{
			"name" : "",
			"capacity":0,
			"food":[]
		}
	],
	other : {
	}                                     
}                                                                
```
 > - example.js :
```js
var assembly = require('assembly-mill');
var obj = {
	"zoo" : "The South Zoo",
	"canteen" :[
		{"name" : "miss you"}
	]
};
var tm = assembly.regist('demo.json');
///**
//* in fact ,there some ways to passing the arg.</br>
//* its is up to you to choose whice way to passing the file.</br>
//* as show below :</br>
//*
//* var tmp = assembly.regist('demo.json');
//* or
//* var tmp = assembly.regist('/home/pomco/demo.json');
//* and so on
//*/	
tm.fill(obj);
console.log(tm.render());
```
 > - expected
*fillin  data accord to the file -->> "demo.json"*
```js
// `node example.js ` , then show as below:
{
      "zoo"  :  "The South Zoo",
      "canteen " : [
		{
			"name" : "miss you",
			"capacity" : 30,
			"food" : []
		 },
		{
			"name" : "",
			"capacity":0,
			"food":[]
		}
	],
	other : {
	}                                     
}  
```

------------
## install
```sh 
npm install  assembly-mill 
```

## usage
```js
var assembly = require('assembly-mill');
```
### assembly.regist(designatedfile)
*regist the designated file  ,then return an object*
#### @param  designatedfile
 - > designatedfile 
```illustration
 the file to pass in </br>
// absolute path (or maybe the full path)  --> "/home/pomco/demo.json"
// relative path+filename  --> "./../demo.json"  、"./demo.json"
// filename  -->"demo.json"
```

```js
var mill = assembly.regist("demo.json");
```
### mill.fill(obj)
*fillin data according the designated file , such as 'demo.json'*
#### @param  obj
 - > obj
```illustration
an object 
// contains keys and values, which maybe need to been modified </br>
// or added ,  maybe do nothing to change. </br>
// what  actually behavior to been showed is up on some rules.</br>
```

### mill.render()
*render the result , return an object.*


## about devlopment
- test the module
*mocha ,chai*
```sh
	npm test 
```
- test the systax or watch on some info in the backend
*grunt-contrib-jshint ,grunt-contrib-watch*
```sh
 	grunt
```
## more example 
- >  example_01.js
``` js
var assembly = require('assembly-mill');
var obj ={
	"canteen "[
		{
			"capacity" : 50,
		}
		{
			"food" : ["chicken","hotdog"]
		}
	]
};
var tm = assembly.regist('demo.json');
tm.fill(obj);
console.log(tm.render());
```
- > expected
	- before
	```js
{
      "zoo"  :  "",
      "canteen " : [
		{
			"name" : "star wark",
			"capacity" : 30,
			"food" : []
		 },
		{
			"name" : "",
			"capacity":0,
			"food":[]
		}
	],
	other : {
	}                                     
}   
	```
	- after
```js
{
      "zoo"  :  "",
      "canteen " : [
		{
			"name" : "star wark",
			"capacity" : 50,
			"food" : []
		 },
		{
			"name" : "",
			"capacity":0,
			"food":["chicken","hotdog"]
		}
	],
	other : {
	}                                     
} 
```  

## read more
### The  Rules
**The rules** *that affect expectations*
*as a matter of convenience , treated the designated file(such as 'demo.json')  as object named 'DemoObj' *
- Rule one 
	- conditons	 
		- conditons-01:  
	```dectiption
	(typeof DemoObj.key ==='string') && (typeof obj.key==='string') return true
	```
		- conditons-02:
	```dectiption
	 DemoObj.key.lentgh<=0 return true
	```
		- conditons-03:
	```dectiption
	 Both JSON.pase(DemoObj.key)  &&  JSON.pase(obj.key)   return friendly
	```
		- conditons-04:
	Both JSON.pase(DemoObj.key)  &&  JSON.pase(obj.key)  throw sysntax error
	- expected
```expected
a)  Bost  [conditons-01]  and [conditons-02]  retrun true,then `DemoObj.key =obj.key`
b) Bost  [conditons-01]  and [conditons-03] retrun true, then go on recursively.
c) Bost  [conditons-01]  and [conditons-04] retun true,then `DemoObj.key =obj.key`
d) others, nothing to change
```
- Rule two 
	- conditons	 
		- conditons-01:  
	```dectiption
	(typeof DemoObj.key ==='string') && (typeof obj.key==='object'  but not instanof  'Array' ) return true
	```
		- conditons-02:
	```dectiption
	  JSON.pase(DemoObj.key)   return friendly
	```

	- expected
```expected
a)  Bost  [conditons-01]  and [conditons-02]  retrun true,then go on recursively
b) others, nothing to change
```
- Rule three 
	- conditons	 
		- conditons-01:  
	```dectiption
	(typeof DemoObj.key ==='string') && (typeof obj.key==='object' and instanof Array) return true
	```
		- conditons-02:
	```dectiption
	 DemoObj.key.lentgh<=0 return true
	```
		- conditons-03:
	```dectiption
	 Both JSON.pase(DemoObj.key)    return friendly
	```
	- expected
```expected
a)  Bost  [conditons-01]  and [conditons-02]  retrun true,</br>
when  (typeof  DemoObj.key === typeof obj.key[index]  && obj.key[index].length>0) return true</br>
then `DemoObj.key =Obj.key` 
b) Bost  [conditons-01]  and [conditons-03] retrun true, then go on recursively.
c) others, nothing to change
```
- Rule four 
	- conditons	 
		- conditons-01:  
	```dectiption
	(typeof DemoObj.key ==='object' but not instanof Array) && (typeof obj.key==='String') return true
	```
		- conditons-02:
	```dectiption
	  JSON.pase(obj.key)   return friendly
	```
	- expected
```expected
a) Bost  [conditons-01]  and [conditons-03] retrun true, then go on recursively.
b) others, nothing to change
```

- Rule five 
	- conditons	 
		- conditons-01:  
	```dectiption
	(typeof DemoObj.key ==='object' but not instanof Array) && (typeof obj.key==='object' but not instanof Array) return true
	```
		- conditons-02:
	```dectiption
	 JSON.stringfity( DemoObj.key.lentgh).length<=2 return true
	```
		- conditons-03:
	```dectiption
	 (typeof DemoObj.key==='number' ||  typeof DemoObj.key==='boolen' ) return true
	```
	- expected
```expected
a)  Bost  [conditons-01]  and [conditons-02]  retrun true,then `DemoObj.key =obj.key`
b) Bost  [conditons-01]  and [conditons-03] retrun true, then `DemoObj.key =obj.key`
c) others, go on recursively
```

- Rule six 
	- conditons	 
		- conditons-01:  
	```dectiption
	(typeof DemoObj.key ==='object' but not instanof Array) && (typeof obj.key==='object'  and instanof Array) return true
	```
		- conditons-02:
	```dectiption
	JSON.stringfity( DemoObj.key.lentgh).length<=2 return true
	```
		- conditons-03:
	```dectiption
	  (typeof DemoObj.key==='number' ||  typeof DemoObj.key==='boolen' ) return true
	```
	- expected
```expected
a)  Bost  [conditons-01]  and [conditons-02]  retrun true,</br>
when (typeof obj.key[index] ==='object' but not instanof Array && JSON.stringfity(obj.key[index]),length>2) return true</br>
then `DemoObj.key =Obj.key[index]`
b) Bost  [conditons-01]  and [conditons-03] retrun true, then do nothing to change.
c) others, then go on recursively
```

- Rule seven 
	- conditons	 
		- conditons-01:  
	```dectiption
	(typeof DemoObj.key ==='object'  and instanof Array) && (typeof obj.key==='string' ) return true
	```
		- conditons-02:
	```dectiption
	 DemoObj.key.lentgh<=0 return true
	```
		- conditons-03:
	```dectiption
	JSON.parse(obj.key) return true  
	```
	- expected
```expected
a)  Bost  [conditons-01]  and [conditons-02]  retrun true, `DemoObj.key.push(obj.key)`
b) Bost  [conditons-01]  and [conditons-03] retrun true, then go on recursively.
c) others, do nothing change
```
- Rule eight 
	- conditons	 
		- conditons-01:  
	```dectiption
	(typeof DemoObj.key ==='object'  and instanof Array) && (typeof obj.key==='object' but not insanof Array) return true
	```
		- conditons-02:
	```dectiption
	 DemoObj.key.lentgh<=0 return true
	```
		- conditons-03:
	```dectiption
	   (typeof DemoObj.key[index]==='number' ||  typeof DemoObj.key[index]==='boolen' ) return true
	```
	- expected
```expected
a)  Bost  [conditons-01]  and [conditons-02]  retrun true, `DemoObj.key.push(obj.key)`
b) Bost  [conditons-01]  and [conditons-03] retrun true, then do nothing to change.
c) others, go on recursively
```

- Rule night 
	- conditons	 
		- conditons-01:  
	```dectiption
	(typeof DemoObj.key ==='object'  and instanof Array) && (typeof obj.key==='object' and insanof Array) return true
	```
		- conditons-02:
	```dectiption
	 DemoObj.key.lentgh<=0 return true
	```
		- conditons-03:
	```dectiption
	   (typeof DemoObj.key[index]==='number' ||  typeof DemoObj.key[index]==='boolen' ) return true
	```
	- expected
```expected
a)  Bost  [conditons-01]  and [conditons-02]  retrun true, `DemoObj.key = obj.key`
b) Bost  [conditons-01]  and [conditons-03] retrun true, `DemoObj.key = obj.key`
c) others, go on recursively
