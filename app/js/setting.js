'use strict';

/*子进程*/
const ipcRenderer=require('electron').ipcRenderer;
$(document).ready(function(){

	/*窗口准备好时子进程发送消息给父进程*/
	ipcRenderer.send('ready-setting-window');

	/*事件监听器绑定点击关闭窗口事件*/
	var closeWindow=document.querySelector('#closeWindow');
	closeWindow.addEventListener('click',function(){
		ipcRenderer.send('close-setting-window');
	});

	/*定义文件系统*/
	var fs=require('fs');
	/*获取页面元素id*/
	var btnSave=document.querySelector('#btnSave');
	var btnReset=document.querySelector('#btnReset');
	var appName=document.querySelector('#appName');
	var appFullPath=document.querySelector('#appFullPath');
	var fontColor=document.querySelector('#fontColor');
	var btnColor1=document.querySelector('#btnColor1');
	var btnColor2=document.querySelector('#btnColor2');

	/*通过接受消息从父进程中获取当前按钮id*/
	var applicationId;
	var application;

	ipcRenderer.on('get-app-id',function(event,appId){
		applicationId=appId;
		/*读取本地json文件获取当前按钮属性并显示到页面中*/
	  	fs.readFile(__dirname+"/json/application.json","utf8",function (err,bytesRead) {
	    	if (err) throw err;

	    	console.log(__dirname);
	    	application=JSON.parse(bytesRead);
	    	var appLength=application.application.length;

        	for(var i = 0; i<appLength; i++){
    			if(appId==application.application[i].id){
          			appName.value=application.application[i].name;
          			appFullPath.value=application.application[i].fullPath;
          			fontColor.value=application.application[i].fontColor;
          			btnColor1.value=application.application[i].btnColor1;
          			btnColor2.value=application.application[i].btnColor2;
        		}
      		}
		});
	});

	btnReset.addEventListener('click',function(){
		appName.value="application"+applicationId;
		appFullPath.value=null;
		fontColor.value="#FFFFFF";
		btnColor1.value="#337AB6";
		btnColor2.value="#28608F";
	})


	/*当点击保存按钮时，如果按钮属性有所改动，则将其保存到本地json文件中*/
	btnSave.addEventListener('click',function(){
		if(appName.value!=application.application[applicationId].name){
			application.application[applicationId].name=appName.value;
		}

		if(appFullPath.value!=application.application[applicationId].fullPath){
			application.application[applicationId].fullPath=appFullPath.value;
		}

		if(fontColor.value!=application.application[applicationId].fontColor){
			application.application[applicationId].fontColor=fontColor.value;
		}

		if(btnColor1.value!=application.application[applicationId].btnColor1){
			application.application[applicationId].btnColor1=btnColor1.value;
		}

		if(btnColor2.value!=application.application[applicationId].btnColor2){
			application.application[applicationId].btnColor2=btnColor2.value;
		}

		/*将json对象application转换为json字符串*/
		var applicationToStr=JSON.stringify(application);

		fs.writeFile(__dirname+"/json/application.json",applicationToStr,"utf8",function(err){
			if(err) throw err;
			console.log("File Saved!")
			/*保存修改之后将修改后的数据发送到父进程*/
			var btnData={"btnId":applicationId,"appName":appName.value,"fontColor":fontColor.value,"btnColor1":btnColor1.value,"btnColor2":btnColor2.value};
			ipcRenderer.send('app-setting-changed',btnData);
		})

	});







});
