/**
 * Created by Administrator on 2017/7/12.
 */
this.rx = this.rx || {}
$(function () {
    var nav = {};
    nav.state = false;
    nav.init =function(){
        nav.initNavContainer();
        nav.scroll();
        nav.initHash();
    };
    nav.initNavContainer = function () {
        var cur = this;
        //菜单效果
        cur.$logoIcon = $("#navContainer").find(".logoIcon");
        cur.$logo = $("#navContainer>.content>.logo");
        cur.$nav = $("#navContainer>.content>.nav");
        cur.$navBg = $("#navContainer>.bg");
        cur.$container=$("#container");
        cur.$part = $("#container>.part");
        cur.$phone = $("#navContainer .phone");
        cur.$sns = $("#navContainer .sns");
        cur.$part = $("#container>.part");
        // 从匹配元素的集合中删除与指定表达式匹配的元素
        cur.$mainPart = cur.$part.not("#homeContainer");

        cur.$logoIcon.click(function () {
            TweenLite.to(cur.$logoIcon, 0.5, {left: "-100px"});
            TweenLite.to(cur.$phone, 0.5, {left: "0", delay: 1});
            TweenLite.to(cur.$sns, 0.5, {left: "0", delay: 1.2});
            TweenLite.to(cur.$navBg, 0.5, {height: "101%"});
            if (Browser.ie6 || Browser.ie7 || Browser.ie8) {
                TweenLite.to(cur.$navBg, 0.5, {width: "180px", delay: 0.1});
            }
            else {
                TweenLite.to(cur.$navBg, 0.5, {width: "180px", skewX: "-2.7deg", delay: 0.1});
            }

            //
            TweenLite.to(cur.$logo, 0.5, {left: "20px", delay: 0.5});
            cur.$nav.each(function (i) {
                TweenLite.to($(this), 0.5, {left: "0px", delay: 0.5 + 0.1 * i});
            });
            TweenLite.to(cur.$container, 0.5, {left: "145px", delay: 0.5});
        });
        // triggerHandler会阻止浏览器的默认行为，trigger不会
        cur.$logoIcon.delay(2000).triggerHandler("click");
        cur.$navBg.click(function(){
            TweenLite.to(cur.$logo, 0.5, {left:"-110px",delay:0});
            TweenLite.to(cur.$phone, 0.3, {left:"-200px",delay:0});
            TweenLite.to(cur.$sns, 0.3, {left:"-200px",delay:0});
            cur.$nav.each(function(i){
                TweenLite.to($(this), 0.3, {left:"-200px",delay:0.1*i});
            });
            if(Browser.ie6 || Browser.ie7 || Browser.ie8)
            {
                TweenLite.to(cur.$navBg, 0.5, {width:"80px",delay:0.5});
            }
            else
            {
                TweenLite.to(cur.$navBg, 0.5, {width:"80px",skewX:"0deg",delay:0.5});
            }
            TweenLite.to(cur.$navBg, 0.5, {height:"60px",delay:1});
            TweenLite.to(cur.$logoIcon, 0.5, {left:"0",delay:1.5});
            TweenLite.to(cur.$container, 0.5, {left:"0",delay:0.5});
            if(cur.state=="cases")
            {
                cur.$caseNav.mouseleave();
            }
        });
        /*鼠标滚动设置菜单样式—start*/
        nav.scroll =function(){
            var cur = this;
            if(!nav.state){
                return;
            }
            $(window).scroll(function(){
                cur.$part.each(function(i){
                    var startX = parseInt($(this).position().left);
                    var endX = parseInt(startX+$(this).width());
                    if($(document).scrollLeft() >= startX && $(document).scrollLeft()< endX)
                    {
                        cur.setCurNav(i);
                    }
                });
            });
        };
        nav.setCurNav =function(id){
            this.$nav.removeClass("nav_over").addClass("navOut1");
            this.$nav.eq(id).removeClass("navOut1").addClass("nav_over");
        };
        /*鼠标滚动设置菜单样式—end*/
        /*点击菜单，页面滚动=*/
        nav.initHash=function()
        {
            var cur=this;
            $(window).bind("hashchange",function(event){
                nav.state =true;
                var clickHash = location.hash+"",
                    target;
                cur.$part.each(function(i){
                    if(clickHash == cur.$part.eq(i).data("href")){
                        target = cur.$part.eq(i);
                        nav.setCurNav(i);
                    }
                });
                if(target)
                {
                    TweenLite.to($("html,body"), 0.8, {scrollLeft:target.position().left});
                }
            });
            $(window).triggerHandler("hashchange");
        };


    };

    rx.nav = nav;
});