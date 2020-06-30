class Progress{
    // 防止拖拽与播放音乐冲突，节流阀
    isMove=false
    constructor(music_progress_bar,music_progress_line,music_progress_dot){
        this.$music_progress_bar=music_progress_bar
        this.$music_progress_dot=music_progress_dot
        this.$music_progress_line=music_progress_line
    }
    // 点击进度条触发
    progressClick(callback){
        var $this=this
        this.$music_progress_bar.on('click',function(e){
            var juli=e.pageX-$this.$music_progress_bar.offset().left
            var rote=juli/$this.$music_progress_bar.width()
            $this.$music_progress_line.css({
                width:juli
            })
            $this.$music_progress_dot.css({
                left:juli-7
            })
            callback(rote)
        })
        
    }
    // 拖动进度条触发
    progressMove(callback){
        var $this=this
        var rotes
        this.$music_progress_bar.on('mousedown',function(){
            $this.$music_progress_bar.mousemove(function(e){
                $this.isMove=true
                var juli=e.pageX-$this.$music_progress_bar.offset().left
                var rote=juli/$this.$music_progress_bar.width()
                rotes=rote
                if(juli<0){
                    juli=0
                }else if(juli>$this.$music_progress_bar.width()){
                    juli=$this.$music_progress_bar.width()
                    $this.$music_progress_bar.off('mousemove')
                }
                $this.$music_progress_dot.css('left',juli-7)
                $this.$music_progress_line.css({
                    width:juli
                })
            })
        })
        this.$music_progress_bar.on('mouseup',function(){
            $this.$music_progress_bar.off('mousemove')
            $this.isMove=false
            callback(rotes)
        })
    }
    // 播放歌曲时进度条移动
    setProgress(rote){
        if(this.isMove) return
        if(rote<0||rote>100) return
        this.$music_progress_line.css({
            width:rote+'%'
        })
        this.$music_progress_dot.css({
            left:rote+'%'
        })
    }
}