/*this.wbst = this.wbst || {};
(function(){
    var  wbst = {};
    wbst.checkBrowser =function()
    {
        var browser = {
                        msie: false, firefox: false, opera: false, safari: false,
                        chrome: false, netscape: false, appname: 'unknown', version: 0
                    },
                    userAgent = window.navigator.userAgent.toLowerCase();
            if ( /(msie|firefox|opera|chrome|netscape)\D+(\d[\d.]*)/.test( userAgent ) ){
                browser[RegExp.$1] = true;
                browser.appname = RegExp.$1;
                browser.version = RegExp.$2;
            } else if ( /version\D+(\d[\d.]*).*safari/.test( userAgent ) ){ // safari
                browser.safari = true;
                browser.appname = 'safari';
                browser.version = RegExp.$2;
            }
            return browser;
    };
    wbst.browser = wbst.checkBrowser();
    this.wbst = wbst;
})();*/

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

    Browser[Browser.name] = true;
    Browser[Browser.name + parseInt(Browser.version, 10)] = true;
    Browser.Platform[Browser.Platform.name] = true;
})();