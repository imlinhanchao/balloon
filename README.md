#气泡表单提示控件

##构造函数-参数说明：

element	: 消息气泡提示所指向的网页元素，可通过document.getElementById等方法获取；

id		: 气泡唯一标识符，可以是任意个数的下划线数字与字母；

message	: 提示消息；

left	: 气泡位置偏移量，设置气泡左侧距离目标元素左侧的位置；

top		: 气泡位置偏移量，设置气泡顶部距离目标元素底部的位置，默认为6px；

timeout	: 设置气泡自动消失的时间，单位为毫秒，设置-1则不自动消失。默认值为-1；

scroll	: 设置页面是否滚动到目标元素所在位置，默认为不滚动(false)；

##调用方法：

``` javascript
// 获取目标元素
var test = document.getElementById("test"); 
// 新建消息气泡对象
var Box = new balloon(test, 1, "Test Message..", 50, 10, 5000, true); 
// 显示气泡，显示成功返回true。
Box.Show(); 
// 移除气泡(动画)，移除成功返回true。
// 若不希望移除有动画效果，可传入参数false:Box.Remove(false);
Box.Remove();
```

##注意：

1. 除了element与id外，其他属性均可不初始化；

2. 不需初始化的属性，构造函数中可填写null，若后面参数均为null，可省略，例：

	``` javascript
		var Box = new balloon(test, 1, "Test Message..");
	```
	
3. 属性在new后仍可修改，通过 “对象名.属性名 = 值” 进行修改，例：Box.left = 10；若气泡已经显示，可通过再次调用Show函数刷新显示。

4. 设定定时消失的气泡，计时时间从调用Show开始算起。若有多次调用Show(如上条)，每次调用都将重新计时；

5. balloon弹出气泡后，可以使用balloon对象移除该气泡，也使用目标元素的box属性移除，box属性即balloon对象副本，每次调用Show后均会被更新。
