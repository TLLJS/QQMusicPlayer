class Player{
    dataList=[];
    currentIndex=-1;
    constructor($audio){
        this.$audio=$audio
        this.audio=$audio.get(0)
    }
    plays(index){
        // 判断点击的是否是同一首歌曲
        if(this.currentIndex==index){
            if(this.audio.paused){
                this.audio.play()
            }else{
                this.audio.pause()
            }
        }else{
            this.audio.src=this.dataList[index].link_url;
            this.audio.play()
            this.currentIndex=index;
        }
    }
    // 处理上一首音乐
    preIndex(){
        var index=this.currentIndex-1;
        if(index<0){
            index=this.dataList.length-1
        }
        return index
    }
    // 处理下一首音乐播放
    nextIndex(){
        var index=Number(this.currentIndex)+1;
        if(index>this.dataList.length-1){
            index=0
        }
        return index;
    }
    // 删除音乐
    deleteMusic(index){
       this.dataList.splice(index,1);
       if(index<this.currentIndex){
           this.currentIndex=this.currentIndex-1;
       }
    }
     // 获取总时长
     getMusicTotalTime(){
         if(isNaN(this.audio.duration)){
            return this.dataList[this.currentIndex].time
         }
        return this.audio.duration
    }
    // 获取当前音乐播放的时长
    getMusicCurrentTime(){
        return this.audio.currentTime
    }
    // 监听播放的进度
    musicTimeUpdate(callback){
         var $this=this
        this.$audio.on('timeupdate',function(){
            var currentTime=$this.getMusicCurrentTime()
            var totalTime=$this.getMusicTotalTime()
            var str=$this.formatTime($this.getMusicCurrentTime())+' / '+$this.formatTime($this.getMusicTotalTime())
            callback(currentTime,totalTime,str)
        })
    }
    // 点击进度条调到指定时间
    clickMusic(rote){
        // rote可能为underfind
        if(!rote) return
        this.audio.currentTime=rote*this.audio.duration
    }
     // 格式化音乐的时间格式
    formatTime(time){
        if(typeof time==='string'){
            return time
        }
        var mintus=parseInt(time/60)<=9?'0'+parseInt(time/60):parseInt(time/60)
        var second=parseInt(time%60)<=9?'0'+parseInt(time%60):parseInt(time%60)
        var str=mintus+':'+second
        return str
     }
    //  控制音量的播放
    controlMusic(status){
        if(isNaN(status)) return
        if(status<0||status>1) return
        this.audio.volume=status
    }
}
