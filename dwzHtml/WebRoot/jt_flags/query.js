
//常见图片
function queryIconShow(){
	var url = pcs.common.path + '/json?action=QUERY_T_SIGN_LINE_SHOW_ACTION&SHOW_TYPE=1&TYPE=1';
	$.post(url,{},function(data){
		if(data.success){
			var str = "";
			var imgsrc = "";
			var dataList = data.root.T_SIGN_LINE_SHOW.rs;
				
			$.each(dataList,function(i,obj){
				imgsrc = obj.DOMAIN_NAME+"/"+obj.FILE_CATALOG+"/"+obj.FILE_NAME;
				str += '<li>'
					+ '<a href="line.html?sign_type='+obj.FK_SIGN_LINE+'">'
					+ '<img src="'+imgsrc+'" width="66" height="66" />'
					+ '<br/>'
					+ obj.SIGN_NAME
					+ '</a>'
					+ '</li>'
					;
			});
			
			$("#ul_cjbzzslist").html(str);
		}
		else{
			alert(data.errors.errmsg);
		}
	},'json');
}

//滚动图标
function queryRollIconShow(){
	var url = pcs.common.path + '/json?action=QUERY_T_SIGN_LINE_SHOW_ACTION&SHOW_TYPE=2';
	$.post(url,{},function(data){
		if(data.success){
			var str = "";
			var imgsrc = "";
			var dataList = data.root.T_SIGN_LINE_SHOW.rs;
				
			$.each(dataList,function(i,obj){
				imgsrc = obj.DOMAIN_NAME+"/"+obj.FILE_CATALOG+"/"+obj.FILE_NAME;
				str += '<div class="box">'
					+ '<a href="line.html?sign_type='+obj.FK_SIGN_LINE+'" title="'+obj.SIGN_NAME+'">'
					+ '<img src="'+imgsrc+'" width="66" height="66" />'
					+ '</a><p>'+obj.SIGN_NAME+'</p></div>'
					;
			});
			
			$("#ISL_Cont_1").html(str);
			scrollPicIcon();
		}
		else{
			alert(data.errors.errmsg);
		}
	},'json');
}

//展开全部

function querySign_big_type(){
	$.ajax({
		type: 'post',
		url: pcs.common.path + '/json',
		data: 'action=QUERY_T_SIGN_BIG_TYPE_ACTION',
		cache: true,
		dataType: 'json',
		async: false,
		success:function(data){
			if(data.success){
				var str = "";
				var divstr = "";
				var dataList = data.root.T_SIGN_BIG_TYPE.rs;
				$.each(dataList,function(i,obj){
					str += '<h2><span class="right"><a class="cDGray" id="gengduo01"></a></span>'+obj.SIGN_NAME+'</h2>'
						+ '<p id="p_sign_small_type'+obj.PK_SIGN_BIG_TYPE+'"></p>'
					;
				});
				$('#div_sign_big_type').append(str);
			}
			else{
				alert(data.errors.errmsg);
			}
		}
	})
}

function querySign_small_type(){
	$.ajax({
		type: 'post',
		url: pcs.common.path + '/json',
		data: 'action=QUERY_T_SIGN_SMALL_TYPE_ACTION',
		cache: true,
		dataType: 'json',
		async: false,
		success:function(data){
			if(data.success){
				var str = "";
				var dataList = data.root.T_SIGN_SMALL_TYPE.rs;
				$.each(dataList,function(i,obj){
					var imgsrc = "";
					imgsrc = obj.DOMAIN_NAME+"/"+obj.FILE_CATALOG+"/"+obj.FILE_NAME;
					str = '<a href="line.html?sign_type='+obj.PK_SIGN_SMALL_TYPE+'" title="'+obj.SIGN_NAME+'"><img src="'+imgsrc+'" width="52" height="52" /></a>';
					;
					$('#p_sign_small_type'+obj.FK_SIGN_BIG_TYPE).append(str);
				});
				
			}
			else{
				alert(data.errors.errmsg);
			}
		}
	})
}