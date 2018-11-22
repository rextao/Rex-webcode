/**
 * 解决之前问题，能绘制缺项，pie，bar，图，可以看index.html
 */
/**
 * 判断json数据是多条还是单条
 * @param json
 * @returns {boolean}
 */
function ismultiData(json) {
    return  !Array.isArray(json);
}
/**
 * 外部调用主入口
 */
function createChartArea(obj){
    var json = obj.json ,
        result = {}  ;         // 存储绘图需要的数据格式
        result.feature = objFeature(obj);    // 数据个性特征
        result.option = {};     // 数据个性化option
    if(!ismultiData(json)){
        result = singleDataResult(obj,result);
        drawEchart(obj,result);
    }else{
        result = mutiDataResult(obj,result);
        drawEchart(obj,result);
    }
}
// 获取设置的特征参数
function objFeature(obj){
    var feature = {};
    feature.showNum =  obj.showNum || false;
    feature.lacked = obj.lacked || false;
    feature.typeArr = obj.typeArr || false; //多条数据，每条显示类型
    feature.radius = obj.radius || '55%';
    feature.selected = obj.selected || false;
    return feature;
}
/**
 * 获取单数据的result
 * @param obj
 * @param result
 * @return {*}
 */
function singleDataResult(obj,result) {
    var json = obj.json;
    var objValue = turnChartObj(json);
    result.series = objValue.value;
    result.xlabel = objValue.name;
    result.muli = false;
    result.objJson = objValue;
    result.arrJson = turnChartArr(json);
    return result;
}
/**
 *
 * @param obj html页面传来的对象
 * @param result 必须包含result.series、result.xlabel、result.muli、result.legend
 * @returns {Array}
 */
function mutiDataResult(obj,result){
    var lacked = result.feature.lacked;
    if(obj.type == "pie"){
        alert("多条数据不能绘制饼状图");
        return [];
    }
    var json = obj.json;
    if(!lacked){
        return unlackedData(json,result);
    }else {
        return lackedData(json,result);
    }
}
function unlackedData(json,result) {
    return multiComResult(json,result);
}
function lackedData(json,result) {
    var _json = addLackedData(json);
    return multiComResult(_json, result);
}

/**
 * 产生多条数据的result，包含result.series、result.xlabel、result.muli、result.legend
 * @param json  形如下面，不能缺项
 * {"资金总额(万元)": [{"key": "养殖业", "value": 555.00}, {"key": "教育转移培训", "value": 10000.00}],
 *  "覆盖人数": [{"key": "养殖业", "value": 51}, {"key": "教育转移培训", "value": 100}]}
 * @param typeArr
 * @returns {Array}
 */
function multiComResult(json,result) {
    var typeArr = result.feature.typeArr;
    var _json = jsonToUniform(json);
    let len = _json.length;
    var series = [],
        legend = [],
        arr = [],
        seriesType =  typeArr || barlineType(len),// obj参数简易办法
        xlabel;
    for (var i = 0; i < len; i++) {
        for (var j in _json[i]) {
            var obj = {};
            obj.name = j;
            obj.type = seriesType[i];
            var value = _json[i][j];
            obj.data = turnChartObj(value).value;
            xlabel = turnChartObj(value).name;
            if (seriesType[i] == "bar") {
                obj.label = addShowNum();
            }
            arr.push(xlabel);
            legend.push(obj.name);
            series.push(obj);
        }
    }
    result.series = series;
    result.xlabel = xlabel;
    result.muli = true;
    result.legend = legend;
    return result;
}
/**
 * 获取默认typeArr的简易默认方法
 * @param obj
 * @param len 默认产生typeArr长度
 */
function barlineType( len) {
    var arr = [];
    for(var i = 0 ; i<len; i++){
        arr.push("bar")
    }
    return   arr;
}
/**
 * 将缺失数据补齐,形成multiComResult输入的json格式
 * @param json
 * @returns {*}
 */
function addLackedData(json) {
    var repeatKeys = getObjkeys(json);
    var uniqKeys =   uniq(flatten(repeatKeys));
    var objKeys = Object.keys(json);
    var num =0 ;
    for(var k = 0 ; k < objKeys.length ; k++){
        var arr1 = json[objKeys[k]];
        var minuArr = intersection(repeatKeys[num],uniqKeys);
        let len = minuArr.length;
        for(var jj = 0 ; jj < len ; jj++){
            var obj = {};
            obj.key = minuArr.pop();
            obj.value = 0;
            arr1.push(obj);
        }
        arr1.sort(keysrt('key',false));
        num++;
    }
    return json;
}
/**
 *  获取如下json形式，全部key值
 *  {"生态移民":[{"key":"2016","value":2},{"key":"2018","value":5}],
 *   "教育转移培训":[{"key":"2015","value":1},{"key":"2017","value":1},{"key":"2018","value":1}]}
 * @param json
 * @returns {Array} 【[2016,2018],[2015,2017,2018]】
 */
function getObjkeys(json) {
    var keyArr = [];
    for(var i in json){
        var temp = [];
        var arr = json[i];
        for(var j = 0 ; j < arr.length ; j++){
            temp.push(arr[j].key)
        }
        keyArr.push(temp);
    }
    return keyArr;
}
function keysrt(key,desc) {
    return function(a,b){
        return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
    }
}
/**
 * arr1与arr2 差集
 * @param arr1
 * @param arr2
 * @returns {Array}
 */
function intersection(arr1,arr2) {
    var result = [];
    var obj = {};
    // 交换arr1与arr2，避免arr1长返回空集
    if(arr1.length > arr2.length){
        var t ;
        t = arr2 ;
        arr2 =arr1;
        arr1 = t;
    }
    for (var i = 0; i < arr1.length; i++) {
        obj[arr1[i]] = 1;
    }
    for (var j = 0; j < arr2.length; j++) {
        if (!obj[arr2[j]])
        {
            result.push(arr2[j]);
        }
    }
    return result;
}
/**
 * 数组展开，把[[1,2,3][[4,5]]]变为[1,2,3,4,5]
 * @param input
 * @returns {Array}
 */
function flatten(input) {
    var output = [], idx = 0;
    for (var i =  0, length = input.length; i < length; i++) {
        var value = input[i];
        // 如是数组
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
            output[idx++] = value[j++];
        }
        // 不是数组（else），并且strict参数为false
    }
    return output;
}
/**
 * 数组去重
 * @param arr
 * @returns {Array.<*>}
 */
function uniq(arr) {
    var res = [];
    var json = {};
    for(var i = 0; i < arr.length; i++){
        if(!json[arr[i]]){
            res.push(arr[i]);
            json[arr[i]] = 1;
        }
    }
    return res.sort();
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



/**
 * 绘制echart图
 * @param obj
 * @param result
 * @returns {*}　返回echarts的引用
 */
function drawEchart(obj,result) {
    var chartType = obj.type,
        chartTitle = obj.title,
        unit = typeof(obj.unit) == "undefined" ? '' : obj.unit, // 避免undefined，其他为空，echart自己处理
        chartContentName = obj.typeName || "";
    var option;
    if (chartType === 'line' || chartType === 'bar') {
        option = lineAndBarChart(chartTitle, unit, chartContentName, chartType,result);
    }
    if (chartType === 'pie') {
        option = pieChart(result, chartType, chartTitle, unit, chartContentName)
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
 * @return {{title: {padding: number[], text: *, x: string}, xAxis: {type: string, data: *, axisLabel: {formatter: option.xAxis.axisLabel.formatter}}, yAxis: {type: string, axisLabel: {formatter: string}}}}
 */
function lineAndBarChart(chartTitle, unit, chartContentName, chartType,result) {
    var serArr = result.series, xlabel = result.xlabel, isMulti = result.muli,legend = result.legend,
        showNum = result.feature.showNum;
    var option = {
        title: {
            padding: [20, 5, 5, 5],
            text: chartTitle,
            x: 'center'
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
            label: addShowNum(showNum),
            data: serArr
        };
        return option;
    } else {
        option.legend =  {
            data:legend,
                right: '5%'
        };
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
function addShowNum(showNum) {
    return {
        normal: {
            show: showNum,
            position: 'top'
        }
    };
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


function pieChart(result, chartType, chartTitle, unit, chartContentName) {
    var _radius = result.feature.radius,
        _isSelected = result.feature.selected,
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
/**
 * 为pie添加图能够分开的例子
 * @param json
 * @returns {*}
 */
function addSelectTrue(json) {
    for (var i = 0; i < json.length; i++) {
        json[i].selected = true;
    }
    return json;
}



