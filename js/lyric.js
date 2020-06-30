class Lyric{
    currentTime=[]
    musicSing=[]
    index=-1
    constructor(data){
        this.data=data
    }
    // 加载音乐信息
    loadMusic(callBack){
        var $this=this
        $.ajax({
            url:this.data,
            dataType:'text',
            success(datas){
                $this.musicParse(datas)
                callBack()
            }
        })
    }
    // 解析音乐
    musicParse(datas){
        var musicRow= datas.split('\n')
        var reg=/\[\d*:\d*\.\d*\]/
         musicRow.forEach((item,index)=>{
            // console.log(item)
            if(reg.exec(item)===null) return
            var time= reg.exec(item)[0].slice(1,reg.exec(item)[0].length-1)
            var mintue=time.split(':')
            // 获取当前播放的秒数
            var currentmusic= (mintue[0]*60+parseFloat(mintue[1])).toFixed(2)
            // console.log(currentmusic)
            this.currentTime.push(Number(currentmusic))
            // 获取歌词列表
            var musicStr=item.split(']')
            this.musicSing.push(musicStr[1])
         })
    }
    // 歌词同步
    currentIndex(currentTimes){
        if(currentTimes>=this.index[0]){
            this.index++;
            this.musicSing.shift()
        }
        return this.index
    }
}