//---------------------------------------------------------
//声明变量
var imgList = document.getElementById('imgList');
var lis = imgList.children;
var span = imgList.getElementsByTagName('span');
var a = imgList.getElementsByTagName('a');
var img = document.getElementsByTagName('img');
var div = imgList.getElementsByTagName('div');

var strong = document.querySelectorAll('strong');

var prev = document.querySelector('.prev');
var next = document.querySelector('.next');

var cubeWrap = document.querySelector('.cubeWrap'); 
var cube = document.querySelector('.cube')
var divs = cube.getElementsByTagName('div');

var onOff = false;
var n = 0;//记录当前是第几张图片
var spaceOff = false;//记录当前是3D模型还是2D模型
var neat3d = false;
var keyOff = false;//判断键盘事件的触发


var winW = window.innerWidth;
var winH = window.innerHeight;
var liW = 160;
var liH = 100;


//---------------------------------------------------------
//第一次进入时要执行的函数

if (!spaceOff) {
	set2d();
	setTimeout(function () {
		rand();
	},3000);
	enter();
	changeSort();
	clickImg();
	clickA();
	bgcPos();
} else {
	
}
//点击3D按钮
strong[0].onclick = function () {
	n = 0;
	onOff = false;
	neat3d = false;
	strong[1].innerHTML = '平铺排序';
	strong[1].style.display = 'block';
	//先将imgList中的结构清空
	imgList.innerHTML = '';
	prev.style.display = next.style.display = 'none';
	if ( spaceOff ) {
		set2d();
		rand();
		enter();
		changeSort();
		clickImg();
		clickA();
		bgcPos();
		changePic();
		this.innerHTML = 'view3D';
	} else {
		set3D();
		rand3D();
		strong3d();
		enterLi();
		dblLi();
		next3d();
		prev3d();
		keyDown();
		this.innerHTML = 'view2D';
	}
	spaceOff = !spaceOff;
};

















//---------------------------------------------------------
//										2D转换
//2D结构的创建
function set2d() {
	for ( var i = 0; i < 25; i++ ) {
		var li = document.createElement('li');
		var a = document.createElement('a');
		var img = document.createElement('img');
		var span = document.createElement('span');
		
		a.href = 'javascript:;';
		img.src = 'img/'+ (i+1) +'.jpg';
		
		li.appendChild(a);
		li.appendChild(img);
		li.appendChild(span);
		imgList.appendChild(li);
	}
}

//随机排序
function rand() {
	var arrPos = randPos();
	for ( var i = 0; i < lis.length; i++ ) {
		mTween(lis[i],{left: arrPos[i][0],top: arrPos[i][1],rotateZ: arrPos[i][2]},1000,'easeBoth');
	};
}
//平铺排序
function tile() {
	var arrPos = tilePos();
	for ( var i = 0; i < lis.length; i++ ) {
		mTween(lis[i],{left: arrPos[i][0],top: arrPos[i][1],rotateZ: arrPos[i][2]},1000,'easeBoth');
	}
}
//封装随机位置的函数
function randPos() {
	var arr = [];
	var W = window.innerWidth;
	var H = window.innerHeight - 60;
	var w = 160;
	var h = 100;
	for ( i = 0; i < lis.length; i++ ) {
		var left = Math.random()*(W-w);
		var top = Math.random()*(H-h);
		var rotateZ = 30 - Math.random()*60;
		var rotateX = 30 - Math.random()*60;
		var rotateY = 30 - Math.random()*60;
		arr.push([left,top,rotateZ,rotateX,rotateY]);
	}
	return arr;
}
//封装平铺排序位置的函数
function tilePos() {
	var arr = [];
	var W = window.innerWidth;
	var H = window.innerHeight - 80;
	var w = 950;
	var h = 500;
	for ( i = 0; i < lis.length; i++ ) {
		var left = (W-w)/2+i%5*195;
		var top = (H-h)+parseInt(i/5)*100;
		var rotateZ = 30 - Math.random()*60;
		var rotateX = 30 - Math.random()*60;
		var rotateY = 30 - Math.random()*60;
		arr.push([left,top,rotateZ,rotateX,rotateY]);
	}
	return arr;
}
//点击strong[1] 切换平铺顺序
function changeSort() {
	strong[1].onclick = function () {
		if ( !onOff ) {
			this.innerHTML = '随机排序';
			tile();
		} else {
			this.innerHTML = '平铺排序';
			rand();
		}
		onOff = !onOff;
	}
}
//移入img 提升层级 图片放大 旋转0deg
function enter() {
	for ( var i = 0; i < lis.length; i++ ) {
		img[i].index = i;
		img[i].onmouseover = function () {
			lis[this.index].style.zIndex = 30;
			mTween(lis[this.index],{rotateZ: 0,scale: 120},800,'easeBoth');
		}
		img[i].onmouseout = function () {
			lis[this.index].style.zIndex = 1;
			mTween(lis[this.index],{rotateZ: 30 - Math.random()*60,scale: 100},800,'easeBoth');
		}
	}
}
//控制a和span标签的背景图位置

function bgcPos() {
	for ( var i = 0; i < img.length; i++ ) {
		a[i].style.backgroundPosition = ''+ -(i%5*160) +'px '+ -(parseInt(i/5)*100) +'px';
		span[i].style.backgroundPosition = ''+ -(i%5*160) +'px '+ -(parseInt(i/5)*100) +'px';
	}
}
//双击图片 图片切换
//实在随机排序下的
function clickImg() {
	for ( var i = 0; i < img.length; i++ ) {
		img[i].index = i;
		img[i].ondblclick = function () {
			n = this.index+1;
			prev.style.display = next.style.display = 'block';
			strong[1].style.display = 'none';
			for ( var i = 0; i < lis.length; i++ ) {
				img[i].onmouseover = img[i].onmouseout = null;
				a[i].style.zIndex = 10;
				mTween(img[i],{opacity: 0},1000,'easeBoth');
				a[i].style.backgroundImage = 'url('+ this.src +')';
				mTween(a[i],{opacity: 100},500,'easeBoth');
				mTween(lis[i],{scale: 100, rotateZ: 0},500,'easeBoth',function () {
					for ( var i = 0; i < lis.length; i++ ) {
						mTween(lis[i],{left: (winW-liW*5)/2+i%5*160, top: (winH-liH*5-80)+parseInt(i/5)*100},1000,'easeBoth');
					}
				});
			}
		};
	}
}
//双击a标签  还原原来的照片

function clickA() {
	for ( var i = 0; i < lis.length; i++ ) {
		a[i].ondblclick = function () {
			onOff = false;
			prev.style.display = next.style.display = 'none';
			strong[1].style.display = 'block';
			strong[1].innerHTML = '平铺排序';
			for ( var i = 0; i < lis.length; i++ ) {
				a[i].style.zIndex = 3;
				img[i].style.display = 'block';
				mTween(img[i],{opacity: 100},500,'easeBoth');
				mTween(a[i],{opacity: 0},1000,'easeBoth',function () {
					for ( var i = 0; i < lis.length; i++ ) {
						a[i].style.backgroundImage = '';
					}
				});
				rand();
				enter();
			}
		};
	}
}
//点击btn 进行图片切换

function changePic() {
	prev.onclick = next.onclick = null;
	prev.onmouseover = next.onmouseover = function () {
		mTween(this,{scale: 90},500,'easeBoth');
	}
	prev.onmouseout = next.onmouseout = function () {
		mTween(this,{scale: 80},500,'easeIn');
	}
	
}
//------------------------------------------------------------------------------------
//										3D转换
//创建3D的结构
function set3D() {
	for ( var i = 0; i < 25; i++ ) {
		var li = document.createElement('li');
		li.style.left = (winW - liW)/2 + 'px';
		li.style.top = (winH - liH)/2 - 60 + 'px';
		var arr2 = [];
 		for ( var j = 0; j < 6; j++ ) {
			var div = document.createElement('div');
			div.style.backgroundImage = 'url(img/'+ (i+1) +'.jpg)';
			if ( j == 0 ) {
				div.style.backgroundSize = '160px 100px';
			}
			li.appendChild(div);
		};
		imgList.appendChild(li);
	}
}

//3D下随机排序 随机旋转一定角度
function rand3D() {
	var arrPos = randPos();
	for ( var i = 0; i < lis.length; i++ ) {
		mTween(lis[i],{left: arrPos[i][0],top: arrPos[i][1],rotateZ: arrPos[i][2],rotateY: arrPos[i][3],rotateX: arrPos[i][4]},1000,'easeBoth');
	};
}
//3D下平铺排序
function tile3D() {
	var arrPos = tilePos();
	for ( var i = 0; i < lis.length; i++ ) {
		mTween(lis[i],{left: arrPos[i][0],top: arrPos[i][1],rotateZ: arrPos[i][2],rotateY: arrPos[i][3],rotateX: arrPos[i][4]},1000,'easeBoth');
	}
}
//鼠标移入li 层级提升 X旋转为0deg
//鼠标移出li 层级还原 旋转随机
function enterLi() {
	for ( var i = 0; i < lis.length; i++ ) {
		lis[i].onmouseover = function () {
			this.style.zIndex = 30;
			mTween(this,{rotateX: 0,scale: 120},800,'easeBoth');
		}
		lis[i].onmouseout = function () {
			this.style.zIndex = 1;
			mTween(this,{rotateX: 30 - Math.random()*6,scale: 100},800,'easeBoth');
		}
	}
}

//点击平铺排序和随机排序
function strong3d() {
	strong[1].onclick = function () {
		if ( !onOff ) {
			this.innerHTML = '随机排序';
			tile3D();
		} else {
			this.innerHTML = '平铺排序';
			rand3D();
		}
		onOff = !onOff;
	}
}
//双击li 拼装成大图
function dblLi() {
	var div1 = document.querySelectorAll('li div:nth-of-type(1)');
	for ( var i = 0; i < lis.length; i++ ) {
		lis[i].index = i;
		lis[i].ondblclick = function () {
			n = this.index + 1;
			if ( !neat3d ) {
				fn1();
			} else {
				fn2();
			}
			neat3d = !neat3d;
		};
		//在分散图的时候的点击//合成图片层级问题有待修改
		function fn1() {
			//创建二维数组 讲li放入其中
			var arr = [];
			for ( var i = 0; i < 5; i++ ) {
				var arr2 = [];
				for ( j = 0; j < 5; j++ ) {
					arr2.push(lis[i*5+j]);
				}
				arr.push(arr2);
			}
			//改变层级关系
			
			
			prev.style.display = next.style.display = 'block';
			strong[1].style.display = 'none';
			for ( var i = 0; i < div.length; i++ ) {
				div[i].style.backgroundImage = 'url(img/'+ n +'.jpg)';
			}
			for ( var i = 0; i < lis.length; i++ ) {
				div1[i].style.backgroundSize = '800px 500px';
				div1[i].style.backgroundPosition = ''+ -(i%5*160) +'px '+ -(parseInt(i/5)*100) +'px';
				lis[i].onmouseover = lis[i].onmouseout = null;
				mTween(lis[i],{rotateZ: 360 - Math.random()*720,rotateY: 360 - Math.random()*720,rotateX: 360 - Math.random()*720,scale: 100},1000,'easeBoth',function () {
					for ( var i = 0; i < lis.length; i++ ) {
						mTween(lis[i],{left: (winW-liW*5)/2+i%5*160,top: (winH-liH*5-80)+parseInt(i/5)*100,rotateX: 0,rotateY: 0,rotateZ: 0},1000,'easeBoth');
					}
				});
			}
		};
		//在整齐的时候点击//这里有个卡顿问题
		function fn2() {
			prev.style.display = next.style.display = 'none';
			strong[1].style.display = 'block';
			strong[1].innerHTML = '平铺排序';
			onOff = false;
			for ( var i = 0; i < lis.length; i++ ) {
				var div = lis[i].getElementsByTagName('div');
				for ( var j = 0; j < div.length; j++ ) {
					div[j].style.backgroundImage = 'url(img/'+ (i+1) +'.jpg)';
					div[j].style.backgroundPosition = '';
					if ( j == 0 ) {
						div[j].style.backgroundSize = '160px 100px';
					}
				}
			}
			for ( var i = 0; i < lis.length; i++ ) {
				mTween(lis[i],{left: Math.random()*(winW - liW), top: Math.random()*(winH - liH - 60),rotateZ: 30 - Math.random()*60,rotateY: 30 - Math.random()*60,rotateX: 30 - Math.random()*60,zIndex: 1},1000,'easeBoth');
			}
			enterLi();
		}
	}
}


//点击下一张//屏幕闪光问题
function next3d() {
	next.onclick = function () {
		n++;
		if ( n > lis.length ) {
			n = 1;
		}
		for ( var i = 0; i < lis.length; i++ ) {
			mTween(lis[i],{left: Math.random()*(winW - liW), top: Math.random()*(winH - liH - 60),rotateZ: 30 - Math.random()*60,rotateY: 30 - Math.random()*60,rotateX: 30 - Math.random()*60},1000,'easeBoth',function () {
				for ( var i = 0; i < div.length; i++ ) {
					div[i].style.backgroundImage = 'url(img/'+ n +'.jpg)';
				}
				for ( var i = 0; i < lis.length; i++ ) {
					mTween(lis[i],{rotateZ: 360 - Math.random()*720,rotateY: 360 - Math.random()*720,rotateX: 360 - Math.random()*720,scale: 100},1000,'easeBoth',function () {
					for ( var i = 0; i < lis.length; i++ ) {
						mTween(lis[i],{left: (winW-liW*5)/2+i%5*160,top: (winH-liH*5-80)+parseInt(i/5)*100,rotateX: 0,rotateY: 0,rotateZ: 0},1000,'easeOut');
					}
				});
				}
			});
		};
	};
}
//点击下一张 
function prev3d() {
	prev.onclick = function () {
		n--;
		if ( n < 1 ) {
			n = lis.length;
		}
		var arrPos = randPos();
		for ( var i = 0; i < lis.length; i++ ) {
			mTween(lis[i],{left: Math.random()*(winW - liW), top: Math.random()*(winH - liH - 60),rotateZ: 30 - Math.random()*60,rotateY: 30 - Math.random()*60,rotateX: 30 - Math.random()*60},1000,'easeBoth',function () {
				for ( var i = 0; i < div.length; i++ ) {
					div[i].style.backgroundImage = 'url(img/'+ n +'.jpg)';
				}
				for ( var i = 0; i < lis.length; i++ ) {
					mTween(lis[i],{rotateZ: 360 - Math.random()*720,rotateY: 360 - Math.random()*720,rotateX: 360 - Math.random()*720,scale: 100},1000,'easeBoth',function () {
					for ( var i = 0; i < lis.length; i++ ) {
						mTween(lis[i],{left: (winW-liW*5)/2+i%5*160,top: (winH-liH*5-80)+parseInt(i/5)*100,rotateX: 0,rotateY: 0,rotateZ: 0},1000,'easeOut');
					}
				});
				}
			});
		};
	}
}


//键盘事件
function keyDown() {
	document.onkeydown = function (ev) {
		if ( ev.ctrlKey ) {
			keyOff = true;
		} 
	}
	imgList.onclick = function () {
		if (keyOff) {
			prev.style.display = next.style.display = 'none';
			strong[1].style.display = 'none';
			imgList.style.display = 'none';
			cubeWrap.style.display = 'block';
			for ( var i = 0; i < divs.length; i++ ) {
				divs[i].style.backgroundImage = 'url(img/'+ n +'.jpg)';
			}
			keyOff = !keyOff;
		}
	}
	cubeWrap.onclick = function () {
		if (keyOff) {
			strong[1].style.display = 'block';
			prev.style.display = next.style.display = 'block';
			imgList.style.display = 'block';
			cubeWrap.style.display = 'none';
		}
		keyOff = !keyOff;
	}
	
}










