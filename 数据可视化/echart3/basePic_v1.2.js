/**
 * 简化调用
 * 问题：之前的调用要传入很多参数，比较麻烦
 *      并创建changeData用于只改变json数据时，直接调用
 * 测试：var obj = {
            id : "qsChart",
            json : json,
            title : "出租屋趋势图",
            type : "line",
            typeName : "出租屋"
        };
        var a = createChartArea(obj);
        setInterval("a.setOption(changeData(json1))",3000) ;
 */
/**
 *
 * @param obj
 * @returns {*}　返回echarts的引用
 */
function createChartArea(obj){
    var _json =  obj.json.data;
    var value = getJsonData(_json).value;
    var name = getJsonData(_json).name;
    var option =
        {
            title : {
                padding: [20,5,5,5],
                text: obj.title,
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
                        var a = "";
                        for(var i = 0 ; i < val.length ; i +=4){
                            a += val.substring(i,i+4) +"\n";
                        }
                        return a;
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
                    name:obj.typeName,
                    type:obj.type,
                    data:value
                }
            ]
        };
    var charts = echarts.init(document.getElementById(obj.id));
    charts.setOption(option);
    return charts;
}
function changeData(json) {
    var _json =  json.data;
    var value = getJsonData(_json).value;
    var name = getJsonData(_json).name;
    var option =
    {
        xAxis:  {
            data: name
        },
        series: [
            {
                data: value
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