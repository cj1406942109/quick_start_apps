'use strict';

const ipcRenderer=require('electron').ipcRenderer;

$(document).ready(function(){

	/*绑定事件监听器响应点击关闭窗口事件*/
	var closeWindow=document.querySelector('#closeWindow');
	closeWindow.addEventListener('click',function(){
		ipcRenderer.send('close-main-window');
	});
	/*绑定事件监听器响应点击最小化窗口事件*/
	var minimizeWindow=document.querySelector('#minimizeWindow');
	minimizeWindow.addEventListener('click',function(){
		ipcRenderer.send('minimize-main-window');
	});

	/*获取页面上所有button*/
	var appButtons=document.querySelectorAll('.btn-block');

	/*对button进行遍历，读取json文件确定其样式*/

	/*读取json文件*/
	var fs=require('fs');
	var application;
	var appLength;


	fs.readFile(__dirname+"/json/application.json","utf8",function (err,bytesRead) {
		if (err) throw err;
		console.log(__dirname);
    	application=JSON.parse(bytesRead);
    	appLength=application.application.length;

    	/*json文件中保存了按钮的样式时，使用json文件数据，否则使用默认样式*/
    	for(var i=0;i<appLength;i++){
    		console.log(i);
    		var item = application.application[i];
    		appButtons[i].innerHTML=item.name;
    		appButtons[i].style.backgroundColor=item.btnColor1;
			appButtons[i].style.Color=item.fontColor;
			appButtons[i].addEventListener('mouseover',function(event){
				var currentTarget = event.currentTarget;
				currentTarget.style.backgroundColor=application.application[currentTarget.value].btnColor2;
			});
			appButtons[i].addEventListener('mouseout',function(event){
				var currentTarget = event.currentTarget;
				currentTarget.style.backgroundColor=application.application[currentTarget.value].btnColor1;
			});
    	}
	});

	for(var i=0;i<appButtons.length;i++){

		/*绑定事件，双击时打开第三方应用*/
		appButtons[i].addEventListener('dblclick',function(){
			var btnId=this.value;
			fs.readFile(__dirname+"/json/application.json","utf8",function (err,bytesRead) {
				if (err) throw err;
		    	application=JSON.parse(bytesRead);
		    	appLength=application.application.length;
		    	for(var j = 0; j<appLength; j++){
    				if(btnId==application.application[j].id){
          				ipcRenderer.send('open-application',application.application[j].fullPath);
        			}
      			}

			});

		});

		/*绑定事件，右击时打开设置界面*/
		appButtons[i].addEventListener('mousedown',function(event){
			if(event.button==2){
				var id=this.value;
				ipcRenderer.send('open-setting-window',id);
			}
		});

	}

	/*接收到消息，改变按钮样式*/
	ipcRenderer.on('change-button-show',function(event,btnData){
		var changeButton=document.querySelector("#btn"+btnData.btnId);
		changeButton.innerHTML=btnData.appName;
		changeButton.style.backgroundColor=btnData.btnColor1;
		changeButton.style.Color=btnData.fontColor;
		changeButton.addEventListener('mouseover',function(){
			changeButton.style.backgroundColor=btnData.btnColor2;
		});
		changeButton.addEventListener('mouseout',function(){
			changeButton.style.backgroundColor=btnData.btnColor1;
		});
	})
});

