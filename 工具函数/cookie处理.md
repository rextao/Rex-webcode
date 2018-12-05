```javascript
//cookie处理
function setCookie(name,value){
    var Days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+value + ";expires=" + exp.toDateString();
    console.log(document.cookie)
}
function getCookie(name){
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return arr[2];
    else
        return null;
}
```

