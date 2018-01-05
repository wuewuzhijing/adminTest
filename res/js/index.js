$(function () {
    init();
    $("[nav-menu]").each(function () {
        $(this).bind("click", function () {
            var nav = $(this).attr("nav-menu");
            var sn = nav.split(",");
            if (sn[sn.length - 1] == '/sirona' || sn[sn.length - 1] == '/druid') {
                window.open(sys.rootPath + sn[sn.length - 1]);

                //处理目录类型的点击事件
                $(this).parent("li").siblings().find("ul.nav-show").removeClass('nav-show').addClass('nav-hide').attr('style', 'display:none');
                //处理菜单类型的点击事件
                $(this).parent().parent().parent("li").siblings().find("ul.nav-show").removeClass('nav-show').addClass('nav-hide').attr('style', 'display:none');
                $("ul.nav-list").find("li.active").removeClass("active").removeClass('open');
                $(this).parent().addClass("active").parent().parent("li").addClass('active open');

                //清除用户信息菜单样式
                $(".user-menu").find('li').each(function () {
                    $(this).removeClass('active');
                });

            } else {

                var breadcrumb = '<li><i class="ace-icon fa fa-home home-icon"></i><a href="javascript:window.location.reload();">首页</a></li>';
                for (var i = 0; i < sn.length - 1; i++) {
                    breadcrumb += '<li class="active">' + sn[i] + '</li>';
                }

                //设置面包屑内容
                $(".breadcrumb").html(breadcrumb);
                //加载页面
                if ($("#laydate_box").length > 0) {
                    $("#laydate_box").remove();
                }
                $(".page-content").load(sys.rootPath + sn[sn.length - 1]);
                //处理目录类型的点击事件
                $(this).parent("li").siblings().find("ul.nav-show").removeClass('nav-show').addClass('nav-hide').attr('style', 'display:none');
                //处理菜单类型的点击事件
                $(this).parent().parent().parent("li").siblings().find("ul.nav-show").removeClass('nav-show').addClass('nav-hide').attr('style', 'display:none');
                $("ul.nav-list").find("li.active").removeClass("active").removeClass('open');
                $(this).parent().addClass("active").parent().parent("li").addClass('active open');

                //清除用户信息菜单样式
                $(".user-menu").find('li').each(function () {
                    $(this).removeClass('active');
                });

            }

        });
    });

    $("#ace-settings-navbar").click();
    $("#ace-settings-sidebar").click();
    //$("#ace-settings-breadcrumbs").click();
    $("html").niceScroll({
        cursorborderradius: "5px",
        cursorwidth: 10
    });

    $(".user-menu").find('li').each(function () {
        $(this).bind('click', function () {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
        });
    });

    validateUserForm();
});

function init() {
    $(".page-content").load(sys.rootPath + "/adminHome/welcome.action");
    $(".breadcrumb").html('<li><i class="ace-icon fa fa-home home-icon"></i><a href="javascript:window.location.reload();">首页</a></li>');
}

//监听浏览器窗口大小变化
$(window).resize(function () {
    $("html").getNiceScroll().resize();
});


/**
 *加载非菜单展示页面
 * @param nav 待加载的资源URL
 * @param title top导航标题
 */
function loadPage(nav, title) {
    if ($("#laydate_box").length > 0) {
        $("#laydate_box").remove();
    }
    if ($(".breadcrumb li.curr").length > 0) {
        $(".breadcrumb").find("li.curr").remove();
    }
    if (title != undefined) {
        $(".breadcrumb").append('<li class="curr">' + title + '</li>');
    }
    //记录当前页
    if ($("#jsonmap").length > 0) {
        var page = $('#jsonmap').getGridParam('page');
        var rows = $('#jsonmap').getGridParam('rowNum') == null ? 10 : $('#jsonmap').getGridParam('rowNum');
        var searchStr = "";
        if ($("#searchInput").length > 0) {
            searchStr = $("#searchInput").val();
        }
        if (nav.endsWith(".action")) {
            nav = nav + "?";
        } else {
            nav = nav + "&";
        }
        $(".page-content").load(sys.rootPath + nav + "page=" + page + "&rows=" + rows + "&searchStr=" + searchStr);
    } else {
        $(".page-content").load(sys.rootPath + nav);
    }
}

//loadPage("/adminAccident/listUI.action");

/**
 * 新增
 * @param {Object} nav  提交url
 */
function addModel(nav) {
    //加载新增页面
    loadPage(nav);
}


/**
 * 删除
 * @param {Object} nav  提交url
 * @param callback 主函数执行完毕后调用的回调函数名称
 */
function delModel(nav, callback, id) {
    layer.confirm('确认删除吗？', {icon: 3, title: '删除提示'}, function (index, layero) {
        $.ajax({
            type: "POST",
            url: sys.rootPath + nav,
            data: {
                "id": id
            },
            dataType: "json",
            success: function (resultdata) {
                if (resultdata.success) {
                    layer.msg(resultdata.message, {icon: 1});
                    if (callback) {
                        callback();
                    }
                } else {
                    layer.msg(resultdata.message, {icon: 5});
                }
            },
            error: function (data, errorMsg) {
                layer.msg('服务器未响应,请稍后再试', {icon: 3});
            }
        });
        layer.close(index);
    });
}

/**
 * 提交表单
 * 适用场景：form表单的提交，主要用在用户、角色、资源等表单的添加、修改等
 * @param {Object} commitUrl 表单提交地址
 * @param {Object} listUrl 表单提交成功后转向的列表页地址
 */
function commit(formId, commitUrl, jumpUrl) {
    //组装表单数据
    var data = $("#" + formId).serialize();
//    if(undefined != $("#pageNum").val())
//    {
//       jumpUrl = jumpUrl + '?pageNum=' + $("#pageNum").val() + '&pageSize=' + $("#pageSize").val() + '&orderByColumn=' + $("#orderByColumn").val() + '&orderByType=' + $("#orderByType").val();
//    }
    $.ajax({
        type: "POST",
        url: sys.rootPath + commitUrl,
        data: data,
        dataType: "json",
        success: function (resultdata) {
            if (resultdata.success) {
                layer.msg(resultdata.message, {icon: 1});
                loadPage(jumpUrl);
            } else {
                layer.msg(resultdata.message, {icon: 5});
            }
        },
        error: function (data, errorMsg) {
            layer.msg(data.responseText, {icon: 2});
        }
    });
}

$.ajaxSetup({
    beforeSend: function (xhr) {
        index = layer.load();
    },
    complete: function (xhr, status) {
        layer.close(index);
    }
});

function validateUserForm() {
    $('#changePassWordForm').validate({
        errorElement: 'div',
        errorClass: 'help-block',
        focusInvalid: false,
        ignore: "",
        rules: {
            oldPassWord: {
                required: true
            },
            newPassWord: {
                required: true
            }
        },
        messages: {
            oldPassWord: {
                required: "请填写原密码",
            },
            newPassWord: {
                required: "请填新密码",
            }
        },
        highlight: function (e) {
            $(e).closest('.form-group').removeClass('has-info').addClass('has-error');
        },
        success: function (e) {
            $(e).closest('.form-group').removeClass('has-error').addClass('has-success');
            $(e).remove();
        },
        errorPlacement: function (error, element) {
            if (element.is('input[type=checkbox]') || element.is('input[type=radio]')) {
                var controls = element.closest('div[class*="col-"]');
                if (controls.find(':checkbox,:radio').length > 1) controls.append(error);
                else error.insertAfter(element.nextAll('.lbl:eq(0)').eq(0));
            }
            else if (element.is('.select2')) {
                error.insertAfter(element.siblings('[class*="select2-container"]:eq(0)'));
            }
            else if (element.is('.chosen-select')) {
                error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
            }
            else error.insertAfter(element.parent());
        },
        submitHandler: function (form) {
            var data = $("#changePassWordForm").serialize();
            var index;
            $.ajax({
                type: "POST",
                url: sys.rootPath + "/adminAdminUser/changePassWord.action",
                data: data,
                dataType: "json",
                success: function (resultdata) {
                    if (resultdata.success) {
                        layer.msg(resultdata.message, {icon: 1});
                        $("#pswmodal").modal("hide");
                    } else {
                        layer.msg(resultdata.message, {icon: 5});
                    }
                },
                error: function (data, errorMsg) {
                    layer.msg(data.responseText, {icon: 2});
                }
            });
        }
    });
}

/**
 * 模糊查询
 */
function searchStr() {
    $("#jsonmap").jqGrid('setGridParam', {
        datatype: 'json',
        postData: {'searchStr': $("#searchInput").val()},
        page: 1
    }).trigger("reloadGrid");
}

/**
 * 返回表单数据对象
 * @param form
 * @returns 对象
 */
function parseToObj(form) {
    var o = {};
    $.each($("#" + form).serializeArray(), function (index) {
        if (o[this['name']]) {
            o[this['name']] = o[this['name']] + "," + this['value'];
        } else {
            o[this['name']] = this['value'];
        }
    });
    return o;
}

/**
 * 键值对
 */
function Map() {
    this.keys = new Array();
    this.data = new Array();
    this.set = function (key, value) {
        if (this.data[key] == null) {
            this.keys.push(value);
        }
        this.data[key] = value;
    };
    this.get = function (key) {
        return this.data[key];
    };
    //去除键值，(去除键数据中的键名及对应的值)
    this.remove = function (key) {
        this.keys.remove(key);
        this.data[key] = null;
    };
    //判断键值元素是否为空
    this.isEmpty = function () {
        return this.keys.length == 0;
    };
    //获取键值元素大小
    this.size = function () {
        return this.keys.length;
    };
}

/**
 * 格式化jqgrid cell图片
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {String}
 */
function formatCellImg(cellvalue, options, rowObject) {
    if (cellvalue != "")
        return "<a href=" + cellvalue + " target='_Blank'><img alt='' src=" + cellvalue + " style='height: 25px;width: auto;max-width:70px;'></a>";
    return cellvalue;
}

//验证管理员账号
function validUserName(userName) {
    var pat = new RegExp("^[A-Za-z0-9]{4,18}$");
    return pat.test(userName);
}

//验证电话号码
function validPhone(userName) {
    var pat = new RegExp("^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$");
    return pat.test(userName);
}

//function checkUserName(){
//	var checkTipDiv="";
//	$("#checkI").removeClass("ace-icon fa fa-check-circle fa-times-circle");
//	$("#checkDiv").removeClass("has-error has-success");
//	var userName = $("#userName").val();
//	if(userName==undefined || userName==""){
//		return;
//	}
//	if(userName != ""){
//		if(validUserName(userName)){
//			$.get(sys.rootPath+"/user/checkUserName.action",{userName:userName},function(data){
//				if(data.success){
//					//success
//					$("#checkI").addClass("ace-icon fa fa-check-circle");
//					$("#checkDiv").addClass("has-success");
//					$("#checkTipDiv").text("");
//				}else{
//					//fail
//					$("#checkI").addClass("ace-icon fa fa-times-circle");
//					$("#checkDiv").addClass("has-error");
//					$("#checkTipDiv").text("账号已被使用");
//				}
//			},"json");
//		}else{
//			$("#checkI").addClass("ace-icon fa fa-times-circle");
//			$("#checkDiv").addClass("has-error");
//			$("#checkTipDiv").text("账号由4-18位字母或数字组成");
//		}
//	}else{
//		$("#checkTipDiv").text("账号由4-18位字母或数字组成，添加成功后，管理员账号将不可更改");
//	}
//}
//function checkPhone(){
//	var checkTipDiv="";
//	$("#checkI").removeClass("ace-icon fa fa-check-circle fa-times-circle");
//	$("#checkDiv").removeClass("has-error has-success");
//	var userName = $("#userName").val();
//	if(userName==undefined || userName==""){
//		return;
//	}
//	if(userName != ""){
//		if(validPhone(userName)){
//			$.get(sys.rootPath+"/user/checkUserName.action",{userName:userName},function(data){
//				if(data.success){
//					//success
//					$("#checkI").addClass("ace-icon fa fa-check-circle");
//					$("#checkDiv").addClass("has-success");
//					$("#checkTipDiv").text("");
//				}else{
//					//fail
//					$("#checkI").addClass("ace-icon fa fa-times-circle");
//					$("#checkDiv").addClass("has-error");
//					$("#checkTipDiv").text(data.message);
//				}
//			},"json");
//		}else{
//			$("#checkI").addClass("ace-icon fa fa-times-circle");
//			$("#checkDiv").addClass("has-error");
//			$("#checkTipDiv").text("请填写正确的手机号码");
//		}
//	}else{
//		$("#checkTipDiv").text("添加成功后，手机号码将作为登录账号");
//	}
//}

//点击查看图片
$(".uploader img").click(function () {
    window.open(this.src);
});

var timer;

function startTimer() {
    clearTimeout(timer);
    timer = setTimeout(function () {
        layer.msg("登录过期，请重新登录");
        location.href = sys.rootPath + "/adminLogin/login.action";
    }, 1800000);
}

document.onkeydown = document.onmousedown = startTimer;
startTimer();