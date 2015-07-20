window.onload=function(){
	admin.app.init();
}

var admin={};

admin.tools={};
admin.tools.showmsg=function(txt,t){//显示提示信息的函数，txt是内容，t是显示时间
    $("body").append("<div class='showmsg'>" + txt + "</div>");//在body后面插入showmsg的div
    $(".showmsg").fadeIn().delay(t*1000).fadeOut(200,function(){
        $(".showmsg").remove();//用完之后删掉此div
    });
}

admin.tools.changeNav = function(){
	$(".top_nav li").each(function(i){
		$(this).click(function(){
			$(".top_nav li").removeClass('active');
			$(this).addClass('active');
			$('.content').css('display','none');
			$(".content"+(i+1)).css('display','block');
		});
	});
}

admin.tools.saveNews=function(){//存入新闻动态
    AV.initialize("9ovy0ez2i1odrxhz6n78l8s1v6jtzgvlluu35qewd6c9tjhv", "2o2ypw6wrt6skzqqcoei7pg0m63by0jee4cbfsk3t2rvor2j");
    var news_title = $("#news_title").val();
    var news_time = $("#news_time").val();
	var news_content = $(".nicEdit-main").html();
    var News = AV.Object.extend("News");//创建_News类，相当于是一个表
    var news = new News();
    if(news_title !='' && news_content !='<br>'){
    	news.save({
	    	news_title:news_title,
	        news_time:news_time,
	        news_content:news_content
	    }, {
	        success: function() {
	            admin.tools.showmsg('添加成功,快去刷新看看。',2);
	            $("#news_title").val('');
	        	$(".nicEdit-main").html('');
	    	},
	    	error:function(){
	    		admin.tools.showmsg('添加失败！请检查网络！',2);
	    	}
	    });
    }else{
    	admin.tools.showmsg('请检查名称和内容！',2);
    }
}

admin.tools.bindContent_1=function(){
	String.prototype.replaceAll=function (AFindText,ARepText){
        var raRegExp=new RegExp(AFindText,"g");
        return this.replace(raRegExp,ARepText);
    };
	var nowTime =new Date();
	
	var year = nowTime.getFullYear();
	var month = (nowTime.getMonth()+1) >=10 ? (nowTime.getMonth()+1) : '0'+(nowTime.getMonth()+1);
	var day = nowTime.getDate() >= 10 ? nowTime.getDate() : '0'+nowTime.getDate();
	var hour = nowTime.getHours() >= 10 ? nowTime.getHours() : '0'+nowTime.getHours();
	var min = nowTime.getMinutes() >=10 ? nowTime.getMinutes() : '0'+nowTime.getMinutes();
	var news_time = year + '-' + month + '-' + day +'  ' + hour + ':' + min;
	
	$("#news_time").val(news_time);
	$("#news_time").click(function(){
		admin.tools.showmsg('发布时间不能修改！',1);
	});
	$(".news_submit").click(function(){
		admin.tools.saveNews();
	});
}

admin.tools.bindContent_2 =function(){
    AV.initialize("9ovy0ez2i1odrxhz6n78l8s1v6jtzgvlluu35qewd6c9tjhv", "2o2ypw6wrt6skzqqcoei7pg0m63by0jee4cbfsk3t2rvor2j");
    function loadUserTable(){
    	AV.Query.doCloudQuery('select * from Users', {
	        success: function(d){
	            var results =d.results;
	            var user_html='';
	            var user_name='',user_email='',user_phone='',user_desc='',user_favoId='',user_id='',user_pwd='';
	            for(var i =0;i<results.length;i++){
	            	user_id = results[i]._serverData.user_id;
	            	user_name = results[i]._serverData.user_name;
	            	user_phone = results[i]._serverData.user_phone;
	            	user_email = results[i]._serverData.user_email;
	            	user_desc = results[i]._serverData.user_desc;
	            	user_favoId = results[i]._serverData.favo_movieID;
	            	user_pwd = results[i]._serverData.user_password;
	            	if(user_favoId){
	            		if(user_favoId.substr(0,1) == ','){
		            		user_favoId = user_favoId.substr(1,user_favoId.length);
		            	}
	            	}

	            	user_html = '<tr user_id='+user_id+'><td class="width88"><input class="width80 name" type="text" value='+user_name+' disabled="disabled" title='+user_name+'></td><td class="width93"><input class="width84 password" type="text" value='+user_pwd+' disabled="disabled" title='+user_pwd+'></td><td class="width100"><input class="width92 phone" type="text" value='+user_phone+' disabled="disabled" title='+user_phone+'></td><td class="width140"><input class="width132 email" type="text" value='+user_email+' disabled="disabled" title='+user_email+'></td><td class="width200"><input class="width192 desc" type="text" value='+user_desc+' disabled="disabled" title='+user_desc+'></td><td class="width190"><input class="width182 favoId" type="text" value='+user_favoId+' disabled="disabled" title='+user_favoId+'></td><td class="width87"><span class="btn_edit">编辑</span><span class="btn_del">删除</span></td></tr>';
	            	$(".users_table tbody").append(user_html);
	            }
	            $(".users_table tbody").find("tr:odd").css("background-color", "#e0e3e4");
	        },
	        error: function(error){
	            console.log(error);
	        }
	    });
    }

    loadUserTable();
	$('.users_table').delegate('.btn_edit','click',function(){
		$(this).parent().parent().find('input').css({'border':'1px solid #bbbec0','background-color':'#fff'}).removeAttr('disabled');
		$(this).removeClass('btn_edit').addClass('btn_save').text('保存');
	}).delegate('.btn_save','click',function(){
		var parent = $(this).parent().parent();
		var id = parent.attr('user_id');
		var txtname = parent.find('.name').val();
		var txtphone = parent.find('.phone').val();
		var txtemail = parent.find('.email').val();
		var txtdesc = parent.find('.desc').val();
		var txtfavoid = parent.find('.favoId').val();
		var txtpwd = parent.find('.password').val();
		txtpwd = hex_md5(txtpwd);
		if(txtname == '' || txtphone=='' || txtemail=='' || txtdesc=='' || txtfavoid=='' || txtpwd==''){
			admin.tools.showmsg('所有项均不能为空哟！',1);
		}else{
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
	                            user_desc:txtdesc,
	                            favo_movieID:txtfavoid,
	                            user_password:txtpwd
	                        });
	                        parent.find('input').css({'border':'none','background':'none'}).attr('disabled','disabled');
	                        admin.tools.showmsg('恭喜你，保存成功！',2);
	                        $('.users_table tbody').html('');
	                        loadUserTable();
	                    },
	                    error:function(error){
	                        console.log("Error:"+error.description);
	                    }
	                });
	            },
	            error: function(error){
	                console.dir(error);
	            }
	        }); 
		}
	}).delegate('.btn_del','click',function(){
		var parent = $(this).parent().parent();
		var id = parseInt(parent.attr('user_id'));
		var Users = AV.Object.extend("Users");//获取Uses表
		var query = new AV.Query(Users);
		query.equalTo("user_id", id);
		query.destroyAll({
		   success: function(){
		   		admin.tools.showmsg('删除成功！',2);
		        parent.remove();
		   },
		   error: function(err){
		        console.error(err);
		   }
		});
	}).delegate('.btn_confrim','click',function(){
		var parent = $(this).parent().parent();
		var txtname = parent.find('.name').val();
		var txtphone = parent.find('.phone').val();
		var txtemail = parent.find('.email').val();
		var txtdesc = parent.find('.desc').val();
		var txtfavoid = parent.find('.favoId').val();
		var txtpwd = parent.find('.password').val();
		txtpwd = hex_md5(txtpwd);
		if(txtname == '' || txtphone=='' || txtemail=='' || txtdesc=='' || txtfavoid=='' || txtpwd==''){
			admin.tools.showmsg('所有项均不能为空哟！',1);
		}else{
			var Users = AV.Object.extend("Users");//获取Uses表
			var users = new Users();
			AV.Query.doCloudQuery('select * from Users', {
			    success: function(d){
			        var len =1;
			        if(d.results !=null){
			        	var len = d.results.length+1;
			        }
			        users.save({
						user_name:txtname,
	                    user_phone:txtphone,
	                    user_email:txtemail,
	                    user_desc:txtdesc,
	                    favo_movieID:txtfavoid,
	                    user_password:txtpwd,
						user_id:len
					}, {
						success: function(rsp) {
							admin.tools.showmsg('恭喜你，添加成功！',2);
							$('.users_table tbody').html('');
	                		loadUserTable();
	                		$('.btn_cancel').removeClass('btn_cancel').addClass('btn_add').text('添加用户');
						},
						error:function(error){
							console.log("Error:"+error.description);
						}
					});
			    },
				error: function(error){
				    console.log(error.description);
				}
			});
		}
	});
	$('.content2').delegate('.btn_add','click',function(){
		var add_html = '<tr class="add_tr"><td class="width88"><input class="width80 name" type="text" value=""></td><td class="width93"><input class="width84 password" type="text" value=""></td><td class="width100"><input class="width92 phone" type="text" value=""></td><td class="width140"><input class="width132 email" type="text" value=""></td><td class="width200"><input class="width192 desc" type="text" value=""></td><td class="width190"><input class="width182 favoId" type="text" value=""></td><td class="width87"><span class="btn_confrim">确定</span></td></tr>';
		$(".users_table tbody").append(add_html);
		$('.add_tr input').css({'border':'1px solid #bbbec0','background-color':'#fff'});
		$(this).removeClass('btn_add').addClass('btn_cancel').text('取消添加');
	}).delegate('.btn_cancel','click',function(){
		$('.add_tr').remove();
		$(this).removeClass('btn_cancel').addClass('btn_add').text('添加用户');
	})
}

admin.tools.bindContent_3 =function(){
	function showmsg(txt,t){//显示提示信息的函数，txt是内容，t是显示时间
	    $("body").append("<div class='showmsg'>" + txt + "</div>");//在body后面插入showmsg的div
	    $(".showmsg").fadeIn().delay(t*1000).fadeOut(200,function(){
	        $(".showmsg").remove();//用完之后删掉此div
	    });
	}
	$('.admin_yes').click(function(){
		var admin_name = $("#admin_name").val();
		var admin_pwd = $("#admin_pwd").val();
		var admin_pwd2 = $("#admin_pwd2").val();
		if(admin_name == '' || admin_pwd == '' || admin_pwd2 == ''){
			showmsg('每一项都不能为空哟!',2);
		}else{
			if(admin_pwd == admin_pwd2){
				AV.initialize("9ovy0ez2i1odrxhz6n78l8s1v6jtzgvlluu35qewd6c9tjhv", "2o2ypw6wrt6skzqqcoei7pg0m63by0jee4cbfsk3t2rvor2j");
				var Admin = AV.Object.extend("Admin");//获取Uses表
				var admin = new Admin();
				admin_pwd = hex_md5(admin_pwd);
				admin.save({
					ad_name: admin_name,
					ad_password: admin_pwd
				}, {
					success: function(rsp) {//注册信息成功存入数据库
						showmsg('成功加入管理员账户。',2);
						$('.content3 input').val(''); 
					},
					error:function(error){
						console.log("Error:"+error.description);
					}
				});
			}
			else{
				showmsg('确认密码与密码不一致！',2);
			}
		} 
	});
	$('.admin_no').click(function(){
		$('.content3 input').val('');
	});
	
}

admin.tools.isLogin=function(){
	if(!$.cookie("ad_name") || $.cookie("ad_name") == 'null'){//如果当前没有用户登录
        $(".login_area").css("display","block");
        $(".whole_bg").css("display","block");
    }
    else{
    	$("#txtAname").text($.cookie("ad_name"));
        $("#txtAname").attr('title', $.cookie("ad_name"));
        $(".login_area").fadeOut();
        $('.whole_bg').fadeOut();
    }
}

admin.app={};
admin.app.init=function(){
	admin.tools.isLogin();//判断是否登陆
	$('.btn_login').click(function(){
		AV.initialize("9ovy0ez2i1odrxhz6n78l8s1v6jtzgvlluu35qewd6c9tjhv", "2o2ypw6wrt6skzqqcoei7pg0m63by0jee4cbfsk3t2rvor2j");//链接数据库
        var in_username =$(".p_user input").val();
        var in_password =$(".p_password input").val();
        in_password =hex_md5(in_password);
        if(in_username.length==0 || in_password.length==0){
            admin.tools.showmsg("输入信息不能为空!",1);
        }
        else{
            AV.Query.doCloudQuery('select * from Admin', {//获取Admin表格中的数据
                success: function(d){
                    var results =d.results;
                    var usernameArr =[],passwordArr=[];
                    $.each(results,function(i){
                        usernameArr.push(results[i]._serverData.ad_name);//获取所有用户名
                        passwordArr.push(results[i]._serverData.ad_password);
                    }); 
                    var flag= $.inArray(in_username,usernameArr);//判断用户名(若有返回数组下标)
                    var date = new Date();
                    date.setTime(date.getTime() + (30 * 60 * 1000));//30分钟过期
                    if(flag != -1){//usernameArr数组存在输入的名字
                        if(in_password == passwordArr[flag]){//对应密码也正确
                            $.cookie("ad_name",usernameArr[flag],{path:"/",expires:date,domain:'www.jzkjarson.com'});
                            $("#txtAname").text(usernameArr[flag]);
                            $("#txtAname").attr('title',usernameArr[flag]);
                            $('.left_login input').val('');
                            admin.tools.showmsg("欢迎进入后台管理系统！",1);
                            $(".login_area").fadeOut();
                            $('.whole_bg').fadeOut();
                        }else{
                            admin.tools.showmsg("输入密码不正确，请检查!",1);
                        }
                    }
                    else{
                        admin.tools.showmsg("输入用户不存在，请检查!",1);
                    }
                },
                error: function(error){
                    console.log(error.description);
                }
            });
        }
	});
	
	$('.login_out').click(function(){
		var date = new Date();
        date.setTime(date.getTime() + (30 * 60 * 1000));//30分钟过期
        $.cookie("ad_name",null,{path:"/",expires:date,domain:'www.jzkjarson.com'});//退出登录，删除cookie
        $("#txtAname").text('');
		admin.tools.showmsg("您已经成功退出系统!",1);
		setTimeout(function(){
			$(".login_area").fadeIn();
       		$('.whole_bg').fadeIn();
		},1000);
	});

	admin.tools.changeNav();
	admin.tools.bindContent_1();
	admin.tools.bindContent_2();
	admin.tools.bindContent_3();
}
