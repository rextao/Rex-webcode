this.ws=this.ws||{};
(function(){
    var Frame=function(str)
    {
        this.state = str;
        this.init();
    };

    var p=Frame.prototype;
    p.maxH=900;
    p.state="";
    p.isH=false;//是否横屏
    p.mainNavData=[
        {key:"home",title:"首页"},
        {key:"about",title:"关于我们"},
        {key:"service",title:"服务"},
        {key:"news",title:"新闻"},
        {key:"job",title:"招贤纳士"},
        {key:"contact",title:"联系我们"}
    ];
    /*p.navData=[
        {key:"guide",title:"引导页"},
        {key:"home",title:"首页"},
        {key:"about",title:"关于我们"},
        {key:"service",title:"服务"},
        {key:"news",title:"新闻"},
        {key:"job",title:"招贤纳士"},
        {key:"contact",title:"联系我们"},
        {key:"cases",title:"案例作品"},
        {key:"topic",title:"数据可视化"}
    ];*/
    p.navOut1 = {"color":"#818181","backgroundColor":"transparent"};
    p.navOut2 = {"color":"#9b0002","backgroundColor":"transparent"};
    p.navOver = {"color":"#FFFFFF","backgroundColor":"#840103"};

    p.init=function()
    {
        this.$navContainer = $("#navContainer");
        this.$logo = $("#navContainer>.content>.logo");
        this.$nav = $("#navContainer>.content>.nav");
        this.$navBg = $("#navContainer>.bg");
        this.$logoIcon = $("#navContainer>.logoIcon");
        this.$container=$("#container");
        this.$part = $("#container>.part");
        if(this.state=="main") this.$mainPart = this.$part.not("#homeContainer");
        this.$contnet = $("#container>.part>.content");
        this.$phone = $("#navContainer .phone");
        this.$sns = $("#navContainer .sns");
        this.$share = $("#navContainer .sns .share");
        this.$shareItem=$("#navContainer .sns .share .sharePanel .shareItem");
        this.$qq = $("#navContainer .sns .qq");
        this.$weixin =$("#navContainer .sns .weixin");
        this.$qrcodePanel = $("#navContainer .sns .qrcodePanel");
        this.$sina = $("#navContainer .sns .sina");
        this.$qrcodePanel = $(".qrcodePanel");

        //
        this.initResize();
        this.initMouseWheel();
        this.initNavContainer();
        this.initHash();
        this.updateW();
        this.initScroll();
        this.initShare();
        this.initOrientation();
        if(this.state=="cases")
        {
            this.initSubNav();
        }
        //
        var cur = this;
        this.$share.mouseenter(function(){
            $(this).css({"width":"230px","z-index":10});
        });
        this.$share.mouseleave(function(){
            $(this).css({"width":"40px","z-index":1});
        });
        this.$qq.mouseenter(function(){
            $(this).css({"width":"180px","z-index":10});
        });
        this.$qq.mouseleave(function(){
            $(this).css({"width":"40px","z-index":1});
        });
        this.$sina.mouseenter(function(){
            $(this).css({"width":"200px","z-index":10});
        });
        this.$sina.mouseleave(function(){
            $(this).css({"width":"40px","z-index":1});
        });
        this.$weixin.mouseenter(function(){
            $(this).css({"width":"200px","z-index":10});
            cur.$qrcodePanel.css({"width":"137px"});
        });
        this.$weixin.mouseleave(function(){
            $(this).css({"width":"40px","z-index":1});
            cur.$qrcodePanel.css({"width":"0px"});
        });
    };

    p.initResize=function()
    {
        var cur=this;
        $(window).resize(function(){
            if($(document).height()>cur.maxH)
            {
                //var topTarget=($(document).height()-cur.maxH)/2+"px";
                //cur.$navContainer.css("top",topTarget);
                //cur.$container.css("top",topTarget);
            }
            //cur.$contnet.css("top",(cur.$container.height()-cur.$contnet.height())/2);
        });
        $(window).triggerHandler("resize");
    };

    //==========================================mouseWheel=================================//
    p.targetX = 0;
    p.initMouseWheel=function()
    {
        var cur = this;

        this.isMac = Browser.Platform.mac;
        if (this.isMac) return; 
        $(document).mousewheel(function(event, delta, deltaX, deltaY){
            var startX = $(document).scrollLeft();
            //var tempX = delta*(-300);
            //if(tempX>600) tempX = 800;
            //if(tempX<-600) tempX = -800;
            //console.log(tempX)
            //var endX = $(document).scrollLeft()+tempX;
            var tempX;
            if(delta < 0 ) tempX = 480;
            if(delta > 0 ) tempX = -480;
            var endX = startX +tempX;

            cur.targetX = startX;
            TweenLite.to(cur, 0.5, {targetX:endX,onUpdateScope:cur,onUpdate:function(){
                        $(document).scrollLeft(this.targetX);}
            });
        });
    };

    //==========================================updateW===================================//
    p.updateW=function(){
        var cur=this;
        this.timer=setInterval(function(){
            var w=0;
            cur.$part.each(function(i){
                w+=$(this).width()
            });
            cur.$container.width(w+100);
        },50);
    };

    //========================================navContainer=================================//
    p.initNavContainer=function()
    {
        var cur=this;
        //IE6
        if(Browser.ie6)
        {
            cur.$navContainer.css("position","absolute");
           /* $(window).scroll(function(){
                 var posX = $(window).scrollLeft();
                 cur.$navContainer.css("left",posX);
            });*/
        }

        if(Browser.Platform.ios || Browser.Platform.android)
        {
            this.$nav.click(function(){
                if(!cur.isH) cur.$navBg.click();
            });
        }

        this.$logoIcon.click(function(){
            TweenLite.to(cur.$logoIcon, 0.5, {left:"-100px"});
            TweenLite.to(cur.$phone, 0.5, {left:"0",delay:1});
			TweenLite.to(cur.$sns, 0.5, {left:"0",delay:1.2});
            TweenLite.to(cur.$navBg, 0.5, {height:"101%"});
            if(Browser.ie6 || Browser.ie7 || Browser.ie8)
            {
                TweenLite.to(cur.$navBg, 0.5, {width:"180px",delay:0.1});
            }
            else
            {
                TweenLite.to(cur.$navBg, 0.5, {width:"180px",skewX:"-2.7deg",delay:0.1});
            }

            //
            TweenLite.to(cur.$logo, 0.5, {left:"20px",delay:0.5});
            cur.$nav.each(function(i){
                TweenLite.to($(this), 0.5, {left:"0px",delay:0.5+0.1*i});
            });
            TweenLite.to(cur.$container, 0.5, {left:"145px",delay:0.5});
        });
        this.$logoIcon.delay(2000).triggerHandler("click");

        this.$navBg.click(function(){
            TweenLite.to(cur.$logo, 0.5, {left:"-110px",delay:0});
            TweenLite.to(cur.$phone, 0.3, {left:"-200px",delay:0});
            TweenLite.to(cur.$sns, 0.3, {left:"-200px",delay:0});
            cur.$nav.each(function(i){
                TweenLite.to($(this), 0.3, {left:"-200px",delay:0.1*i});
            })
            //
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
            //
            TweenLite.to(cur.$container, 0.5, {left:"0",delay:0.5});
            if(cur.state=="cases")
            {
                cur.$caseNav.mouseleave();
            }
        });

        //========================================subNav=================================//
        p.initSubNav = function()
        {
            var cur = this;
            this.$subNavContainer = $("#navContainer .subNavContainer");
            this.$subNav = $("#navContainer .subNavContainer .subNavPanel .subNav");
            this.$caseNav = $("#navContainer .content .cases");
            //this.$caseNav.css("width","145px");
            this.$caseNav.mouseenter(function(){
                cur.$caseNav.css("width","145px");
                TweenLite.to(cur.$subNavContainer, 0.5, {width:"130px",ease:Sine.easeInOut});
                TweenLite.to(cur.$container, 0.5, {left:"270px",delay:0});
            });
            this.$caseNav.mouseleave(function(){
                cur.subNavTimer = setTimeout(function(){
                    cur.$caseNav.css("width","110px");
                    TweenLite.to(cur.$subNavContainer, 0.5, {width:"0px",ease:Sine.easeInOut,onComplete:function(){
                        cur.$caseNav.css("width","110px");
                    }});
                    TweenLite.to(cur.$container, 0.5, {left:"145px",delay:0});
                },200)
            });
            this.$subNavContainer.mouseenter(function(){
                if(cur.subNavTimer)
                {
                    clearTimeout(cur.subNavTimer);
                }
                cur.$caseNav.removeClass("navOut2").addClass("nav_over");
            });
            this.$subNavContainer.mouseleave(function(){
                cur.subNavTimer = setTimeout(function(){
                    TweenLite.to(cur.$subNavContainer, 0.5, {width:"0px",ease:Sine.easeInOut,onComplete:function(){
                        cur.$caseNav.css("width","110px");
                    }});
                    TweenLite.to(cur.$container, 0.5, {left:"145px",delay:0});
                    //cur.$caseNav.removeClass("nav_over").addClass("navOut2");
                    $(window).scroll();
                },200);
            });
            //
            setTimeout(function(){cur.$caseNav.mouseenter();},1500);
        };

        p.initHash=function()
        {
            var cur=this;
            this.hashChangeActive = true;
            $(window).bind("hashchange",function(event){
                if(cur.state=="main")
                {
                    var target;
                    if(location.hash=="#_home")
                    {
                        target=$("#guideContainer");
                        cur.setCurNav(0);
                    }
                    if(location.hash=="#_about")
                    {
                        target=$("#aboutContainer");
                        cur.setCurNav(1);
                    }
                    if(location.hash=="#_service")
                    {
                        target=$("#serviceContainer");
                        cur.setCurNav(2);
                    }
                    if(location.hash=="#_news")
                    {
                        target=$("#newsContainer");
                        cur.setCurNav(3);
                    }
                    if(location.hash=="#_job")
                    {
                        target=$("#jobContainer");
                        cur.setCurNav(4);
                    }
                    if(location.hash=="#_contact")
                    {
                        target=$("#contactContainer");
                        cur.setCurNav(5);
                    }
                    if(target)
                    {
						console.log(target.position().left);
                        TweenLite.to($("html,body"), 0.8, {scrollLeft:target.position().left});
                    }

                }
                if(cur.state=="cases")
                {
                    cur.setCurNav(6);
                    var target;
                    if(location.hash=="#_service")
                    {
                        target=$("#serviceContainer");
                        cur.setCurNav(2);
                    }
                    if(location.hash=="#_contact")
                    {
                        target=$("#contactContainer");
                        cur.setCurNav(6);
                    }
                    if(target)
                    {
                        TweenLite.to($("html,body"), 0.8, {scrollLeft:target.position().left});
                    }
                }
                if(cur.state=="topic")
                {
                    cur.setCurNav(7);
                    var target;
                    if(location.hash == "#_contact")
                    {
                        canMove = true;
                        target = $("#contactContainer");
                        cur.setCurNav(5);
                    }
                    if(target)
                    {
                        TweenLite.to($("html,body"), 0.8, {scrollLeft:target.position().left});
                    }
                }
				if(cur.state=="platform")
                {
                    cur.setCurNav(8);
                    var target;
                    if(location.hash == "#_contact")
                    {
                        canMove = true;
                        target = $("#contactContainer");
                        cur.setCurNav(5);
                    }
                    if(target)
                    {
                        TweenLite.to($("html,body"), 0.8, {scrollLeft:target.position().left});
                    }
                }
            });
            $(window).triggerHandler("hashchange");
        };

        //========================================scroll=================================//
        p.initScroll = function()
        {
            var cur = this;
            $(window).scroll(function(){
                if(cur.state=="main")
                {
                    cur.$mainPart.each(function(i){
                        var startX = parseInt($(this).position().left);
                        var endX = parseInt(startX+$(this).width());
                        if(i==0) endX=parseInt(startX+$("#homeContainer").position().left+$("#homeContainer").width());
                        if($(document).scrollLeft() >= startX && $(document).scrollLeft()< endX)
                        {
                            //console.log(i);
                            cur.setCurNav(i);
                            /*cur.hashChangeActive=false;
                             location.hash = "_"+cur.mainNavData[i]["key"];
                             cur.hashChangeActive=true;*/
                        }
                    });
                }
                if(cur.state=="cases")
                {
                    cur.$part.each(function(i){
                        var startX = $(this).position().left;
                        var endX = $(this).position().left+$(this).width();
                        if($(document).scrollLeft() >= startX && $(document).scrollLeft()< endX)
                        {
                            if(i==0)
                            {
                                cur.setCurNav(6);
                            }
                            if(i==1)
                            {
                                cur.setCurNav(2);
                            }
                            if(i==2)
                            {
                                cur.setCurNav(5);
                            }
                        }
                    });
                }
                if(cur.state=="topic")
                {

                    var startX = $("#contactContainer").position().left;
                    var endX = $("#contactContainer").position().left+$("#contactContainer").width();
                    if($(document).scrollLeft() >= startX && $(document).scrollLeft()< endX)
                    {
                        cur.setCurNav(5);
                    }
                    else
                    {
                        cur.setCurNav(7);
                    }
                }
            });
        };

        p.setCurNav=function(id)
        {
            var cur=this;
            this.$nav.each(function(i){
                if(i==id)
                {
                    if(i==6 || i==7 || i==8)
                    {
                        cur.$nav.eq(i).removeClass("navOut2").addClass("nav_over");
                    }
                    else
                    {
                        cur.$nav.eq(i).removeClass("navOut1").addClass("nav_over");
                    }

                }
                else
                {
                    if(i==6 || i==7 || i==8)
                    {
                        cur.$nav.eq(i).removeClass("nav_over").addClass("navOut2");
                    }
                    else
                    {
                        cur.$nav.eq(i).removeClass("nav_over").addClass("navOut1");
                    }

                }
            });
        };

        //========================================share=================================//
        p.initShare = function()
        {
            var cur = this;
            this.$shareItem.each(function(i){
                $(this).data("id",i);
            });
            this.$shareItem.click(function(){
                var id=$(this).data("id");
                if(id == 0) cur.toShare("weixin");
                if(id == 1) cur.toShare("tsina");
                if(id == 2) cur.toShare("tqq");
                if(id == 3) cur.toShare("renren");
            });
        };

        //分享整个网页
        p.toShare=function(webid)
        {
            var url = encodeURIComponent(location.href);
            var title = encodeURIComponent(document.title);
            var pic = this.getCurrentPath()+"images/logoIcon.png";
            pic = encodeURIComponent(pic);
            var summary = "北京万博思图主营业务:HTML5/Flash网站建设、HTML5/Flash设计开发、北京网站建设、数据可视化开发、Flash应用程序开发、游戏开发、手机游戏开发，我们的目标是做中国最专业的Flash网站建设团队,电话：01059070059";
            window.open("http://www.jiathis.com/send/?webid="+webid+"&url="+url+"&title="+title+"&pic="+pic+"&summary="+summary);
        };

        p.getCurrentPath = function()
        {
            var path = location.href.replace(/(.+\/).*$/g, '$1');
            return(path);
        };

        p.getRootPath = function()
        {
            var path = location.href.replace(/(.+?:\/\/.+?\/).*$/g, '$1');
            return(path);
        };

        p.initOrientation= function()
        {
            //alert(Browser.Platform.android);

            var cur = this;
            if(Browser.Platform.ios/* || Browser.Platform.android*/)
            {
                $(window).bind("orientationchange",function(){
                    if(Browser.Platform.ios)
                    {
                        if (Math.abs(window.orientation) == 90) {
                            //alert("我是ios的横屏");
                            cur.isH=true;
                        } else {
                           // alert("我是ios的竖屏");
                            cur.isH=false;
                        }
                    }
                   /* if(Browser.Platform.android)
                    {
                        if (Math.abs(window.orientation) != 90) {
                            alert("我是android的横屏");
                        } else {
                            alert("我是android的竖屏");
                        }
                    }*/
                });
                $(window).trigger("orientationchange");
            }
        }

    };
    ws.Frame=Frame;
})();
