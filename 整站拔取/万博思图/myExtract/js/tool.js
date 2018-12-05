/*判断浏览器类型，平台类型*/

(function(){

    var document = this.document;
    var window = document.window = this;

    var ua = navigator.userAgent.toLowerCase(),
        platform = navigator.platform.toLowerCase(),
        UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0],
        mode = UA[1] == 'ie' && document.documentMode;

    var Browser = this.Browser = {

        extend: Function.prototype.extend,

        name: (UA[1] == 'version') ? UA[3] : UA[1],

        version: mode || parseFloat((UA[1] == 'opera' && UA[4]) ? UA[4] : UA[2]),

        Platform: {
            name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
        }
    };
    //console.log(Browser.name);
    //console.log(Browser.version);
    //console.log(Browser.Platform.name);
    Browser[Browser.name] = true;
    Browser[Browser.name + parseInt(Browser.version, 10)] = true;
    Browser.Platform[Browser.Platform.name] = true;
})();