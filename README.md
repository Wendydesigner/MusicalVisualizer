## 使用node快速构建服务端node + express
  # 命令如下：npm install -g express-generator  //安装express包
            express -e music  //创建文件夹
            cd music  //进入music文件夹
            npm install -g surpervisor //安装打开服务器的命令
            surpervisor bin/www //构建链接
   # 浏览器打开127.0.0.1：3000即可见。


## 使用webAudio操作分析音频数据——核心创建AudioContext对象：
  # 音频总控制对象BufferSource对象，其通过createBufferSource()方法构建
      --进行播放、暂停等的控制；
  # 获取音频解码数据的AudioBuffer对象，其通过decodeAudioData()方法构建
      --本地文件通过新建FileReader()对象直接得到decodeAudioData()方法第一个参数ArrayBuffer，服务器则需要ajax请求；
  # 显示音频时间和频率的数据是Analyser对象，其通过createAnalyser()方法构建
      --进行音乐可视化的重要对象，通过getByteFrequencyData()方法得到音频数组
      --通过此数组进行canvas绘制
         --点状图
           --柱和柱帽实时变化
         --柱形图
           --点的大小和移动实时变化
      --通过requestAnimationFrame实时绘制
  # 音频音量的GainNode对象，其通过createGain()方法创建
      --调节音量的大小
  # 扬声器是其的属性destination
      --声音的最终归宿为此属性，所有对象都最终连接到此
            
