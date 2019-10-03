$(document).ready(function(){
    var pdt, name, date, src;
    var title_pdt = [];
    var html = '';
    var txt = '';

    $.ajax({
        url : 'https://raw.githubusercontent.com/sangmin802/COOKIT/master/json/event.json',
        method : 'GET',
        dataType : 'json'
    }).done(function(data){
        pdt = data;

        sub_divide(0);
    })
        
    $(document).on('click', '.event_sub', function(){
        var sub_index = $(this).index();
        
        sub_divide(sub_index);
    })

    function sub_divide(sub_index){
        $('.event_sub').removeClass('section1_subtitle_focus');
        switch(sub_index){
            case 0 : {
                title_pdt = [];
                for(var i in pdt){
                    if(pdt[i].title==$('.event_sub').eq(0).text()){
                        title_pdt.push(pdt[i])
                    }
                }
                $('.event_sub').eq(0).addClass('section1_subtitle_focus');
                fill_content(title_pdt);
            }break;
            case 1 : {
                title_pdt = [];
                for(var i in pdt){
                    if(pdt[i].title==$('.event_sub').eq(1).text()){
                        title_pdt.push(pdt[i])
                    }
                }
                $('.event_sub').eq(1).addClass('section1_subtitle_focus');
                fill_content(title_pdt);
            }break;
        }
    }
    var today = new Date();
    var real_today = new Date(today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate());

    function fill_content(title_pdt){
        html = '';
        if(title_pdt.length!==0){
            for(var i in title_pdt){
                txt = '';

                name = title_pdt[i].name
                src = title_pdt[i].src
                date = title_pdt[i].date
                var date_split = (date.split(' ~ '))[1].split('.');
                var final_date = new Date(date_split[0]+'-'+date_split[1]+'-'+date_split[2])

                var distance = final_date-real_today;
                var _second = 1000;
                var _minute = _second * 60;
                var _hour = _minute * 60;

                var etc_date = Math.floor((distance / _hour) / 24);
                
                if(etc_date <= 7 && etc_date >= 0){
                    var d_day = '<span class="d_day">D-'+etc_date+'</span>'
                }else{
                    d_day = '';
                }

                txt = '<div class="event_item"><div class="event_item_img"><img src="'+src+'" alt="'+name+'"></div><div class="event_desc font20"><span class="event_tag">EVENT</span>'+d_day+'<span class="event_date">'+date+'</span></div><div class="event_name font20">'+name+'</div></div>'

                html = html + txt;
            }
            $('.section1_content_wrap').html(html);
        }else{
            txt = '';
            txt = '<div class="nothing_img"></div><div class="nothing_text font20">당첨자 발표 내역이 없습니다.</div>'
            $('.section1_content_wrap').html(txt)
        }
    }
})