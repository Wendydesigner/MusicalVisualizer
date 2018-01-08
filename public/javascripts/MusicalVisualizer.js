function MusicalVisualizer (obj){
    //create AudioContext object
    this.ac = new (window.AudioContext||window.webkitAudioContext)();
    // music visualise
    this.analyser = this.ac.createAnalyser();

    this.gainNode = this.ac[this.ac.createGain ? "createGain":"createGainNode"]();
    //links between object 
    this.analyser.connect(this.gainNode);
    this.gainNode.connect(this.ac.destination);
    // prevent songs conflicting
    this.source = null;
    this.count = 0;
    //analyser attribute
    this.size = obj.size;
    this.analyser.fftSize = this.size * 2;

    this.visualizer = obj.visualizer;


    this.visualize();
    // ajax request
    this.xhr = new window.XMLHttpRequest();

}

MusicalVisualizer.prototype.load = function (path,fun){
    this.xhr.abort();
    this.xhr.open("GET",path);
    this.xhr.responseType = "arraybuffer";
    var self = this;
    this.xhr.onload = function () {
        fun(self.xhr.response);
    }
    this.xhr.send();
};
MusicalVisualizer.prototype.decode = function (arraybuffer,fun){
    this.ac.decodeAudioData(arraybuffer, function (buffer){
        fun(buffer);
    },function(err){
        console.log(err);
    })
};
//the start button
MusicalVisualizer.prototype.play = function (path){
    var  self = this;
    var n = ++self.count;
    self.source && self.stop();
    if(path instanceof ArrayBuffer){
        if(n != self.count) return;
        self.decode(path,function(buffer){
            if(n != self.count) return;
            var bufferSource = self.ac.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.connect(self.analyser);
            //songs play start at once
            bufferSource[bufferSource.start?"start":"noteOn"](0);
            //judge whether source is to prevent conflicting
            //connect the inner and outer source
            self.source = bufferSource;
        })
    }
    if(typeof(path) === "string"){
        this.load(path,function(arraybuffer){
            if(n != self.count) return;
            self.decode(arraybuffer,function(buffer){
                if(n != self.count) return;
                var bufferSource = self.ac.createBufferSource();
                bufferSource.buffer = buffer;
                bufferSource.connect(self.analyser);
                //songs play start at once
                bufferSource[bufferSource.start?"start":"noteOn"](0);
                //judge whether source is to prevent conflicting
                //connect the inner and outer source
                self.source = bufferSource;
            })
        })
    }

};
MusicalVisualizer.prototype.stop = function (){
    return  this.source[this.source.stop ? "stop": "noteOff"](0);
};
MusicalVisualizer.prototype.changeVolume = function(percent){
    this.gainNode.gain.value = percent;
};
MusicalVisualizer.prototype.visualize = function (){
    var arr = new Uint8Array(this.analyser.frequencyBinCount);
    requestAnimationFrame = window.requestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.mozRequestAnimationFrame;
    var self = this;
    function v(){
        self.analyser.getByteFrequencyData(arr); 
        self.visualizer(arr);
        requestAnimationFrame(v);
    }
    requestAnimationFrame(v);
};