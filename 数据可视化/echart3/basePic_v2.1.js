/**
 *
 *
 *
 * 是用：{"flag":true,"msg":"贫困户致贫原因统计成功","result":[{"key":"因灾","value":72},{"key":"因病","value":141},{"key":"因残","value":533},{"key":"因学","value":2},{"key":"缺技术","value":520},{"key":"缺劳力","value":685},{"key":"缺发展资金","value":290},{"key":"缺土地","value":176},{"key":"交通条件落后","value":4},{"key":"自身发展动力不足","value":211},{"key":"其他","value":67}]}
 */
/**
 *
 * @param obj
 * @returns {*}　返回echarts的引用
 */
function createChartArea(obj){
    var _json =  turnJsonData(obj.json),
        chartType = obj.type ,
        chartTitle = obj.title ,
        unit = typeof(obj.unit)=="undefined" ?'' : obj.unit , // 避免undefined，其他为空，echart自己处理
        chartContentName = obj.typeName;
    var value = getJsonData(_json).value;
    var name =  getJsonData(_json).name;

    if (chartType ==='line' || chartType ==='bar') {
        var option ={
            title : {
                padding: [20,5,5,5],
                text: chartTitle,
                x:'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: "{a} <br/>{b} : {c}"+unit
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
                        for(var i = 0 ; i < val.length ; i +=6){
                            a += val.substring(i,i+6) +"\n";
                        }
                        return a;
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} '+unit
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
        if(chartType ==='line'){
            option.xAxis.boundaryGap =false;
        }
    };
    if (chartType === 'pie') {
        var _radius = obj.radius || '55%';
        var isSelected = obj.selected || false;
        if(isSelected){
            _json = addSelectTrue(_json);
        }
        option = {
            title : {
                padding: [20,5,5,5],
                text: chartTitle,
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}"+unit+" ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                top: 'bottom',
                data: name
            },
            series : [
                {
                    name: chartContentName,
                    type: chartType,
                    radius : _radius,
                    center: ['50%', '60%'],
                    data:_json,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    };
    var charts = echarts.init(document.getElementById(obj.id));
    charts.setOption(option);
    return charts;
}
/**
 * 为pie添加能够分开的例
 * @param json
 * @returns {*}
 */
function addSelectTrue(json) {
    for(var i = 0 ; i < json.length ; i++){
        json[i].selected = true;
    }
    return json;
}
/**
 * 将json的key-value数据，转换为echart需要的格式
 * @param json
 * @returns {Array}
 */
function turnJsonData(json){
    var arr=[];
    for(var i = 0 ; i < json.length ; i++){
        var t = {};
        t.name = json[i].key;
        t.value = json[i].value;
        arr.push(t);
    }
    return arr;
}

/**
 *
 * @param echarts echarts对象，由echarts.init(document.getElementById());
 * @param json
 */
function changeData(echarts,json) {
    var _json = json.data;
    var value = getJsonData(_json).value;
    var name = getJsonData(_json).name;
    echarts.setOption({
        xAxis: {
            data: name
        },
        series: [
            {
                data: value
            }
        ]
    });
}
function changePieData(echarts,json) {
    echarts.setOption({
        series : [
            {
                data:json.data
            }
        ]
    });
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

