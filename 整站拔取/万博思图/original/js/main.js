this.ws = this.ws || {}, function () {
    var n = function () {
        this.init()
    },
        i = n.prototype;
    i.init = function () {
        this.initSub()
    },
        i.initSub = function () {
        new ws.Frame("main"),
        new ws.Home($("#home")),
        new ws.About($("#about")),
        new ws.Service($("#service")),
        new ws.News($("#news")),
        new ws.Job($("#job")),
        new ws.Contact($("#contact")),
        new ws.shift($("#guideContainer"))
    },
        ws.Main = n
}();