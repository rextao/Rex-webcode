A Brief History of Flickering Spinners
https://blog.bitsrc.io/a-brief-history-of-flickering-spinners-c9eecd6053
概述

1. 页面加载或数据加载的旋转等待提示符一闪而过
2. 以前，无论什么时候加载数据，都利用旋转等待符提示用户，但现在事情可能更复杂了
1. 文章主要是提供了一种利用定时器的方式，解决菊花转在某些场景下，很快就闪烁过去，对用户体验不好

异步编程的提高

1. promise以及ES7的async和await的使用
2. 等待提示的伪代码：
3.     function loadNetworkData() {
         // Show spinner
         showSpinner();
         return fetch(...).then(() => {
           // When network returns hide the spinner
           hideSpinner());
           ...
         }
       };

逐步增强网页

1. 这个技术可以让用户在页面完全加载完就进行交互
2. 如懒加载技术，利用的就是这个，懒加载就使用了fade-in动画形式代替旋转等待符来提示用户数据是逐步加载的
3. 但过多的动画会导致用户体验下降


