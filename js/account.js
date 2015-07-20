window.onload=function(){
    account.app.isLogin();//判断是否已经有账户登录
	account.app.changeNav();
    account.app.showtime();
    account.app.bindAccountEvent();
}

var account={
    apikey:'0065ba4916e7596001312edb44b60c20',
    secret:'46189a38878e00c9',
    callbackurl:'http://www.jzkjarson.com/WebFilm/account.html'
};
account.tools={};

account.tools.loadLoginSuccess =function(index){//登陆成功，加载内容
    /*$(".owner_title").html('^_^欢迎您，<span id="txt_name">'+$.cookie("name")+'</span><span class="login_out">退出登录</span>');
    $(".login_area input").val('');
    $(".login_area").fadeOut('slow');
    $(".whole_bg").fadeOut('slow');
    account.tools.clickEventOwn();*/
    account.tools.showmsg("恭喜您，登陆成功!",1);
    setTimeout(function(){
        window.location.href=account.callbackurl;
    },1500); 
}

account.tools.loadfavoMovie=function(m_id){//加载一个喜欢的电影
    $.ajax({
        url: "https://api.douban.com/v2/movie/subject/"+m_id,    
        data: $.extend({
            id: '12345',
            _ : Math.floor(Date.parse(new Date())/100000)
        }, {
            'dpc': 1
        }),
        cache: false,                                    
        dataType: "jsonp",
        success: function(rsp) {
            var m_href,m_pic,m_name,m_average,m_contry,m_director,m_type;
            var area1_html='';
            m_pic =rsp.images.medium;
            m_href =rsp.alt;
            m_name =rsp.title;
            m_average =rsp.rating.average;
            m_contry=rsp.countries.toString().split(',').join('/');
            m_director=rsp.directors[0].name;
            m_type=rsp.genres.toString().split(',').join('/');

            area1_html='<div class="one_movie"><div class="movie_pic"><a target="_blank" href="'+m_href+'"><img src="'+m_pic+'"></a></div><div class="movie_detail"><h2>'+m_name+'</h2><p>国家:<span id="m_contry">'+m_contry+'</span></p><p>导演:<span id="m_director">'+m_director+'</span></p><p>类型:<span id="m_type">'+m_type+'</span></p><p>豆瓣评分:<span id="db_point">'+m_average+'</span></p></div></div>';
            $(".area_1").append(area1_html);
        }
    });
}
account.tools.loadArea1=function(id){
    AV.initialize("9ovy0ez2i1odrxhz6n78l8s1v6jtzgvlluu35qewd6c9tjhv", "2o2ypw6wrt6skzqqcoei7pg0m63by0jee4cbfsk3t2rvor2j");//链接数据库
    AV.Query.doCloudQuery('select favo_movieID from Users where user_id='+id, {
        success: function(d){
            var results =d.results;
            var movieIdStr =results[0]._serverData.favo_movieID;
            var movieIdArr =[];
            if(movieIdStr.indexOf(',')!=-1){
                movieIdArr = movieIdStr.split(',');
            }
            movieIdArr.push(movieIdStr);//获取电影id的数组

            for(var i=0;i< movieIdArr.length;i++){
                var movieid=movieIdArr[i];
                account.tools.loadfavoMovie(movieid);
            }
            $(".area_1").append('<p class="clearfix"></p>');
        },
        error: function(error){
            //查询失败，查看 error
            console.log(error);
        }
    });
}

account.tools.loadArea2 =function(id){
    if(!$.cookie("name") || $.cookie("name") == 'null'){//没有用户登录
        return false;
    }
    else{
        AV.initialize("9ovy0ez2i1odrxhz6n78l8s1v6jtzgvlluu35qewd6c9tjhv", "2o2ypw6wrt6skzqqcoei7pg0m63by0jee4cbfsk3t2rvor2j");
        AV.Query.doCloudQuery('select * from Users where user_id='+id, {
            success: function(d){
                var results =d.results;
                var name = results[0]._serverData.user_name;
                var phone = results[0]._serverData.user_phone;
                var email = results[0]._serverData.user_email;
                var desc = results[0]._serverData.user_desc;
                
                $(".u_name span").text(name);
                $(".u_phone span").text(phone);
                $(".u_email span").text(email);
                $(".u_desc span").text(desc);
            },
            error: function(error){
                //查询失败，查看 error
                console.log(error);
            }
        });
    }
}

account.tools.loadArea3 =function(){
    String.prototype.replaceAll=function (AFindText,ARepText){  //给string类扩展全部替换的方法；
        raRegExp=new RegExp(AFindText,"g");
        return this.replace(raRegExp,ARepText);
    }
    var XlabelArr =[];//横坐标显示的数组
    var flagArr =[];//用于判断哪一天的毫秒数
    var YcountArr =[147,345,179,180,0];//访问次数
    var daytime =24*60*60*1000;
    var nowtime = new Date();
    var today_start =new Date(nowtime.getFullYear() + '/' + (nowtime.getMonth()+1) +'/'+ nowtime.getDate()).getTime();//今日凌晨的毫秒数
    var today_end = today_start+daytime;
    for(var i =4;i>=0;i--){
        var dateLabel = new Date(today_start-(i*daytime));
        dateLabel = dateLabel.toLocaleDateString().replaceAll('/','-');
        XlabelArr.push(dateLabel);
    }
    for(var i=5;i>=0;i--){
        var flagtime = today_end -(i*daytime);
        flagArr.push(flagtime);
    }
    for(var i =0;i<=4;i++){
        if(nowtime.getTime() >= flagArr[i] && nowtime.getTime() < flagArr[i+1]){//判断属于哪一天的访问量
            var index = i;
            var storage = window.localStorage;
            if(!storage.pagecount){
                storage.pagecount = 0;
            }
            storage.pagecount = parseInt(storage.pagecount)+1;
            YcountArr[index] = parseInt(storage.pagecount);
        }
    }
    $("#container").highcharts({// 图表展示容器的id名称
        chart: {
            type:'column'//图表展示的类型，默认是line，线性，还有cloumn，列形。
        },
        title: {
            text:'jfiojggjierj',style:{color:'#fff'}//图表的名称
        },
        xAxis: {
            categories:XlabelArr//图表的x坐标的字段
        },
        yAxis: {
            title:{
                text:'单位（个）'//图表y轴的提示信息（解释信息，单位等等）
            }
        },
        series: [{ //制定数据列
            name: $.cookie('name'), //数据列名
            data: YcountArr //数据值
        }]
    });
}

account.tools.loadArea4 =function(){

}

account.tools.clickEventOwn=function(){//绑定个人空间页面的所有事件
    $(".owner_area").delegate('.login_out','click',function(){//"退出登录"按钮事件
        var date = new Date();
        date.setTime(date.getTime() + (30 * 60 * 1000));//30分钟过期
        $.cookie("name",null,{path:"/",expires:date,domain:'www.jzkjarson.com'});//退出登录，删除cookie
        account.tools.showmsg("您已成功退出登录！",1);
        setTimeout(function(){
            $(".right_content").html("<div class='login_now'>立即登录</div>");
            $(".owner_title").html("登陆之后更精彩哟^_^");
        },1500);
        account.tools.loginAreaClick();
    });
    //绑定页面其他事件
}

account.tools.loginAreaClick=function(){
    $(".owner_area").delegate('.login_now','click',function(){//立即登录按钮事件
        $(".login_area").fadeIn('slow');
        $(".whole_bg").fadeIn('slow');
        $('.login_now').css("display","none");
        $(".close_btn").bind('click',function(){//登录窗口点击关闭按钮
            $(".login_area").fadeOut('slow');
            $(".whole_bg").fadeOut('slow');
            account.tools.showmsg("对不起！你没有成功登陆！",1);
            setTimeout(function(){
                $(".right_content").html("<div class='login_now'>立即登录</div>");
            },1500);
        });
    });

    $(".login_area").delegate(".btn_login",'click',function(){//登陆事件
        AV.initialize("9ovy0ez2i1odrxhz6n78l8s1v6jtzgvlluu35qewd6c9tjhv", "2o2ypw6wrt6skzqqcoei7pg0m63by0jee4cbfsk3t2rvor2j");//链接数据库
        var in_username =$(".p_user input").val();
        var in_password =$(".p_password input").val();
        in_password =hex_md5(in_password);
        if(in_username.length==0 || in_password.length==0){
            account.tools.showmsg("输入信息不能为空!",2);
        }
        else{
            AV.Query.doCloudQuery('select * from Users', {//获取users表格中的数据
                success: function(d){
                    var results =d.results;
                    var usernameArr =[],userphoneArr=[],passwordArr=[],useridArr=[];
                    $.each(results,function(i){
                        usernameArr.push(results[i]._serverData.user_name);//获取所有用户名
                        userphoneArr.push(results[i]._serverData.user_phone);
                        passwordArr.push(results[i]._serverData.user_password);
                        useridArr.push(results[i]._serverData.user_id);//获取id
                    }); 
                    var flag1= $.inArray(in_username,usernameArr);//判断用户名(若有返回数组下标)
                    var flag2= $.inArray(in_username,userphoneArr);//判断用户名(可以为手机)
                    var date = new Date();
                    date.setTime(date.getTime() + (30 * 60 * 1000));//30分钟过期
                    if(flag1 != -1){//usernameArr数组存在输入的名字
                        if(in_password == passwordArr[flag1]){//对应密码也正确
                            $.cookie("userid",useridArr[flag1],{path:"/",expires:date,domain:'www.jzkjarson.com'});//登陆成功，用户名存入cookie
                            $.cookie("name",usernameArr[flag1],{path:"/",expires:date,domain:'www.jzkjarson.com'});
                            $.cookie("password",in_password,{path:"/",expires:date,domain:'www.jzkjarson.com'});
                            $("#txt_name").text(usernameArr[flag1]);
                            account.tools.loadLoginSuccess(flag1+1);
                        }else{
                            account.tools.showmsg("输入密码不正确，请检查!",2);
                        }
                    }
                    else if(flag2 != -1){//usernameArr不存在，但是phoneArr里存在用户名
                        if(in_password == passwordArr[flag2]){//对应密码也正确
                            $.cookie("name",usernameArr[flag1],{path:"/",expires:date,domain:'www.jzkjarson.com'});//登陆成功，用户名存入cookie
                            $.cookie("password",in_password,{path:"/",expires:date,domain:'www.jzkjarson.com'});//登陆成功，用户密码存入cookie
                            $("#txt_name").text(usernameArr[flag2]);
                            account.tools.loadLoginSuccess(flag2+1);
                        }else{
                            account.tools.showmsg("输入密码不正确，请检查!",2);
                        }
                    }
                    else{
                        account.tools.showmsg("输入用户不存在，请检查!",2);
                    }
                },
                error: function(error){
                    console.log(error.description);
                }
            });
        }
    });
}

account.tools.showmsg=function(txt,t){//显示提示信息的函数，txt是内容，t是显示时间
    $("body").append("<div class='showmsg'>" + txt + "</div>");//在body后面插入showmsg的div
    $(".showmsg").fadeIn().delay(t*1000).fadeOut(200,function(){
        $(".showmsg").remove();//用完之后删掉此div
    });
}


account.app={}
account.app.changeNav=function(){//切换到航事件
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

account.app.showtime=function(){//动态显示时间函数
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

var count1,count2,count3,count4,count5;
account.app.isLogin=function(){
        if(!$.cookie("name") || $.cookie("name") == 'null'){//如果当前没有用户登录
            $(".login_area").css("display","block");
            $(".whole_bg").css("display","block");
            $(".close_btn").bind('click',function(){//登录窗口点击关闭按钮
                $(".login_area").fadeOut('slow');
                $(".whole_bg").fadeOut('slow');
                account.tools.showmsg("对不起！你没有成功登陆！",1);
                setTimeout(function(){
                    $(".right_content").html("<div class='login_now'>立即登录</div>");
                },1500); 
            });
            account.tools.loginAreaClick();
        }
        else{
            $(".owner_title").html('^_^欢迎您，<span id="txt_name">'+$.cookie("name")+'</span><span class="login_out">退出登录</span>');
            var user_id =$.cookie("userid");
            account.tools.clickEventOwn();//登陆成功，绑定页面事件;
            account.tools.loadArea1(user_id);//填充喜欢的电影
            account.tools.loadArea2(user_id);//填充个人资料
            account.tools.loadArea3();
        }
}
account.app.bindAccountEvent=function(){//绑定个人空间的所有事件
    $(".left_link li").each(function(i){//左边导航按钮
        $(this).click(function(){
            $(".left_link li").removeClass("active");
            $(this).addClass("active");
            for(var j=1;j<5;j++){
                $(".area_"+j).css("display","none");
            }
            $(".area_"+(i+1)).css("display","block");
            if(i == 2){$("#container").css('display','block');}
        });
    });
    var name=/^[a-zA-Z0-9]+$/;//用户名仅支持字数数字;
    var phone =/^1[3|4|5|8][0-9]\d{4,8}$/;
    var email =/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
    var password = /^[\w]{6,14}$/;//6-12位密码，只能是字母加数字；
    var date = new Date();
    date.setTime(date.getTime() + (30 * 60 * 1000));//10分钟过期

    function addspan(obj,txt,flag){
        obj.parent().find("span.info").remove();
        var html_span ="<span class='info'><span class='"+flag+"'></span>"+txt+"</span>";
        obj.parent().append(html_span);
    }
    $(".area_2").delegate(".change_info","click",function(){//修改信息
        $(".ziliao_area span").css("display","none");
        $("p.cancel_info").css("display","block");
        $(".ziliao_area input").css("display","inline-block");
        $(".ziliao_area textarea").css("display","inline-block");
        $(".u_name input").val($(".u_name span:first").text());
        $(".u_phone input").val($(".u_phone span:first").text());
        $(".u_email input").val($(".u_email span:first").text());
        $(".u_desc textarea").val($(".u_desc span:first").text());
        $(this).removeClass("change_info").addClass("save_info").text("保存资料");
    }).delegate(".cancel_info","click",function(){//取消修改
        $(".ziliao_area span").css("display","inline-block");
        $(".ziliao_area input").val('');
        $(".ziliao_area span.info").css("display","none");
        $(".ziliao_area span.success").css("display","none");
        $(".ziliao_area span.error").css("display","none");
        $(".ziliao_area input").css("display","none");
        $(".ziliao_area textarea").css("display","none");
        $(".save_info").removeClass("save_info").addClass("change_info").text("修改资料");
        $(this).css("display","none");
    }).delegate(".save_info","click",function(){//保存信息
        var u_name =$(".u_name input").val();
        var u_phone =$(".u_phone input").val();
        var u_email =$(".u_email input").val();
        var u_desc =$(".u_desc textarea").val();
        var txt1='',txt2='',txt3='',txt4='',flag1='',flag2='',flag3='',flag4='';
        if(u_name.length == 0){//判断用户名
            txt1 ="用户名不能为空！";
            flag1='error';
        }else if(name.test(u_name)){
            txt1 ="新用户名可用。";
            flag1='success';
        }else{
            txt1 ="仅支持字母和数字。";
            flag1='error';
        }
        if(u_phone.length == 0){//判断手机号
            txt2 ="手机号不能为空！";
            flag2='error';
        }else if(phone.test(u_phone)){
            txt2 ="新手机号可用。";
            flag2='success';
        }else{
            txt2 ="手机号格式不对吧?";
            flag2='error';
        }
        if(u_email.length == 0){//判断邮箱
            txt3 ="邮箱地址不能为空！";
            flag3='error';
        }else if(email.test(u_email)){
            txt3 ="新邮箱地址可用。";
            flag3='success';
        }else{
            txt3 ="邮箱格式不对吧?";
            flag3='error';
        }
        if(u_desc.length == 0){//判断个人简介部分
            txt4="你没有填写简介。";
            flag4 ='success';
        }else if(u_desc.replace(/[^\x00-\xff]/g,"**").length>=60){
            txt4="内容不能超30字。";
            flag4 ='error';
        }else{
            txt4="简介写的不错哟！";
            flag4 ='success';
        }
        addspan($(".u_name input"),txt1,flag1);
        addspan($(".u_phone input"),txt2,flag2);
        addspan($(".u_email input"),txt3,flag3);
        addspan($(".u_desc textarea"),txt4,flag4);
        if($(".ziliao_area").find("span.error").length == 0){//找不到error标签
            AV.initialize("9ovy0ez2i1odrxhz6n78l8s1v6jtzgvlluu35qewd6c9tjhv", "2o2ypw6wrt6skzqqcoei7pg0m63by0jee4cbfsk3t2rvor2j");
            var id =$.cookie("userid");
            var txtname =$(".u_name input").val();
            var txtphone =$(".u_phone input").val();
            var txtemail =$(".u_email input").val();
            var txtdesc =$(".u_desc textarea").val();

            var Users = AV.Object.extend("Users");//获取Uses表
            AV.Query.doCloudQuery('select objectId from Users where user_id='+id, {
                success: function(msg){
                    var objectid =msg.results[0].id;
                    var query = new AV.Query(Users);
                    query.get(objectid, {
                        success: function(user) {  
                            user.save({
                                user_name:txtname,
                                user_phone:txtphone,
                                user_email:txtemail,
                                user_desc:txtdesc
                            });
                            $(".ziliao_area span").css("display","inline-block");
                            $(".ziliao_area span.info").css("display","none");
                            $(".ziliao_area span.success").css("display","none");
                            $(".ziliao_area span.error").css("display","none");
                            $(".ziliao_area input").css("display","none");
                            $(".ziliao_area textarea").css("display","none");
                            $("p.cancel_info").hide();
                            $(".u_name span").text(txtname);
                            $(".u_phone span").text(txtphone);
                            $(".u_email span").text(txtemail);
                            $(".u_desc span").text(txtdesc);
                            $('.save_info').removeClass("save_info").addClass("change_info").text("修改资料");
                            $.cookie("name",txtname,{path:"/",expires:date,domain:'www.jzkjarson.com'});
                            $("#txt_name").text(txtname);
                            account.tools.showmsg("保存资料成功！",2);
                        },
                        error:function(error){
                            showmsg("Error:"+error.description);
                        }
                    });
                },
                error: function(error){
                    console.dir(error);
                }
            }); 
        }
    }).delegate(".change_pwd","click",function(){//修改密码
        $(".pwd_area").css("display","block");
        $(".pwd_area input").val('');
        $(this).removeClass("change_pwd").addClass("save_pwd").text("保存密码");
    }).delegate(".cancel_pwd","click",function(){//取消修改
        $(".pwd_area").css("display","none");
        $(".save_pwd").removeClass("save_pwd").addClass("change_pwd").text("修改密码");
    }).delegate(".save_pwd","click",function(){//保存密码
        var old_pwd =$(".old_pwd input").val();
        old_pwd = hex_md5(old_pwd);
        var new_pwd =$(".new_pwd input").val();
        var confirm_pwd =$(".confirm_pwd input").val();
        var txt1='',txt2='',txt3='',flag1='',flag2='',flag3='';
        if(old_pwd.length == 0){//判断旧密码
            txt1 ="旧密码不能为空！";
            flag1='error';
        }else if($.cookie("password") == old_pwd){
            txt1 ="旧密码填写正确。";
            flag1='success';
        }else{
            txt1 ="旧密码填写错误！";
            flag1='error';
        }
        if(new_pwd.length == 0){//判断输入的新密码
            txt2 ="手机号不能为空！";
            flag2='error';
        }else if(password.test(new_pwd)){
            txt2 ="清牢记新密码。";
            flag2='success';
        }else{
            txt2 ="6-12位字母和数字！";
            flag2='error';
        }
        if(confirm_pwd.length == 0){//确认新密码
            txt3 ="确认密码不能为空！";
            flag3='error';
        }else if(confirm_pwd == new_pwd){
            txt3 ="两次输入一致。";
            flag3='success';
        }else{
            txt3 ="两次输入不一致！";
            flag3='error';
        }
        addspan($(".old_pwd input"),txt1,flag1);
        addspan($(".new_pwd input"),txt2,flag2);
        addspan($(".confirm_pwd input"),txt3,flag3);
        if($(".pwd_area").find("span.error").length == 0){//找不到error标签
            AV.initialize("9ovy0ez2i1odrxhz6n78l8s1v6jtzgvlluu35qewd6c9tjhv", "2o2ypw6wrt6skzqqcoei7pg0m63by0jee4cbfsk3t2rvor2j");
            var id =$.cookie("userid");
            var Users = AV.Object.extend("Users");//获取Uses表
            AV.Query.doCloudQuery('select objectId from Users where user_id='+id, {
                success: function(msg){
                    var objectid =msg.results[0].id;
                    var query = new AV.Query(Users);
                    query.get(objectid, {
                        success: function(user) {  
                            user.save({
                                user_password:hex_md5(new_pwd)
                            });
                            $(".pwd_area span.info").css("display","none");
                            $(".pwd_area span.success").css("display","none");
                            $(".pwd_area span.error").css("display","none");
                            $(".pwd_area").css("display","none");
                            $(".save_pwd").removeClass("save_pwd").addClass("change_pwd").text("修改密码");
                            $.cookie("password",new_pwd,{path:"/",expires:date,domain:'www.jzkjarson.com'});
                            account.tools.showmsg("密码修改成功！清牢记！",2);
                        },
                        error:function(error){
                            showmsg("Error:"+error.description);
                        }
                    });
                },
                error: function(error){
                    console.dir(error);
                }
            }); 
        }
    }).delegate("input","focus",function(){
        $(this).css({"border-color":"blue","box-shadow":'0 0 5px blue'});
    }).delegate("input","blur",function(){
        $(this).css({"border-color":"#666","box-shadow":"none"});
    }).delegate("textarea","focus",function(){
        $(this).css({"border-color":"blue","box-shadow":'0 0 5px blue'});
    }).delegate("textarea","blur",function(){
        $(this).css({"border-color":"#666","box-shadow":"none"});
    });
}