/**
 * 代码整理，对外调用createChartArea，可绘制饼图，单个柱状图，多柱状图
 * 问题：1、柱状图上的数字写死，查**********处
 *       2、如何处理图中既有折线图，又有bar
 *       3、如类似这种简易方式，传入参数多一个chartType
 *       4、如何处理多个图悬浮框单位问题
 *       5、如何处理数据为空，显示？
 */
/**
 * 判断json数据是多条还是单条
 * @param json
 * @returns {boolean}
 */
function ismultiData(json) {
    return  Array.isArray(json);
}
/**
 * 将json数据转为本js要求格式
 * [{"key": "贫困", "value": 1741}, {"key": "非贫困", "value": 1001}]或
 * "result":[
             {"2010":[{"key":"因灾","value":72},{"key":"因病","value":14},{"key":"因残","value":53}]},
             {"2011":[{"key":"因灾","value":55},{"key":"因病","value":22},{"key":"因残","value":55}]},
             {"2012":[{"key":"因灾","value":55},{"key":"因病","value":22},{"key":"因残","value":55}]}
             ]};
 * @param json
 */
function jsonToUniform(json) {
    var arr = [];
    for (var kk in json) {
        var obj = {};
        obj[kk] = json[kk];
        arr.push(obj);
    }
    return arr;
}
function jsonToChart(json,o) {
    var result = {};
    if(ismultiData(json)){ // 单一数据结构
        var objValue = turnChartObj(json);
        result.series = objValue.value;
        result.xlabel = objValue.name;
        result.muli = false;
        result.objJson = objValue;
        result.arrJson = turnChartArr(json);
        return result;
    }else{
        json = jsonToUniform(json);
        var len = json.length,
            series = [],
            legend = [],
            seriesType =  barlineType(o,len),// obj参数简易办法
            xlabel;
        for (var i = 0; i < len; i++) {
            for (var j in json[i]) {
                var obj = {};
                obj.name = j;
                obj.type = seriesType[i];
                var value = json[i][j];
                obj.data = turnChartObj(value).value;
                if (i == 0) {
                    xlabel = turnChartObj(value).name;
                }
                /*******************************************************/
                if(seriesType[i] == "bar"){
                    obj.label = {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    };
                }
                /*******************************************************/
                legend.push(obj.name);
                series.push(obj);
            }
        }
        result.series = series;
        result.xlabel = xlabel;
        result.muli = true;
        result.legend = legend;
        console.log(result);
        return result;
    }
}
/**
 * 简单方法，需要改进
 * @param obj
 * @param len 默认产生typeArr长度
 */
function barlineType(obj,len) {
    var arr = [];
    for(var i = 0 ; i<len; i++){
        arr.push("bar")
    }
    return obj.typeArr || arr;
}
/**
 *
 * @param obj
 * @returns {*}　返回echarts的引用
 */
function createChartArea(obj) {
    var result = jsonToChart(obj.json,obj),
        chartType = obj.type,
        chartTitle = obj.title,
        unit = typeof(obj.unit) == "undefined" ? '' : obj.unit, // 避免undefined，其他为空，echart自己处理
        chartContentName = obj.typeName || "";
    var option;
    if (chartType === 'line' || chartType === 'bar') {
        option = lineAndBarChart(chartTitle, unit, chartContentName, chartType,result);
    }
    if (chartType === 'pie') {
        option = pieChart(result, chartType, chartTitle, unit, chartContentName, obj.radius, obj.selected)
    }
    var charts = echarts.init(document.getElementById(obj.id));
    charts.setOption(option);
    return charts;
}
/**
 * 绘制线和bar图，可绘制多列数据
 * @param chartTitle
 * @param unit
 * @param chartContentName
 * @param chartType
 * @param result
 * @returns {{title: {padding: number[], text: *, x: string}, legend: {data: (Array|*), right: string}, xAxis: {type: string, data: *, axisLabel: {formatter: option.xAxis.axisLabel.formatter}}, yAxis: {type: string, axisLabel: {formatter: string}}}}
 */
function lineAndBarChart(chartTitle, unit, chartContentName, chartType,result) {
    var serArr = result.series, xlabel = result.xlabel, isMulti = result.muli,legend = result.legend;

    legend = legend || [chartContentName];
    var option = {
        title: {
            text: chartTitle,
            x: 'center'
        },
        legend: {
            data:legend,
            right: '5%'
        },
        xAxis: {
            type: 'category',
            data: xlabel,
            axisLabel: {
                formatter: function (val) {
                    var a = "";
                    for (var i = 0; i < val.length; i += 6) {
                        a += val.substring(i, i + 6) + "\n";
                    }
                    return a;
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value} ' + unit
            }
        }
    };
    // 如series只有一个数据
    if (!isMulti) {
        option.tooltip = {
            trigger: 'axis',
            formatter: "{a} <br/>{b} : {c}" + unit
        };
        option.itemStyle = {
            normal: {color: '#1c84c6'}
        };
        option.series = {
            name: chartContentName,
            type: chartType,
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            data: serArr
        };
        return option;
    } else {
        option.tooltip = {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        };
        option.series = serArr;
    }
    return option;
}

/**
 * 提取[{"key":"因灾","value":72},{"key":"因病","value":14},{"key":"因残","value":53}]数据
 * 转换为 key为一个数组【】，value为一个数组：【】
 *
 * @param json
 * @returns {{}}
 */
function turnChartObj(json) {
    var arrVal = [];
    var arrName = [];
    var obj = {};
    for (var i = 0; i < json.length; i++) {
        arrVal.push(json[i].value);
        arrName.push(json[i].key);
    }
    obj.name = arrName;
    obj.value = arrVal;
    return obj;
}
/**
 * 将json的key-value数据，转换为echart需要的格式
 * @param json
 * @returns {Array}
 */
function turnChartArr(json) {
    var arr = [];
    for (var i = 0; i < json.length; i++) {
        var t = {};
        t.name = json[i].key;
        t.value = json[i].value;
        arr.push(t);
    }
    return arr;
}


function pieChart(result, chartType, chartTitle, unit, chartContentName, radius, isSelected) {
    if (result.muli) {
        throw new Error("数据格式不支持");
    } else {
        var _radius = radius || '55%',
            _isSelected = isSelected || false,
            name = result.objJson.name,
            _json = result.arrJson;
        if (_isSelected) {
            _json = addSelectTrue(_json);
        }
        return {
            title: {
                padding: [20, 5, 5, 5],
                text: chartTitle,
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}" + unit + " ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'right',
                top: 'bottom',
                data: name
            },
            series: [
                {
                    name: chartContentName,
                    type: chartType,
                    radius: _radius,
                    center: ['50%', '60%'],
                    data: _json,
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
    }
}
/**
 * 为pie添加图能够分开的例子
 * @param json
 * @returns {*}
 */
function addSelectTrue(json) {
    for (var i = 0; i < json.length; i++) {
        json[i].selected = true;
    }
    console.log(json)
    return json;
}



