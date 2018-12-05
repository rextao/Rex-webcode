(function(w){
    if(!!w.mapResult) return;
    var mapResult = {
        /**
         * 展示查询结果
         * @param json    必须是{"data":{[{"name":"","certificateNumber":""},....]}}
         */
        showResult :function(json){
            if(!json){
                if(!!console) console.info("数据错误");
                return;
            }
            $('#pagination').twbsPagination({
                totalPages: mapResult.zzTotalPages(json,10),
                visiblePages: 5,//默认显示页标签数
                onPageClick: function (event, page) {
                    $('#page-content').html(mapResult.createPage(json,page,10));
                }
            });
        },
        /**
         * 生成每一个分页内容
         * @param json			json数据
         * @param page			第几页
         * @param pageContentNum  每页显示的div个数
         * @returns {String}
         */
        createPage : function(json,page,pageContentNum){
            var totalPages = mapResult.zzTotalPages(json,pageContentNum);
            var beginIndex =(page-1) * pageContentNum ;
            var len = json.data.length;
            var lastIndex = page * pageContentNum ;
            var labelNum = 1;
            if (lastIndex > len) {
                lastIndex =  len;
            }
            var data = [];
            for(var i = beginIndex ;i < lastIndex ; i++){
                data.push(json.data[i]);
            }
            return this.createContent(data);
        },
        /**
         * 根据json判断总共页数
         * @param json
         * @param pageContentNum  每页显示的div个数
         * @returns
         */
        zzTotalPages : function(json,pageContentNum){
            return Math.ceil(json.data.length/pageContentNum) ;
        },
        /**
         * 生成map右侧每个div
         * @param index			查询结果序号（1开始）
         * @param json			查询的json
         * @param labelNum 		头像上面标号
         * @returns {String}
         */
        createContent : function(data){
            var h = [];
            for(var i in data){
                var labelNum = parseInt(i)+1;
                h.push('<div class="ibox-content " data-level='+labelNum+'>');
                h.push('<div class="row" >');
                h.push('<div class="col-xs-4">');
                h.push('<span class="label .zzMap-Label ">'+labelNum+'</span>');
                h.push('<div class="form-group text-left" >');
                h.push('<img id="imgUrl" src=/images/nopic.gif class="photo-2"/>');
                h.push('</div>');
                h.push('</div> ');
                h.push('<div class="col-xs-8">');
                h.push('<div class="form-group form-inline"  ">');
                for(var key in data[i]){
                    h.push('<p><span class="zzDetail-bold">'+key+'：</span></p>');
                    h.push('<p>'+data[i][key]+'</p>');
                    h.push('<div class="zzDetail-line"></div>');
                }
                h.push('</div></div></div></div>');
            }
            return h.join('');
        },
        // 点击右侧div事件
        init : function(){
            $("#page-content").on("click",".ibox-content",function(){
                alert($(this).attr('data-level'));
            });
        }
    };

    w.mapResult = mapResult;
})(window);


$(function () {
    var json1 = {"data" :[{"姓名":'雪山飞狐',"身份证号":"1231121113322341230","地址":"XXXXXXXXXXXXXXXXXXXXXXXXSSSSSSSs"},
        {"姓名":'雪山飞狐2',"身份证号":"aa1231203123123"},
        {"姓名":'雪山飞狐3',"身份证号":"bb1231203123123"},
        {"姓名":'雪山飞狐4',"身份证号":"cc1231203123123"},
        {"姓名":'雪山飞狐5',"身份证号":"dd1231203123123"},
        {"姓名":'雪山飞狐6',"身份证号":"ee1231203123123"},
        {"姓名":'雪山飞狐7',"身份证号":"ff1231203123123"},
        {"姓名":'雪山飞狐8',"身份证号":"ff1231203123123"},
        {"姓名":'雪山飞狐9',"身份证号":"ff1231203123123"},
        {"姓名":'雪山飞狐10',"身份证号":"ff1231203123123"},
        {"姓名":'雪山飞狐11',"身份证号":"ff1231203123123"}
    ]};
    mapResult.showResult(json1);
    mapResult.init();
});
