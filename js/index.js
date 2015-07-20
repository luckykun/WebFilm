window.onload  = function(){
	film.ui.showtime();//显示时间
	film.ui.Tobanner();//图片轮播
    film.ui.slideTop();//优惠活动向上滑动
    film.ui.changeNav();//顶部导航+index页面按钮点击事件
    film.ui.getindexMovie();//加载‘正在热映’和即将上映的电影
    film.ui.loadNews();//获取最新动态列表
}

var film ={};
film.tools={};
film.tools.getStyle = function(obj,attr) {
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }
    else{
        return getComputedStyle(obj,false)[attr];
    }
}
film.tools.fadeIn = function(obj){ /*淡入函数，显示当前图片*/
    var iCur = film.tools.getStyle(obj,'opacity');
    if(iCur==1){ 
        return false; 
    }
    var value = 0;
    clearInterval(obj.finishtimer);
    obj.finishtimer = setInterval(function() {
        var ispeed = 5;
        if (value == 100) {
           clearInterval(obj.finishtimer);
        }
        else {
           value = value + ispeed;
           obj.style.opacity = value/100;
           obj.style.filter = 'alpha(opacity='+value+')';
        }    
    }, 30);
}
film.tools.fadeOut = function(obj) {/*淡出函数，隐藏其它函数*/
    var iCur = film.tools.getStyle(obj,'opacity');
    if(iCur==0){ 
        return false; 
    }
    var value = 100;
    clearInterval(obj.finishtimer);
    obj.finishtimer = setInterval(function() {
        var ispeed = -5;
        if (value == 0) {
           clearInterval(obj.finishtimer);
        }
        else {
           value = value + ispeed;
           obj.style.opacity = value/100;
           obj.style.filter = 'alpha(opacity='+value+')'; 
        }    
    }, 30);
}
film.tools.showmsg=function(txt,t){//显示提示信息的函数，txt是内容，t是显示时间
    $("body").append("<div class='showmsg'>" + txt + "</div>");//在body后面插入showmsg的div
    $(".showmsg").fadeIn().delay(t*1000).fadeOut(200,function(){
        $(".showmsg").remove();//用完之后删掉此div
    });
}

film.tools.loadplaying=function(index){//获取一个电影的信息（正在热映）
    $.ajax({
        url: "https://api.douban.com/v2/movie/subject/"+index,    
        data: $.extend({
            id: '12345',
            _ : Math.floor(Date.parse(new Date())/100000)
        }, {
            'dpc': 1
        }),
        cache: false,                                    
        dataType: "jsonp",
        success: function(d) {
            var playing_html='';
            var img_path='',movie_name='',douban_average='',movie_contry='';
            var movie_type='',movie_director='',movie_casts='',movie_timeArr=[],movie_summa='';

            img_path =d.images.medium;//赋值电影图片
            movie_name =d.title;//赋值电影名字
            douban_average=d.rating.average;//赋值豆瓣评分
            movie_contry=d.countries.toString().split(',').join('/');
            movie_type=d.genres.toString().split(',').join('/');
            var directors_len=d.directors.length;
            if(directors_len==1){
                movie_director=d.directors[0].name;//设置电影导演
            }
            else{
                for(var i=1;i<directors_len;i++){
                    movie_director=movie_director+'/'+d.directors[i].name;
                }
                movie_director =d.directors[0].name+movie_director;//设置电影导演
            }
            var casts_len=d.casts.length;
            if(casts_len==1){
                movie_casts=d.casts[0].name;//设置电影主演名字
            }
            else{
                for(var i=1;i<casts_len;i++){
                    movie_casts=movie_casts+'/'+d.casts[i].name;
                }
                movie_casts =d.casts[0].name+movie_casts;//设置电影主演名字
            }
            var text_summary=d.summary;

            var time1 = "<span>7:00</span><span>8:45</span><span>9:10</span><span>12:10</span><span>12:30</span><span>12:50</span><span>18:20</span>";
            var time2 = "<span>6:45</span><span>8:15</span><span>9:40</span><span>19:30</span><span>20:30</span><span>22:30</span>";
            var time3 = "<span>7:30</span><span>10:45</span><span>13:10</span><span>16:45</span>";
            var time4 = "<span>8:45</span><span>11:00</span><span>12:10</span><span>15:30</span><span>17:30</span>";
            var time5 = "<span>8:00</span><span>8:45</span><span>9:10</span><span>19:50</span>";
            var time6 = "<span>7:00</span><span>10:45</span><span>12:10</span><span>15:50</span><span>17:30</span><span>19:15</span>";
            var time7 = "<span>6:45</span><span>8:00</span><span>9:45</span><span>12:10</span><span>15:30</span><span>16:40</span><span>18:10</span><span>20:35</span>";
            var time8 = "<span>7:45</span><span>11:00</span><span>12:45</span><span>18:10</span><span>20:30</span><span>22:10</span>";
            movie_timeArr=[time1,time2,time3,time4,time5,time6,time7,time8];
            var j = parseInt(7*Math.random());
            var movie_time = movie_timeArr[j];
            
            playing_html = "<div class='playing_movie'><a target='_blank' class='movie_pic' href="+"'http://movie.douban.com/subject/"+index+"/'>"+"<img src='"+img_path+"'></a><div class='movie_detail'><h2>"+movie_name+"<span class='douban_average'>豆瓣评分:</span><span>"+douban_average+"</span></h2><h4>国家:<span>"+movie_contry+"</span>类型:<span>"+movie_type+"</span></h4><h4>导演:<span>"+movie_director+"</span></h4><h4>主演:<span>"+movie_casts+"</span></h4><p class='play_time'>"+movie_time+"</p><p class='movie_intro'>剧情简介</p><p class='movie_summa'>"+text_summary+"</p><p class='summary_bg'><img src='images/summary_bg.png'/><p></div></div>";
            $(".playing_info").append(playing_html);
        }
    });
}

film.tools.loadcoming =function(index){
    $.ajax({
        url: "https://api.douban.com/v2/movie/subject/"+index,    
        data: $.extend({
            id: '12345',
            _ : Math.floor(Date.parse(new Date())/100000)
        }, {
            'dpc': 1
        }),
        cache: false,                                    
        dataType: "jsonp",
        success: function(d) {
            var coming_html='';
            var img_link='',img_path='',movie_name='',movie_contry='',movie_year='';
            var movie_type='',movie_director='',movie_casts='',movie_summa='';

            img_link =d.alt;
            img_path =d.images.medium;
            movie_name =d.title;
            movie_year = d.year;
            movie_contry=d.countries.toString().split(',').join('/');
            movie_type=d.genres.toString().split(',').join('/');
            movie_summa =d.summary;
            var directors_len=d.directors.length;
            if(directors_len==1){
                movie_director=d.directors[0].name;//设置电影导演
            }
            else{
                for(var i=1;i<directors_len;i++){
                    movie_director=movie_director+'/'+d.directors[i].name;
                }
                movie_director =d.directors[0].name+movie_director;//设置电影导演
            }
            var casts_len=d.casts.length;
            if(casts_len==1){
                movie_casts=d.casts[0].name;//设置电影导演
            }
            else{
                for(var i=1;i<casts_len;i++){
                    movie_casts=movie_casts+'/'+d.casts[i].name;
                }
                movie_casts =d.casts[0].name+movie_casts;//设置电影导演
            }
            var favo_classname='favo_link',favoidStr='',favoidArr=[];
            if(!$.cookie("name") || $.cookie("name") == 'null'){//没有用户登录
                favo_classname ='favo_link';
                loadOne();
            }
            else{//有用户登录
                var userid =$.cookie('userid');
                AV.initialize("9ovy0ez2i1odrxhz6n78l8s1v6jtzgvlluu35qewd6c9tjhv", "2o2ypw6wrt6skzqqcoei7pg0m63by0jee4cbfsk3t2rvor2j");
                AV.Query.doCloudQuery('select favo_movieID from Users where user_id='+userid, {
                    success: function(msg){
                        favoidStr = msg.results[0]._serverData.favo_movieID;
                        favoidArr =favoidStr.split(',');
                        var flag = $.inArray(index.toString(),favoidArr);//判断当前电影是否已经被用户设为喜欢(若有返回数组下标)
                        if(flag != -1){//已经为喜欢，改class名，设为红色背景
                            favo_classname ='favo_linked';
                            loadOne();
                        }else{
                            favo_classname ='favo_link';
                            loadOne();
                        }
                    },
                    error:function(error){
                        console.log("Error:"+error.description);
                    }
                });
            }
            function loadOne(){//加载一个电影信息
                coming_html ='<div class="coming_movie"><a target="_blank" class="movie_pic" href="'+img_link+'"><img src="'+img_path+'"></a><div class="movie_detail"><h2 class="h2_title" movieid='+index+'>'+movie_name+'<span>('+movie_contry+')</span></h2><h4>年份:<span>'+movie_year+'</span></h4><h4>类型:<span>'+movie_type+'</span></h4><h4>导演:<span>'+movie_director+'</span></h4><h4>主演:<span>'+movie_casts+'</span></h4><p class="movie_intro">剧情简介</p><a class="'+favo_classname+'" href="javascript:;" title="点赞"></a><p class="favo_add">收藏成功</p><p class="movie_summa">'+movie_summa+'</p><p class="summary_bg"><img src="images/summary_bg.png"/><p></div></div>';
                $(".coming_info").append(coming_html);
            }
        }
    });
}

film.ui={};
film.ui.showtime=function(){//动态显示时间函数
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

film.ui.Tobanner=function(){//图片自动轮播函数
	var lists =$(".banner_pic ul li");
	var iNow = 0;
    var finishtimer = setInterval(pictureNext, 4000);
    function pictureNext(){/*顺序轮播的函数（从左到右）*/ 
    	if (iNow == lists.length-1){
            iNow = 0;
        }
        else{
            iNow++;
        }
        for(var i= 0;i< lists.length;i++){
            film.tools.fadeOut(lists[i]); /*隐藏不是当前的其他图片*/
        } 
        film.tools.fadeIn(lists[iNow]);/* 显示当前的图片*/
    }
    function picturePrev(){/*顺序轮播的函数（从左到右）*/ 
    	if (iNow == 0){
            iNow = lists.length-1;
        }
        else{
            iNow --;
        }  
        for(var i= 0;i< lists.length;i++){
            film.tools.fadeOut(lists[i]); /*隐藏不是当前的其他图片*/
        } 
        film.tools.fadeIn(lists[iNow]);/* 显示当前的图片*/
    }
    $(".banner_pic").delegate(".prev","mouseover",function(){
    	$(".prev_link").css("display","block");
    	clearInterval(finishtimer);
    });
    $(".banner_pic").delegate(".prev","mouseout",function(){
    	$(".prev_link").css("display","none");
    	finishtimer=setInterval(pictureNext, 4000);
    });
    $(".banner_pic").delegate(".next","mouseover",function(){
    	$(".next_link").css("display","block");
    	clearInterval(finishtimer);
    });
    $(".banner_pic").delegate(".next","mouseout",function(){
    	$(".next_link").css("display","none");
    	finishtimer=setInterval(pictureNext, 4000);
    });
    $(".prev_link").click(function(){
    	picturePrev();
    });
    $(".next_link").click(function(){
    	pictureNext();
    });//图片滚动区域函数
}

film.ui.slideTop=function(){
    var finishtimer =setInterval(changetext,40);
    $(".text_content").mouseover(function(){
        clearInterval(finishtimer);
    });
    $(".text_content").mouseout(function(){
        finishtimer =setInterval(changetext,40);
    });
    function changetext(){
        var ispeed =-1;
        var txttop1 =parseInt($('.text1').css('top'));
        var txttop2 =parseInt($('.text2').css('top'));
        if(txttop1 == -385){
            txttop1 =395;
        }
        if(txttop2 == -385){
            txttop2=395;
        }
        txttop1=txttop1+ispeed;
        txttop2=txttop2+ispeed;
        $('.text1').css('top',txttop1+'px');
        $('.text2').css('top',txttop2+'px');
    }
}

film.ui.changeNav=function(){/*切换顶部导航事件*/
    film.ui.clickEventIndex();/*绑定首页的按钮点击事件*/
    $(".nav_index").click(function(){
        window.location.href="index.html?lable=index";
    });
    $(".nav_news").click(function(){
        window.location.href="index.html?lable=news";
    });
    $(".nav_movies").click(function(){
        window.location.href="index.html?lable=movies";
    });
    var href=window.location.href;//获取浏览器地址
    if(href.indexOf('?')==-1){//不存在？标志，属于index页面
        $("#index_content").css("display","block");
        $("#news_content").css("display","none");
        $("#movies_content").css("display","none");
        $(".nav_area a").removeClass("active");
        $("a.nav_index").addClass("active");
    }else{
        var lable=href.split('?')[1].split('=')[1];
        if(lable=='index'){
            $("#index_content").css("display","block");
            $("#news_content").css("display","none");
            $("#movies_content").css("display","none");
            $(".nav_area a").removeClass("active");
            $("a.nav_index").addClass("active");
        }
        else if(lable=='news'){
            $("#index_content").css("display","none");
            $("#news_content").css("display","block");
            $("#movies_content").css("display","none");
            $(".nav_area a").removeClass("active");
            $("a.nav_news").addClass("active");
            document.title = 'jarson影院- 新闻动态';
        }
        else if(lable=='movies'){
            $("#index_content").css("display","none");
            $("#news_content").css("display","none");
            $("#movies_content").css("display","block");
            $(".nav_area a").removeClass("active");
            $("a.nav_movies").addClass("active");
            document.title = 'jarson影院-电影仓库'
            film.ui.chooseCate();//电影加载和分类事件
        }
    }
    
}

film.ui.clickEventIndex=function(){/*绑定首页的按钮点击事件*/
    $(".playing").click(function(){//点击正在上映按钮
        $(".playing_info").css("display","block");
        $(".coming_info").css("display","none");
        $(this).addClass("active");
        $(".coming").removeClass("active");
    });
    $(".coming").click(function(){//点击即将上映按钮
        $(".coming_info").css("display","block");
        $(".playing_info").css("display","none");
        $(this).addClass("active");
        $(".playing").removeClass("active");
    });
    $(".coming_info").delegate("a.favo_link","click",function(){//点赞按钮点击事件
        var me =$(this);
        if(!$.cookie("name") || $.cookie("name") == 'null'){//没有用户登录
            film.tools.showmsg("请先去个人空间登陆!",2);
        }
        else{//收藏成功，电影id存入数据库
            AV.initialize("9ovy0ez2i1odrxhz6n78l8s1v6jtzgvlluu35qewd6c9tjhv", "2o2ypw6wrt6skzqqcoei7pg0m63by0jee4cbfsk3t2rvor2j");
            var id =$.cookie("userid");
            var Users = AV.Object.extend("Users");//获取Uses表
            AV.Query.doCloudQuery('select objectId,favo_movieID from Users where user_id='+id, {
                success: function(msg){
                    var objectid = msg.results[0].id;
                    var favoIDstr = msg.results[0]._serverData.favo_movieID;
                    var favo_id = me.parent().find('.h2_title').attr('movieid');
                    favoIDstr = favoIDstr+',' +favo_id;
                    var query = new AV.Query(Users);
                    query.get(objectid, {
                        success: function(user) {  
                            user.save({
                                favo_movieID:favoIDstr
                            });
                            me.next().animate({top:'-16px',opacity:'1'}).delay(500).fadeOut();
                            me.addClass('favo_linked').removeClass('favo_link');
                        },
                        error:function(error){
                            console.log("Error:"+error.description);
                        }
                    });
                }
            });
        }
    });
    $(".coming_info").delegate("a.favo_linked","click",function(){//点赞按钮点击事件
        film.tools.showmsg("你已经收藏过了^_^",2);
    });
    $(".right_movie_info").delegate('.movie_intro','mouseover',function(){//绑定剧情简介显示事件
        $(this).parent().find(".movie_summa").css("display","block");
        $(this).parent().find(".summary_bg").css("display","block");
    });
    $(".right_movie_info").delegate('.movie_summa','mouseover',function(){
        $(this).parent().find(".movie_summa").css("display","block");
        $(this).parent().find(".summary_bg").css("display","block");
    });
    $(".right_movie_info").delegate('.summary_bg','mouseover',function(){
        $(this).parent().find(".movie_summa").css("display","block");
        $(this).parent().find(".summary_bg").css("display","block");
    });
    $(".right_movie_info").delegate('.movie_intro','mouseout',function(){
        $(this).parent().find(".movie_summa").css("display","none");
        $(this).parent().find(".summary_bg").css("display","none");
    });
    $(".right_movie_info").delegate('.movie_summa','mouseout',function(){
        $(this).parent().find(".movie_summa").css("display","none");
        $(this).parent().find(".summary_bg").css("display","none");
    });
    $(".right_movie_info").delegate('.summary_bg','mouseout',function(){
        $(this).parent().find(".movie_summa").css("display","none");
        $(this).parent().find(".summary_bg").css("display","none");
    });
    $(".close_btn").bind('click',function(){//登录窗口点击关闭按钮
        $(".login_area").fadeOut('slow');
        $(".whole_bg").fadeOut('slow');
    });
}

film.ui.loadNews=function(){//获取News表的数据
    AV.initialize("9ovy0ez2i1odrxhz6n78l8s1v6jtzgvlluu35qewd6c9tjhv", "2o2ypw6wrt6skzqqcoei7pg0m63by0jee4cbfsk3t2rvor2j");//链接数据库
    AV.Query.doCloudQuery('select count(*), * from News', {
        success: function(d){
            var results = d.results;
            var link_html ='<li class="li_head">最新动态</li>';
            $(".news_lists").html(link_html);
            var content_html='';
            for(var i=0;i<d.count;i++){
                var txt_title =results[i]._serverData.news_title;
                var txt_time =results[i]._serverData.news_time;
                var links_html ="<li><a href='javascript:;'>"+txt_title+"</a><span>"+txt_time+"</span></li>";
                $(".news_lists").append(links_html);//填充完左边的动态导航项
            }
            $(".news_lists li:eq(1)").addClass("linked");
            $(".news_wrap").html("<h2>"+results[0]._serverData.news_title+"</h2><h4>"+results[0]._serverData.news_time+"</h4>"+results[0]._serverData.news_content);
            $(".news_lists li").each(function(i){
                $(this).click(function(){//点击列表事件
                    $(".news_lists li").removeClass("linked");
                    $(this).addClass("linked");
                    var txt_title =results[i-1]._serverData.news_title;
                    var txt_time =results[i-1]._serverData.news_time;
                    var txt_content =results[i-1]._serverData.news_content;
                    content_html= "<h2>"+txt_title+"</h2><h4>"+txt_time+"</h4>"+txt_content;
                    $(".news_wrap").html(content_html);
                });
            });
        },
        error: function(error){
            console.log(error.description);
        }
    });
}


film.ui.getindexMovie=function(){
    film.tools.loadplaying(10741834);
    film.tools.loadplaying(26101065);
    film.tools.loadplaying(6846893);//
    film.tools.loadplaying(25972353);
    film.tools.loadplaying(24875534);//
    film.tools.loadplaying(26259634);//
    film.tools.loadplaying(24737155);//
    film.tools.loadplaying(24987018);
    film.tools.loadplaying(20427364);
    film.tools.loadplaying(6875611);
    film.tools.loadplaying(25718082);
    film.tools.loadplaying(20514902);

    setTimeout(function(){//加载即将上映
        film.tools.loadcoming(26323678);//
        film.tools.loadcoming(10741643);
        film.tools.loadcoming(26280556);
        film.tools.loadcoming(26335743);
        film.tools.loadcoming(19971593);
        film.tools.loadcoming(6873042);//
        film.tools.loadcoming(3680627);
        film.tools.loadcoming(25932073);
        film.tools.loadcoming(26348959);//
        film.tools.loadcoming(26339762);
        film.tools.loadcoming(26378829);//
        film.tools.loadcoming(26381387);
        film.tools.loadcoming(26220733);
        film.tools.loadcoming(25786077);
        film.tools.loadcoming(26345722);
        film.tools.loadcoming(10440138);
    },3000);  
}

film.ui.getmoviesArea=function(url){//url为请求地址;
    $.ajax({
        url: url,    
        data: $.extend({
            id: '12345',
            _ : Math.floor(Date.parse(new Date())/100000)
        }, {
            'dpc': 1
        }),
        cache: false,                                    
        dataType: "jsonp",
        success: function(d) {
            var results =d.subjects;
            var movie_pic,movie_title,movie_href;
            var movie_html='',len,num;
            if(d.total == 0){
                $(".movie_area").html(d.title);
            }
            else{
                if(d.count>d.total){//获取到的个数小于默认个数
                    len=d.total;
                    num=d.total;
                    $("#pages_area").css("display","none");
                }
                else{
                    len=d.count;
                    num=30;//设置每页默认显示30条；
                }
                for(var i=0;i<len;i++){//调用一次接口显示30条信息
                    movie_pic =results[i].images.medium;
                    movie_title =results[i].title;
                    movie_href =results[i].alt;
                    movie_html =movie_html+"<li class='one_movie'><p class='one_pic'><a target='_blank' href='"+movie_href+"'><img src='"+movie_pic+"'></a></p><p class='one_title' title='"+movie_title+"'>"+movie_title+"</p></li>";
                }
                $(".movie_area").html(movie_html);
            }
            $(function(){
                $("#pages_area").jPages({
                    containerID:'movie_area',
                    first:'首页',
                    last:'尾页',
                    previous:'上一页',
                    next:'下一页',
                    perPage:num,
                    startPage:1,
                    midRange:5
                });
            }); 
        }
    });
}

film.ui.chooseCate=function(){//选择分类函数
    film.ui.getmoviesArea("https://api.douban.com/v2/movie/top250?count=250");//首先加载出一些电影
    $(".cate_contry span").click(function(){
        $("#movie_area").html('<p class="img"><img src="images/loading.gif"/></p>');
        var tag_info1=$(this).text();
        $(".all_movie").removeClass("selected");
        $(".cate_contry span").removeClass("selected");
        $(this).addClass("selected");
        if($(".cate_story span.selected").length!=0){//剧情类别已经选择过
            var tag_info2=$(".cate_story span.selected").text();
            var url_link='https://api.douban.com/v2/movie/search?tag='+tag_info1+tag_info2;
            film.ui.getmoviesArea(url_link);
        }
        else{
            var url_link='https://api.douban.com/v2/movie/search?tag='+tag_info1;
            film.ui.getmoviesArea(url_link);
        }
    });
    $(".cate_story span").click(function(){
        $("#movie_area").html('<p class="img"><img src="images/loading.gif"/></p>');
        var tag_info2=$(this).text();
        $(".all_movie").removeClass("selected");
        $(".cate_story span").removeClass("selected");
        $(this).addClass("selected");
        if($(".cate_contry span.selected").length!=0){//国家类别已经选择过
            var tag_info1=$(".cate_contry span.selected").text();
            var url_link='https://api.douban.com/v2/movie/search?tag='+tag_info1+tag_info2;
            film.ui.getmoviesArea(url_link);
        }
        else{
            var url_link='https://api.douban.com/v2/movie/search?tag='+tag_info2;
            film.ui.getmoviesArea(url_link);
        }
    });
    $(".search_link").click(function(){
        $(".category span").removeClass("selected");
        $(".all_movie").removeClass("selected");
        var url_link ='https://api.douban.com/v2/movie/search?q='+$(".txt_input").val();
        $("#movie_area").html('<p class="img"><img src="images/loading.gif"/></p>');
        film.ui.getmoviesArea(url_link);
    });
    $(".all_movie").click(function(){
        $(".category span").removeClass("selected");
        $(this).addClass("selected");
        $("#movie_area").html('<p class="img"><img src="images/loading.gif"/></p>');
        film.ui.getmoviesArea('https://api.douban.com/v2/movie/top250?count=250');
    });
}




