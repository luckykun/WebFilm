window.onload = function(){
	about.tools.showtime();
	about.tools.showMap();
	about.app.changeNav();
}

var about ={};
about.tools = {};
about.tools.showtime =function(){
    displaytime();
    setInterval(displaytime,1000);
    function displaytime(){
        var Numbers = [];
        for(var i=0;i<10;i++){
            Numbers[i] = new Image();
            Numbers[i].src= "images/Numbers/" + i + ".gif"; //把Numbers数组里存放1——9的图片；
        }
        var Now = new Date();
        var time = [];
        var hrs = Now.getHours();
        hrs=(hrs<10 ? '0' : '') + hrs;//hrs存放的是小时数（两位）；
        time[0]= hrs.charAt(0);//time数组的第一位存放hrs的第一个字符；
        time[1] = hrs.charAt(1);//time数组的第二位存放hrs的第二个字符；
        var mins = Now.getMinutes();
        mins = (mins < 10 ? '0' : '') + mins;
        time[2] = mins.charAt(0);
        time[3] = mins.charAt(1);
        var secs = Now.getSeconds();
        secs = (secs <10 ? '0' : '')+ secs;
        time[4] = secs.charAt(0);
        time[5] = secs.charAt(1);
        for(var i = 0; i< time.length;i++){
            var number= document.getElementById('d'+i);
            number.src=Numbers[time[i]].src;
            number.alt=time[i];
        }
    }
}

about.tools.showMap =function(){
	//创建和初始化地图函数：
	function initMap(){
	    createMap();//创建地图
	    setMapEvent();//设置地图事件
	    addMapControl();//向地图添加控件
	    addMarker();//向地图中添加marker
	}

	function createMap(){
	    var map = new BMap.Map("dituContent");//在百度地图容器中创建一个地图
	    var point = new BMap.Point(103.996398,30.585144);//定义一个中心点坐标
	    map.centerAndZoom(point,17);//设定地图的中心点和坐标并将地图显示在地图容器中
	    window.map = map;//将map变量存储在全局
	}

	function setMapEvent(){
	    map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
	    map.disableScrollWheelZoom();//禁用地图滚轮放大缩小，默认禁用(可不写)
		map.enableDoubleClickZoom();//启用鼠标双击放大，默认启用(可不写)
		map.enableKeyboard();//启用键盘上下左右键移动地图
	}

	function addMapControl(){
		var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
		map.addControl(ctrl_nav);
		var ctrl_ove = new BMap.OverviewMapControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT,isOpen:1});
		map.addControl(ctrl_ove);
	}

	var markerArr = [{title:"jarson个人影院",content:"网站作者地址：成都信息工程学院。",point:"103.995958|30.585812",isOpen:1,icon:{w:21,h:21,l:0,t:0,x:6,lb:5}}
	];

	function addMarker(){
		for(var i=0;i<markerArr.length;i++){
			var json = markerArr[i];
			var p0 = json.point.split("|")[0];
			var p1 = json.point.split("|")[1];
			var point = new BMap.Point(p0,p1);
			var iconImg = createIcon(json.icon);
			var marker = new BMap.Marker(point,{icon:iconImg});
			var iw = createInfoWindow(i);
			var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
			marker.setLabel(label);
			map.addOverlay(marker);
			label.setStyle({
	            borderColor:"#808080",
	            color:"#333",
	            cursor:"pointer"
	        });
				 
			(function(){
				var index = i;
				var _iw = createInfoWindow(i);
				var _marker = marker;
				_marker.addEventListener("click",function(){
					this.openInfoWindow(_iw);
				});
				_iw.addEventListener("open",function(){
					_marker.getLabel().hide();
				})
				_iw.addEventListener("close",function(){
					_marker.getLabel().show();
				})
				label.addEventListener("click",function(){
					_marker.openInfoWindow(_iw);
				})
				if(!!json.isOpen){
					label.hide();
					_marker.openInfoWindow(_iw);
				}
			})();
	    }
	}
	    //创建InfoWindow
	function createInfoWindow(i){
	    var json = markerArr[i];
	    var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");
	        return iw;
	    }
	    //创建一个Icon
	function createIcon(json){
	    var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
	    return icon;
	}
	initMap();//创建和初始化地图
}


about.app = {};
about.app.changeNav=function(){//切换到航事件
	$(".nav_index").click(function(){
        window.location.href="index.html?lable=index";
    });
    $(".nav_news").click(function(){
        window.location.href="index.html?lable=news";
    });
    $(".nav_movies").click(function(){
        window.location.href="index.html?lable=movies";
    });
}