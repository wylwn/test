/**
 * 公共js
 */
// 模块名称注册
if (pcs == null)
	var pcs = {};
if (pcs.common == null)
	pcs.common = {};

var url = document.location.pathname;
var itmp = url.indexOf("/", 1);
var webpath = itmp < 0 ? url : url.substr(0, itmp);
if (webpath.indexOf('/') == -1) {
	webpath = '/' + webpath;
}
webpath="/";
pcs.common = {

	path : window.location.protocol + '//' + window.location.host + webpath,
	/**
	 * 分页的代码 defaultHtml 如果没有找到数据，则将这个变量原本的显示在panel中
	 */
	changePage : function(url, pageSize,xmlname, result, youfun, pagePanel, defaultHtml,currentPageInit) {
		$(pagePanel).text('');
		pcs.common.beLoading(result);
		var totalRows = 'data.root.' + xmlname + '.page.totalRows';
		var currentpage = 'data.root.' + xmlname + '.page.currentPage';
		if(currentPageInit==undefined||currentPageInit==null)(currentPageInit=1);
		url = encodeURI(url);
		$.post(url, {
					PAGE_SIZE : pageSize,
					CURRENT_PAGE : (currentPageInit!=""?currentPageInit:(pcs.common.getParamter("CURRENT_PAGE")==""?1:pcs.common.getParamter("CURRENT_PAGE")))
				}, function(data) {
					if (eval(totalRows) != null && eval(totalRows) != undefined && eval(currentpage) != null && eval(currentpage) != undefined) {
						if (pagePanel != null && pagePanel != "" && eval(totalRows) > pageSize) {
							$(pagePanel).pagination(eval(totalRows), {
								items_per_page : pageSize,
								current_page : eval(currentpage) - 1,
								num_display_entries : 10,
								callback : function(page_id, panel) {
									$.post(url, {
										PAGE_SIZE : pageSize,
										CURRENT_PAGE : page_id + 1
									}, function(data) {
										pcs.common.showdata(data,xmlname,youfun,result,defaultHtml,page_id + 1);
									}, "json");
								}
							});
						}
					}
					pcs.common.showdata(data,xmlname,youfun,result,defaultHtml);
				}, "json");
	},	
	/**
	 * 插入等待图片
	 */
	beLoading : function(result) {
		$(result).html('<img src="' + pcs.common.path + '/common/images/loader.gif"/>');
	},
	
	forLoading: function(result) {
		$(result).html('<li><em style="width:100%;text-align: center;"><img src="' + pcs.common.path + '/common/images/loader.gif"/></em></li>');
	},

	/**
	 * 显示分页数据
	 */
	showdata : function(data, xmlname, youfun, result, defaultHtml,current_page) {
		$(result).text('');
		var t=true;
		if(current_page==undefined){current_page=""}
		if(eval('data.root.'+xmlname+'.rs')!=null && eval('data.root.'+xmlname+'.rs')!=undefined && eval('data.root.'+xmlname+'.rs.length')>0){
			$.each(eval('data.root.'+xmlname+'.rs'),function(i,n){
				youfun(this,$(result),i,current_page);
				t=false;
			});
		}
		if(t){	$(result).append(defaultHtml);	}
		$(".list li").mouseover(function(){
		$(this).addClass("over");}).mouseout(function(){ 
			$(this).removeClass("over");})
		$(".list li:even").addClass("alt");
	},
	/**
	 * 分页数据列表
	 */
	listPage:function(url,xmlname,result,youfun,defaultHtml){
		url=encodeURI(url);
		$.post(url, {}, function(data) {
			if(data.success){
				pcs.common.showDictData(data,xmlname,youfun,result,defaultHtml);
			}
			else if(data.errors.errmsg == "您没有该操作的权限"){
				$(result).html('<li><em style="text-align: center;width:100%">您没有查看列表的权限</em></li>');
			}
			else{
				alert(data.errors.errmsg);
			}
		}, "json");
	},

	/**
	 * 显示分页字典数据
	 */
	showDictData:function(data,xmlname,youfun,result,defaultHtml) {
		var t=true;
		if(eval('data.root.'+xmlname+'.rs')!=null && eval('data.root.'+xmlname+'.rs')!=undefined && eval('data.root.'+xmlname+'.rs.length')>0){
			$.each(eval('data.root.'+xmlname+'.rs'),function(i,n){
				youfun(this,$(result),i,n);
				t=false;
			})
		}
		if(t){
			$(result).append(defaultHtml);
		}
	},
	
	/**
	 * 取得数据字典数据
	 */
	getDictByPage : function(DICT_ID,CLASS_CODE,result,youfn){
		var url = pcs.common.path + '/json?action=QUERY_T_SYSTEM_STATUS_ACTION&STATUS_TYPE='+ DICT_ID;	//获取某一类的全部数据
		if(CLASS_CODE.length>0){	
			url = pcs.common.path + '/json?action=GET_T_SYSTEM_STATUS_ACTION&STATUS_TYPE='+ DICT_ID+'&STATUS_CODE='+CLASS_CODE;//获取某一类的指定的数据
		}
		url=encodeURI(url);
		var xmlname='T_SYSTEM_STATUS';
		pcs.common.listPage(url,xmlname,result,youfn);
	},
	
	/**
	 * 返回URL中的参数值，类似JSP中的request.getParamter('id'); 
	 * 用法：var strGetQuery =document.location.search; var id = getQueryString(strGetQuery,'id');
	 */
	getQueryString : function (url,name){
		var reg = new RegExp("(^|\\?|&)"+ name +"=([^&]*)(\\s|&|$)", "i");
		if (reg.test(url)){
			return unescape(RegExp.$2.replace(/\+/g, " "));
		}
		return "";
	},
	
	/**
	 * 去除多余的字用指定符号代替
	 */
	ellipsis : function(str, maxlength, suffix) {
		if (str.length <= maxlength) {
			return str;
		} else {
			return str.substr(0, maxlength - 0) + suffix
		}
	},
	
	/**
	 * 取得用户session
	 */
	getUserSession : function(fn) {
		var url = pcs.common.path + '/json?action=GET_SESSION_USER_ACTION';
		var userinfo = {
			PK_USER : '',
			USER_SN : '',
			USER_NAME : '',
			USER_TYPE : '',
			USER_LEVEL: '',
			MOBILE : '',
			PHONE : '',
			AREA : '',
			EMAIL : '',
			REMARK : '',
			CREATE_DATE : '',
			LAST_LOGIN_TIME : '',
			LAST_LOGIN_IP : ''
		};
		$.post(url,{}, function(data) {
				if(data.success){
					if(data.root.SESSION_ID.rs[0] == null || data.root.SESSION_ID.rs[0] == undefined){
						alert("对不起，您还未登录或登录超时，请重新登录！");
						window.parent.location.href=pcs.common.path + '/index.html';
					}
					else{
						userinfo = {
							PK_USER : data.root.SESSION_BEAN.rs[0].PK_SYS_USER,
							USER_NAME : data.root.SESSION_BEAN.rs[0].USER_NAME,
							USER_TYPE : data.root.SESSION_BEAN.rs[0].USER_TYPE,
							USER_LEVEL: data.root.SESSION_BEAN.rs[0].USER_LEVEL,
							MOBILE : data.root.SESSION_BEAN.rs[0].MOBILE,
							PHONE :data.root.SESSION_BEAN.rs[0].PHONE,
							AREA : data.root.SESSION_BEAN.rs[0].AREA,
							EMAIL : data.root.SESSION_BEAN.rs[0].EMAIL,
							REMARK : data.root.SESSION_BEAN.rs[0].REMARK,
							CREATE_DATE : data.root.SESSION_BEAN.rs[0].CREATE_DATE,
							LAST_LOGIN_TIME : data.root.SESSION_BEAN.rs[0].LAST_LOGIN_TIME,
							LAST_LOGIN_IP : data.root.SESSION_BEAN.rs[0].LAST_LOGIN_IP
						}
					}
					if(fn!=null || fn!=undefined){
						fn(userinfo);
					}
				}
				else{
					alert(data.errors.errmsg);
					window.parent.location.href = pcs.common.path + '/index.html';
				}
		}, "json");		
	},
	
	/**
	 * 验证当前页面的操作按钮是否显示
	 * @param {} permissionNames
	 * @param {} actionNames
	 * @param {} fn
	 */
	hasPermission : function(permissionNames, actionNames, fn){
		$.ajax({
			type: 'post',
			url: pcs.common.path + '/json',
			data: 'action=VALIDATOR_PERMISSION_ACTION&PERMISSION_NAME='+ permissionNames + '&ACTION_NAME='+actionNames,
			dataType: 'json',
			async: false,
			success:function(data){
				if(data.success){
					fn(data);
				}
				else{
					alert(data.errors.errmsg);
				}
			}
		})
	},

	/**
	 * 自定义弹窗，options为可选属性
	 */
	showDialog:function(msg,options){
		var settings={
				modal:true,overlay:{opacity:0.5,background:"black"},
				resizable:false,height: 200,width:300,xtype:'ok',fontsize:'14px',url:'',btnValue:'确定',url2:'',btnValue2:'确定2'
			};
		if(options!=null){
			jQuery.extend(settings, options);
		}
		var ximage=pcs.common.path+'/common/images/';
		switch(settings.xtype){
			case 'ok':
				ximage+='ok_1.gif';
				break;
			case 'error':
				ximage+='error_1.gif';
				break;
			case 'info':
				ximage+='info_1.gif';
				break;
			case 'message':
				ximage+='message_1.gif';
				break;
			default:
				ximage+='ok_1.gif';
				break;
		}
		var onclickfn='';		
		var btnStyle='margin-left:15px;BORDER-RIGHT: #7EBF4F 1px solid; PADDING-RIGHT: 2px; BORDER-TOP: #7EBF4F 1px solid; PADDING-LEFT: 2px; FONT-SIZE: 14px; FILTER: progid:DXImageTransform.Microsoft.Gradient(GradientType=0, StartColorStr=#ffffff, EndColorStr=#B3D997); BORDER-LEFT: #7EBF4F 1px solid; CURSOR: hand; COLOR: black; PADDING-TOP: 2px; BORDER-BOTTOM: #7EBF4F 1px solid';		
		if(settings.url!=''){
			onclickfn="window.location.href='"+settings.url+"'";			
		}else{
			onclickfn="$(this).parent().parent().dialog(\'close\');";
		}
		var sBtn1='<input type="button" style="'+btnStyle+'" value="'+settings.btnValue+'" onclick="'+onclickfn+'"/>';
		var sBtn2='';
		if(settings.url2!=''){
			onclickfn="window.location.href='"+settings.url2+"'";
			sBtn2='<input type="button" style="'+btnStyle+'" value="'+settings.btnValue2+'" onclick="'+onclickfn+'"/>';
		}else{
			onclickfn="$(this).parent().parent().dialog(\'close\');";
		}
		
		
		var str='<div id="diaglog" class="flora"><img style="padding-right:15px;padding-left:5px;" src="'
		+ximage
		+'" alt=""/><span style="font-size:'+settings.fontsize+';padding-bottom:-10px;">'
		+msg+'</span><div align="center" style="padding-top:25px;">'
		+sBtn1
		+sBtn2
		+'</div></div>';	
		$(str).dialog(settings);
	},

	/**
	 * 选中所有指定name的组件
	 */
	allCheck : function(name) {
		$("input[@name=" + name + "]").each(function() {
					$(this).attr("checked", true);
				});
	},
	
	/**
	 * 去除所有指定name的组件
	 */
	desCheck : function(name) {
		$("input[@name=" + name + "]").each(function() {
					$(this).attr("checked", false);
				});
	},
	
	/**
	 * 字符串中指定子字符串按指定样式显示
	 */ 
	setStringHtmlCss : function(t, s, h, c) {
		return t.replace(eval('/' + s + '/g'), '<' + h + ' class="' + c + '">'	+ s + '</' + h + '>');
	},
	
	/**
	 * 	imgId:随机码显示位置的id；xtype;显示类型eg,src,value；def_SessionName：定义一个session名字，空则默认
	 */
	getRandcode : function(imgId, xtype, def_SessionName) {
															
		$('#' + imgId).attr(xtype,"/public/rndcode.jsp?" + Math.random() + '&sessionName=' + def_SessionName);
	},
	
	/**
	 * 取Cookie
	 */ 
	getCookie : function(name) {
		var strCookie = document.cookie;
		var arrCookie = strCookie.split("; ");
		for (var i = 0; i < arrCookie.length; i++) {
			var arr = arrCookie[i].split("=");
			if (arr[0] == name) {
				if (arr[1] == '' || arr[1] == null || arr[1] == undefined) {
					return "";
				} else {
					return arr[1];
				}
			}
		}
		return "";
	},
	
	/**
	 * 过滤js脚本和html标签
	 */ 
	noHTML : function(Htmlstring) // 去除HTML标记
	{
		Htmlstring = Htmlstring.replace(/<script.*?>.*?<\/script>/ig, '');
		// 删除html
		Htmlstring = Htmlstring.replace(/<\/?[^>]+>/g, ''); // 去除HTML tag
		Htmlstring = Htmlstring.replace(/\n/g, '</br>'); // 换行符转换成br
		Htmlstring = Htmlstring.replace(/\40/g, '&nbsp;&nbsp;'); // 去除行尾空白
		// Htmlstring = Htmlstring.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
		// Htmlstring = Htmlstring.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
		return Htmlstring;
	},
	
	/**
	 * 取得浏览器类型
	 */
	getBrowser : function() {
		var browser;
		if ($.browser.msie) {
			browser = "msie";
		} else if ($.browser.safari) {
			browser = "safari";
		} else if ($.browser.mozilla) {
			browser = "mozilla";
		} else if ($.browser.opera) {
			browser = "opera";
		} else {
			browser = "unknow";
		}
		return browser;
	},
	
	/******************************************************
	 * 功能：转换时间格式
	 * 描述: datetime 为输入时间，format 为时间格式
	 ******************************************************/
	toChar:function(datetime, format) {		
		if(datetime=="" || datetime==null || datetime==undefined){
			return "";
		}else{
			var date;
			if(typeof datetime == 'number'){
				date = new Date(datetime);
			}else{
				date = datetime;
			}
			var yyyy = date.getFullYear();
			var mm = date.getMonth()+1;
			var dd = date.getDate();
			var hh24 = date.getHours();
			var mi = date.getMinutes();
			var ss = date.getSeconds();
			var s1 = format.replace(/yyyy|YYYY/g, yyyy);
			var s2 = s1.replace(/mm|MM/g,mm<10 ? "0" + mm : mm);
			var s3 = s2.replace(/dd|DD/g,dd<10 ? "0" + dd : dd);
			var s4 = s3.replace(/hh24|HH24/g,hh24<10 ? "0" + hh24 : hh24);
			var s5 = s4.replace(/mi|MI/g,mi<10 ? "0" + mi : mi);
			var s6 = s5.replace(/ss|SS/g,ss<10 ? "0" + ss : ss);
			return s6;
		}		
	},
	
	/******************************************************
	 * 功能：判断是否为数字
	 * 描述：
	 * numstr：需要验证的字符串
	 * 用法：
	 * isNumber('123');//返回:true;
	 ******************************************************/
	isNumber:function(numstr) {
		var i,j,strTemp; 
		strTemp = "0123456789"; 
		if (numstr.length== 0)	{ return false; }
		for (i=0;i<numstr.length;i++) {
			j = strTemp.indexOf(numstr.charAt(i)); 
			if (j == -1)return false; 
		} 
		return true; 
	},
	
	/**
	 * 取得基础数据
	 */
	getBaseIno : function(PARENT_ID,result,youfn){
		var url = pcs.common.path + '/json?action=QUERY_T_BASE_INFO_BY_CONDITION_ACTION&PARENT_ID='+PARENT_ID;
		url=encodeURI(url);
		var xmlname='T_BASE_INFO';
		pcs.common.listPage(url,xmlname,result,youfn);
	},
	
	hideStatus:function(){
		window.status=' ';
	}	
};
