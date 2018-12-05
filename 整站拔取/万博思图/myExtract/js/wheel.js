/**
 * Created by Administrator on 2017/7/12.
 */
//        滚轮特效
this.rx = this.rx || {};
$(function () {
    var wheel = {};
    wheel.init = function () {
        wheel.mousewheel();
    };
    wheel.mousewheel = function () {
        var cur = this;
        // delta表示滚轮方向，1为正，-1为反
        $(document).mousewheel(function (event, delta, deltaX, deltaY) {
            var startX = $(document).scrollLeft();
            var tempX;
            if (delta < 0) tempX = 480;
            if (delta > 0) tempX = -480;
            var endX = startX + tempX;
            cur.targetX = startX;
            TweenLite.to(cur, 0.5, {
                targetX: endX, onUpdateScope: cur, onUpdate: function () {
                    $(document).scrollLeft(this.targetX);
                }
            });
        });
    };
    rx.wheel = wheel;
});