# 实现一 复制目标内容
## 具体步骤:
1. 用 getBoundingClientRect 获取目标内容的显示位置
1. 复制一个目标内容,并且设置相对定位, 定位的数据在上一步有获取到,还要把 z-index 稍微设置高一点
1. 在复制内容下面,加一层半透明的遮罩层.

## 优缺点 
1. 比较平凡的实现方式,普普通通的,没啥特色.

# 实现二 利用box-shadow
## 具体步骤:
1. 设置目标对象的 box-shadow 为一个比较大的,半透明的值
1. 设置目标对象的 position 为 relative

## 优缺点
1. 优点: 实现方式简单易懂
1. 缺点: box-shadow 是个比较耗性能的属性

## 主要问题
1. 页面可能header或某些元素是absolute定位，无法覆盖

# 实现三 利用 html2canvas 
## 具体步骤:
1. 用 getBoundingClientRect 获取目标内容的显示位置
1. 用 html2canvas 将目标内容绘制到上一步获取的指定位置和大小