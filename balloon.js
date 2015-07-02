/*-------------------------------表单提示气泡控件-------------------------------------|
|	构造函数-参数说明：
|	element	: 消息气泡提示所指向的网页元素，可通过document.getElementById等方法获取；
|	id	: 气泡唯一标识符，可以是任意个数的下划线数字与字母；
|	message	: 提示消息；
|	left	: 气泡位置偏移量，设置气泡左侧距离目标元素左侧的位置；
|	top	: 气泡位置偏移量，设置气泡顶部距离目标元素底部的位置，默认为6px；
|	timeout	: 设置气泡自动消失的时间，单位为毫秒，设置-1则不自动消失。默认值为-1；
|	scroll	: 设置页面是否滚动到目标元素所在位置，默认为不滚动(false)；
|
|	调用方法：
|	// 获取目标元素
|	var test = document.getElementById("test"); 
|	// 新建消息气泡对象
|	var ball = new balloon(test, 1, "Test Message..", 50, 10, 5000, true); 
|	ball.Show(); // 显示气泡，显示成功返回true。
|	ball.Remove(); // 移除气泡(动画)，移除成功返回true。若不希望移除有动画效果，可传入参数false：ball.Remove(false);
|	
|	注意：
|	1. 除了element与id外，其他属性均可不初始化；
|	2. 不需初始化的属性，构造函数中可填写null，若后面参数均为null，可省略，
|	例：var ball = new balloon(test, 1, "Test Message..");
|	3. 属性在new后仍可修改，通过 “对象名.属性名 = 值” 进行修改，例：ball.left = 10；
|	若气泡已经显示，可通过再次调用Show函数刷新显示。
|	4. 设定定时消失的气泡，计时时间从调用Show开始算起。若有多次调用Show(如上条)，
|	每次调用都将重新计时；
|	5. balloon弹出气泡后，可以使用balloon对象移除该气泡，也使用目标元素的ball属性
|	移除，ball属性即balloon对象副本，每次调用Show后均会被更新。
|---------------------------------------------------------------------------------------*/
balloon = function(element, id, message, left, top, timeout, scroll)
{
	// Init value
	this.timeout = -1;	// ms
	this.message = "";
	this.element = undefined;	
	this.id = "";
	this.left = 0;
	this.top = 6;
	this.scroll = false;
	
	if(!isNaN(timeout) && timeout == timeout)	this.timeout = parseInt(timeout);
	this.message = message;
	this.element = element;
	this.id = id;
	if(!isNaN(left) && left == left) this.left = parseInt(left);
	if(!isNaN(top) && top == top) this.top = parseInt(top);
	if(scroll != null && scroll != undefined) this.scroll = scroll;
};

balloon.prototype = {

	constructor : balloon,
	
	_timeouter : -1,
	_timerScroll : -1,
	
	Show : function(bRemove)
	{
		if(!this.element) return false;
		if(this.element.ball)
			this.element.ball.Remove(true);
		
		var balloon = document.getElementById("balloon_" + this.id)
		if(bRemove != undefined && !bRemove && balloon) return false;
		
		// 移除相同Id气泡
		if(balloon && balloon.element && balloon.element.ball)
			balloon.element.ball.Remove(true);
		else if(balloon)
			balloon.parentNode.removeChild(balloon);
		
		// 生成气泡
		balloon = document.createElement("div");
		balloon.className = "balloon";
		balloon.id = "balloon_" + this.id;
		var balloon_top = document.createElement("div");
		balloon_top.className = "balloon_top";
		var balloon_meg = document.createElement("div");
		balloon_meg.className = "balloon_meg";
		var balloon_txt = document.createElement("div");
		balloon_txt.className = "balloon_txt";
		var megs=document.createTextNode(this.message);
		
		balloon.appendChild(balloon_top);
		balloon.appendChild(balloon_meg);
		balloon_meg.appendChild(balloon_txt);
		balloon_txt.appendChild(megs);
		this.element.ball = this;
		balloon.element = this.element;
		
		document.getElementsByTagName("body")[0].appendChild(balloon);
		
		var node_view = document.getElementView(this.element);
		var node_top = document.getElementTop(this.element);
		var node_left = document.getElementLeft(this.element);
		
		// 设置气泡位置
		balloon.style.top = (node_top + node_view.height + this.top) + "px";
		balloon.style.left = (node_left + this.left) + "px";
		
		var mball = this;
		// 设置滚动到焦点
		if(this.scroll){
            this._timerScroll = setInterval(function(){
                var top =  node_top - 30 - document.getScrollXY().top;
                var left = node_left - 30 - document.getScrollXY().left;
                if(Math.abs(top) < 5 || Math.abs(left) < 5)
                {
                    clearInterval(mball._timerScroll);
					mball._timeouter = -1;
					mball.element.focus();
                }
                else
                {
                    top = document.getScrollXY().top + top / 5.0;
                    left = document.getScrollXY().left + left / 5.0;
                    scrollTo(left, top);
                }
            }, 10);
		}
		
		// 设置超时消失
		if(this.timeout > 0)
		{
			this._timeouter = setTimeout(function(){
				mball.Remove();
				if(mball._timerScroll > 0)
				{
					clearInterval(mball._timerScroll);
					mball._timerScroll = -1;
				}
				mball._timeouter = -1;
			}, this.timeout);
		}
		
		return true;
	},

	Remove : function(unanimated)
	{
		var id = this.id;
		var node = document.getElementById("balloon_" + id);
		
		// 清除移除倒计时
		if(this._timeouter > 0)
		{
			clearTimeout(this._timeouter);
			this._timeouter = -1;
		}
		
		// 清除滚动到焦点动作
		if(this._timerScroll > 0)
		{
			clearInterval(this._timerScroll);
			this._timerScroll = -1;
		}
		
		// 无动画清除气泡
		if(node && unanimated) 
		{
			node.parentNode.removeChild(node);
			return true;
		}
		// 动画清除气泡
		else if(node)
		{
			var h = document.getElementView(node.getElementsByTagName("div")[1]).height * 1.00;
			var w = document.getElementView(node.getElementsByTagName("div")[1]).width * 1.00;
			var timer = setInterval(function(){
				var n = node;
				h = h - 1;
				w = w - 1;
				if(h > 0)node.getElementsByTagName("div")[1].style.height = h + "px";
				if(w > 0)node.getElementsByTagName("div")[1].style.width = w + "px";
				if(h <= 0 || w <= 0) {node.parentNode.removeChild(node);clearInterval(timer);}
			}, 10);
			return true;
		}
		return false;
	},
	
	toString : function(){ return this.id + ", " + this.message; }
};

document.getElementView = function (element)
{
	if(element != document)
		return {
			width: element.offsetWidth,
			height: element.offsetHeight
		}
	if (document.compatMode == "BackCompat"){
		return {
			width: document.body.clientWidth,
			height: document.body.clientHeight
		}
	} else {
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		}
	}
};

document.getElementLeft = function (element)
{
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;
	while (current !== null){
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}
	return actualLeft;
};

document.getElementTop = function (element)
{
	var actualTop = element.offsetTop;
	var current = element.offsetParent;
	while (current !== null){
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}
	return actualTop;
};

document.getScrollXY = function() 
{ 
	var scrOfX = 0, scrOfY = 0; 
	if(typeof( window.pageYOffset ) == 'number' ) { 
		//Netscape compliant 
		scrOfY = window.pageYOffset; 
		scrOfX = window.pageXOffset; 
	} else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) { 
		//DOM compliant 
		scrOfY = document.body.scrollTop; 
		scrOfX = document.body.scrollLeft; 
	} else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) { 
		//IE6 standards compliant mode 
		scrOfY = document.documentElement.scrollTop; 
		scrOfX = document.documentElement.scrollLeft; 
	} 
	return {top:scrOfY, left:scrOfX};
};
