$(document).ready(function(){
    // 自定义滚动条
    $('.content_list').mCustomScrollbar(
        {
            theme:"dark"
        }
    );
    var $audio=$('audio');
    // 播放对象
    var Players=new Player($audio);
    // 进度条对象
    var Progres=new Progress($('.music_progress_bar'),$('.music_progress_line'),$('.music_progress_dot'))
    // 音量进度条对象
    var progressMusic=new Progress($('.music_voice_bar'),$('.music_voice_line'),$('.music_voice_dot'))
    // 歌词对象
    var musicLyric
     // 加载歌曲信息
     getPlayerList()
     function getPlayerList(){
         $.ajax({
             url:'../source/musiclist.json',
             dataType:'json',
             success(data){
                Players.dataList=data;
                initMusicInfo(data[0]);
                initMusicesInfo(data[0]);
                $.each(data,function(index,item){
                    var $music=createrMusic(index,item);
                    $('.content_list ul').append($music);
                })
             },
             error:function(e){
                 console.log(e)
             }
         })
     }
    //  点击进度条
    Progres.progressClick(function(rote){
        Players.clickMusic(rote)
    })
    // 拖动进度条
    Progres.progressMove(function(rote){
        Players.clickMusic(rote)
    })
    // 初始化歌词信息
    function initMusicesInfo(data){
        musicLyric=new Lyric(data.link_lrc)
        musicLyric.loadMusic(function(){
            var $lyricContainer=$('.song_lyric')
            $.each(musicLyric.musicSing,function(index,item){
                var $li=$(`<li>${item}<li>`)
                $lyricContainer.append($li)
            })
        })
        
    }
    //  初始化歌曲信息
     function initMusicInfo(data){
         $('.song_info img').prop('src',data.cover) ;
         $('.song_info_name a').text(data.name);
         $('.song_info_singer>a').text(data.singer);
         $('.song_info_ablum a').text(data.album);
         $(".music_progress_name").text(data.name+' / '+data.singer);
         $('.music_progress_time').text('00:00 / '+data.time);
         $('.mask_img').css({
             background:'url('+data.cover+')'
         })
     }
    function initEvent(){
        // 监听鼠标的移入和移出事件
    $('.content_list').on('mouseenter','.list_music',function(){
        // 显示子菜单
        $(this).find('.list_menu').stop().fadeIn(100)
        $(this).find('.list_time a').stop().fadeIn(100)
        // 隐藏时长
        $(this).find('.list_time span').stop().fadeOut(100)
   })
   $('.content_list').on('mouseleave','.list_music',function(){
       // 隐藏子菜单
       $(this).find('.list_menu').stop().fadeOut(100)
       $(this).find('.list_time a').stop().fadeOut(100)
       // 显示时长
       $(this).find('.list_time span').stop().fadeIn(100)
   })
   // 监听复选框的点击事件
   $('.list_title i').click(function(){
       // 全选框选中时下面全部选中
       $(this).toggleClass('list_checked');
       if($(this).hasClass('list_checked')){
           $('.list_music i').addClass('list_checked')
       }else{
           $('.list_music i').removeClass('list_checked')
       }
       
   })
   // 监听播放按钮点击事件
   $('.content_list').on('click','.list_menu_play',function(){
       const $item=$(this).parents('.list_music')
       $(this).toggleClass('list_menu_play2');
       $item.siblings('.list_music').find('.list_menu a:first').removeClass('list_menu_play2')
       if($(this).attr('class').indexOf('list_menu_play2')!=-1){
           $('.music_play').addClass('music_play2');
           $item.siblings('.list_music').find('div').css('color','rgba(255,255,255,0.5)')
           $item.find('div').css('color','#fff')
       }else{
           $('.music_play').removeClass('music_play2');
           $item.find('div').css('color','rgba(255,255,255,0.5)')
       }
       $item.find('.list_number').toggleClass('list_number1')
       $item.siblings('.list_music').find('.list_number').removeClass('list_number1')
       Players.plays($item[0].getAttribute('index'))
       initMusicInfo(Players.dataList[$item[0].getAttribute('index')])
    })
    var value=1
     // 监听音量进度条的点击
     progressMusic.progressClick(function(rote){
         value=rote
        Players.controlMusic(value)
    })
    // 监听音量进度条的拖拽
    progressMusic.progressMove(function(rote){
        value=rote
        Players.controlMusic(value)
        
    })
    // 监听音量按钮的点击
    $('.music_voice_icon').click(function(){
        $(this).toggleClass('voice')
        if($(this).hasClass('voice')){
            Players.controlMusic(0)
            $('.music_voice_line').css({
                width:0
            })
            $('.music_voice_dot').css({
               left:0
            })
        }else{
            Players.controlMusic(value)
            $('.music_voice_line').css({
                width:value*70+'px'
            })
            $('.music_voice_dot').css({
               left:value*70+'px'
            })
        }
        
    })
}

    initEvent()
    var index=1
    // 调用音乐时间更新方法
    Players.musicTimeUpdate(function(currentTime,totalTime,str){
        // 更新时间
        $('.music_progress_time').text(str)
        // 更新进度条
        var rote=(currentTime/totalTime)*100;
        Progres.setProgress(rote)
        // 歌词同步
        var index= musicLyric.currentIndex(currentTime)
        // console.log(index)
    })
    // 底部的播放按钮区域
    $('.footer_in .music_play').on('click',function(){
        $(this).toggleClass('music_play2')
        if(Players.currentIndex===-1){
            $('.list_music:first .list_menu_play').trigger('click')
        }else{
            $('.list_music').eq(Players.currentIndex).find('.list_menu_play').trigger('click')
        }
    })
    // 上一首音乐
    $('.footer_in .music_pre').on('click',function(){
        $('.list_music').eq(Players.preIndex()).find('.list_menu_play').trigger('click')
    })
    // 下一首音乐
    $('.footer_in .music_next').on('click',function(){
        $('.list_music').eq(Players.nextIndex()).find('.list_menu_play').trigger('click')
        // console.log(Players.currentIndex)
    })
    // 删除音乐
    $('.content_list').on('click','.list_time>a',function(){
        var index=$(this).parents('.list_music').attr('index')
        if(index==Players.currentIndex){
            $('.music_next').trigger('click')
        }
        $(this).parents('.list_music').remove();
        // 调用删除音乐的方法
        Players.deleteMusic(index);
        // 删除音乐后重新对音乐进行排序
        $('.list_music').each(function(index,item){
            $(item).attr('index',index);
            $(item).find('.list_number').text(index+1);
        })
    })
    // 下面全选中，全选框选中
    $('.content_list').on('click','.list_music i',function(){
        $(this).toggleClass('list_checked');
        var flag=true;
        $('.list_music i').each(function(index,ele){
            if(!$(ele).hasClass('list_checked')){
                $('.list_title i').removeClass('list_checked');
                flag=false;
            }
        })
        if(flag){
            $('.list_title i').addClass('list_checked');
        }
    })
    function createrMusic(index,item){
        var $li=$(`
                    <li class="list_music" index=${index}>
                        <div class="list_check"><i></i></div>
                        <div class="list_number">${index+1}</div>
                        <div class="list_name">${item.name}</div>
                        <div class="list_menu">
                            <a href="javascript:;" title=播放 class='list_menu_play'></a>
                            <a href="javascript:;" title="添加"></a>
                            <a href="javascript:;" title="下载"></a>
                            <a href="javascript:;" title="分享"></a>
                        </div>
                        <div class="list_singer">${item.singer}</div>
                        <div class="list_time">
                            <span>${item.time}</span>
                            <a href="javascript:;" title="删除"></a>
                        </div>
                    </li>
                `)
        return $li;
    }
})