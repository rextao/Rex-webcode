/**
 * 解决柱状图，横坐标全部显示
 * 问题：关键代码是formatter，通过对xlabel的设置，实现全部x坐标显示
 */
/**
 * 生成Echart的配置参数option
 * @param json            	输入json数据
 * @param chartTitle		图标题
 * @param chartType			图类型（line，bar，pie）只能是这3种类型
 * @param chartContentName  图上鼠标浮动时，显示小方块上面的题目
 * @returns option 			配置Echart的option
 */
function createChartArea(json,chartTitle,chartType,chartContentName){
    var _json =  json.data;
    var value = getJsonData(_json).value;
    var name = getJsonData(_json).name;
    var option =
        {
            title : {
                padding: [20,5,5,5],
                text: chartTitle,
                x:'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            itemStyle : {
                normal: {color : '#1c84c6'}
            },
            xAxis:  {
                type: 'category',
                data: name,
                axisLabel: {
                    formatter: function(val){
                        if(val.length >4 ){
                            val = val.substring(0,5)+"\n"+val.substring(5);
                        }
                        return val;
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} '
                }
            },
            series: [
                {
                    name:chartContentName,
                    type:chartType,
                    data:value
                }
            ]
        };
    return option;
}

function getJsonData(json){
    var arrVal = [];
    var arrName = [];
    var obj = {};
    for(var i =0 ; i <json.length;i++){
        arrVal.push(json[i].value);
        arrName.push(json[i].name);
    }
    obj.name = arrName;
    obj.value = arrVal;
    return obj;
}


/**
 * ajax的形式
 */
function czuData(){
    $.ajax({
        type: "post",
        async: false,
        url: "syfwzxt/rentalHouseAction!selectCzuData.action?",
        dataType: "json",
        success: function (result) {
            echarts.init(document.getElementById('perMouthChart')).setOption(createChartArea(result,'出租屋趋势图','line','出租屋'));
        },
        error: function (errorMsg) {}
    })
}