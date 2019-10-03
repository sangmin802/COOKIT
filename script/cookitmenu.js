$(document).ready(function(){
    var name, price, sale, people, deliveryevent, new2, hotdeal, time, star, sub_menu_li_index, id, page_number_length, last_item;
    // 전체, 신메뉴순등의 초기값
    // 첫화면에서의 초기값 0으로 설정해줘야, 테마별을 눌렀을 때, 0을 바로 받아서 사용할 수 있음 해주지 않으면, undefined로 정의됨
    var delivery_li_index = 0;
    var thema_li_index = 0;
    var span_index = 0;
    var pdt = [];
    var thema_pdt = [];
    var pdt12 = [];
    var menu_html = '<li class="all font20 delivery_date_divide thema_divide"><span class="all_span all_focus">전체</span></li>'
    var html = '';
    var txt = '';
    var item_page_txt = '';
    var item_page_html = '';
    var yoil_arr = ['일', '월', '화', '수', '목', '금', '토'];
    var cut_item = 12;
    var item_page_index = 0;
    var item_page_text = 1;
    var window_w = $(window).width();
    
    // 함수를 사용할 때, 내가 한 것 처럼 function ??? (여기에) 기존에 선언된 key를 똑같이 해주면, 여러곳에서 사용할 수 없고 단지 그 순간에만 사용하는 함수(일회용적인)가 되버린다.
    $.ajax({
        url : '../json/items.json',
        method : 'GET',
        dataType : 'json'
    }).done(function(data){
        for(var i in data){
            if(data[i].all==true){
                pdt.push(data[i]);
            }
        }
    
        // 전체 초기값        
        span_divide(span_index,pdt)
    })
    
    setTimeout(function(){
        mobile_check(window_w);
    }, 50)
    $(window).resize(function(){
        window_w = $(window).width();
        setTimeout(function(){
            mobile_check(window_w);
        }, 50)
    })

    function mobile_check(_window_w){
        if(_window_w<=1023){
            // setTimeout(function(){
                var item_width = $('.item_img').width();
                $('.item_img').css('height', item_width);
                $('.soldout_block').css('line-height', item_width);
            // },)
        }else {
            $('.item_img').css('height', '320px');
            $('.soldout_block').css('line-height', '320px');
        }
    }

    // 배송일별? 테마별?
    $(document).on('click', '.tab_left_span', function(){
        span_index = $(this).index();
        window_w = $(window).width();
        menu_html = '<li class="all font20 delivery_date_divide thema_divide"><span class="all_span all_focus">전체</span></li>';

        $('.tab_left_span').removeClass('tab_left_focus');
        $(this).addClass('tab_left_focus');
        item_page_index = 0;
        item_page_text = 1;

        span_divide(span_index,pdt);
        refill(0);
        mobile_check(window_w);
    })

    // 신메뉴, 인기메뉴 구분
    $(document).on('click', '.sub_menu_li', function(){
        // 함수 밖이라 초기값 이후부터는 공유 됨
        sub_menu_li_index = $(this).index();
        window_w = $(window).width();
        item_page_index = 0;
        item_page_text = 1;

        refill(sub_menu_li_index);
        mobile_check(window_w);
    })

    $(document).on('click', '.delivery_date_divide', function(){
        // 함수 밖이라 초기값 이후부터는 공유 됨
        delivery_li_index = $(this).index();
        window_w = $(window).width();
        item_page_index = 0;
        item_page_text = 1;

        fill_date_item()
        mobile_check(window_w);
    })

    $(document).on('click', '.thema_divide', function(){
        // 함수 밖이라 초기값 이후부터는 공유 됨
        thema_li_index = $(this).index();
        window_w = $(window).width();
        thema_pdt = [];
        item_page_index = 0;
        item_page_text = 1;
        
        fill_thema_item();
        mobile_check(window_w);
    })

    $(document).on('click', '.item_page_number', function(){
        item_page_index = $(this).index();
        item_page_text = $(this).text();

        switch(span_index){
            case 0 : {
                fill_date_item(item_page_index,item_page_text)
            }break;
            case 1 : {
                fill_thema_item(item_page_index,item_page_text)
            }
        }
    })

    // 함수모음
    // 배송일별? 테마별?
    function span_divide(){
       switch(span_index){
            case 0 : {
                fill_date();
                delivery_li_index = 0;
                fill_date_item(delivery_li_index,pdt);
            }break;
            case 1 : {
                fill_thema();
                thema_li_index = 0;
                fill_thema_item(thema_li_index,pdt);
            }break;
       }
    }

    // 배송일별 우측리스트
    function fill_date(){
        var today = new Date();
        var date;
        // var today = new Date('2019-9-19');
    
        var year = today.getFullYear();
        var month = today.getMonth()+1;
        
        // 해당 달의 날 수 구하기
        var this_month = new Date(today.getFullYear(), today.getMonth()+1, 0);
        var this_month_date = this_month.getDate()

        // 주문하는날
        date = today.getDate()+1;
        for(var i=0; i<5; i++){
            // 도착하는날은 주문하고 그 다음날. (근데 도착하는 날이 해당 달의 날 수보다 많다면, 1일로 바뀌고 다음달(이번달 + 1)로 설정)
            if(date >= this_month_date){
                date = 1;
                month = month+1;
            }else{
                date = date+1;
            }

            // 12월 넘어가면 1월로
            if(month > 12){
                month = 1;
            }
            
            // 해당 date의 요일 구하기
            var date_day = new Date(year+'-'+month+'-'+date).getDay();
            // 다음날이 일요일, 월요일일 경우 그 다음날 도착으로 설정 (일요일, 월요일은 배송안함)
            if(date_day==0){
                date = date+2;
                date_day = date_day+2;
                if(date >= this_month_date){
                    date = 1;
                    month = month+1;
                    if(month > 12){
                        month = 1;
                    }
                    date_day = new Date(year+'-'+month+'-'+date).getDay();
                }
            }else if(date_day==1){
                date = date+1;
                date_day = date_day+1;
            }
            
            
            txt = '<li class="delivery_divide font20 delivery_date_divide"><div class="yoil_li font20">'+yoil_arr[date_day]+'</div><div class="date_li font20"><span class="date_li_month">'+month+'</span>/<span class="date_li_date">'+date+'</span></div></li>'

            menu_html = menu_html + txt;
        }
        $('.tab_right_ul').html(menu_html);
    }
    
    function fill_date_item(){
        item_page_txt = '';
        item_page_html = '';
        html = '';
        
        if(delivery_li_index!==0){
            var delivery_date_value = $('.delivery_date_divide').eq(delivery_li_index).children('.date_li').children('.date_li_date').text();
            // 배송일 문구 채우기, 클릭표시
            var detail_month_text = $('.delivery_date_divide').eq(delivery_li_index).children('.date_li').children('.date_li_month').text();
            var detail_date_text = $('.delivery_date_divide').eq(delivery_li_index).children('.date_li').children('.date_li_date').text();

            $('.deliver_5day').text(detail_month_text+'월'+detail_date_text+'일 배송 가능한 메뉴입니다.')

            $('.delivery_date_divide').removeClass('delivery_divide_focus');
            $('.delivery_date_divide').children().removeClass('delivery_divide_li_focus');
            $('.all_span').removeClass('all_focus');

            $('.delivery_date_divide').eq(delivery_li_index).addClass('delivery_divide_focus');
            $('.delivery_date_divide').eq(delivery_li_index).children().addClass('delivery_divide_li_focus');
        }else{
            // 전체를 선택했을 때, 배송일 문구 채우기, 클릭표시
            var deliver_date_1 = $('.date_li').eq(0).text().split('/');
            var deliver_date_4 = $('.date_li').eq(4).text().split('/');
    
            $('.deliver_5day').text(deliver_date_1[0]+'월'+deliver_date_1[1]+'일 ~ '+deliver_date_4[0]+'월'+deliver_date_4[1]+'일 배송 가능한 메뉴입니다.')

            $('.tab_right_ul li').children().removeClass('delivery_divide_li_focus');
            $('.tab_right_ul li').removeClass('delivery_divide_focus');
            $('.all_span').addClass('all_focus');
        }

        page_number_length = Math.ceil((pdt.length)/cut_item);
        last_item = pdt.length%cut_item;
        if(page_number_length!==0){
            for(var p = 1; p <= page_number_length; p++){
                item_page_txt = '';
                item_page_txt = '<div class="item_page_number font20">'+p+'</div>'
                item_page_html = item_page_html + item_page_txt;
            }
        }else{
            item_page_txt = '';
            item_page_html = '';
        }
        $('.item_wrap_page_number').html(item_page_html);
        
        pdt12 = pdt_divide12(item_page_index,item_page_text,page_number_length,last_item,pdt);

        for(var i in pdt12){
            txt = '';

            name = pdt12[i].name;
            cookitsrc = pdt12[i].cookitsrc;
            price = Number(pdt12[i].price);
            sale = Number(pdt12[i].sale);
            people = pdt12[i].people;
            deliveryevent = pdt12[i].deliveryevent;
            new2 = pdt12[i].new;
            hotdeal = pdt12[i].hotdeal;
            time = pdt12[i].time;
            star = pdt12[i].star;
            id = pdt12[i].id;
            soldout = pdt12[i].soldout.split(',');
            
            // json에서 soldout 부분에 날짜를 변경해가면 적용됩니다.
            if(soldout.indexOf(delivery_date_value)!==-1){
                var soldout_block = '<div class="soldout_block font28">일시품절</div>'
                var replace = 'replace'
            }else{
                soldout_block = '';
                replace = '';
            }

            if(deliveryevent){
                var deliver_tag = '<span class="deliver_tag font20">무료배송</span>'
            }else if(!deliveryevent){
                deliver_tag = '';
            }

            if(new2){
                var new_tag = '<span class="new_tag font20">NEW</span>'
            }else if(!new2){
                new_tag = '';
            }

            if(sale < price){
                price = '<span class="discount font20">'+comma(sale)+'원</span><del class="font font20">'+comma(price)+'원</del>'
            }else{
                price = comma(price)+'원'
            }            

            if(hotdeal){
                var hotdeal_tag = '<span class="hotdeal_tag font20">핫딜</span>'
            }else{
                hotdeal_tag = '';
            }

            // 좋아요 옆에 재고상황에 따라 카트 혹은 대기 if만들기
            
            txt = '<div class="item"><input type="hidden" value="'+id+'" class="item_id"><div class="item_img menu2_item_img">'+soldout_block+'<img src="'+cookitsrc+'" alt="'+name+'"></div><div class="item_banner">'+deliver_tag+new_tag+'</div><div class="people_time"><span class="people">'+people+'인분</span><span class="time">조리'+time+'분</span></div><div class="name menu2_item_name font20">'+name+'</div><div class="price font20">'+hotdeal_tag+price+'</div><div class="star_review"><span class="star"><span class="star_fill" style="width:'+star+'%;"></span></span><span class="review font20">리뷰</span></div><div class="alert"><div class="heart"></div><div class="alert_cart '+replace+'"></div></div></div>';

            html = html + txt;
        }
        $('.sub_menu_item_wrap').html(html);
    }

    // 테마별 우측리스트
    function fill_thema(){
        var thema_arr = ['KIDS', '월간베스트', '신메뉴', '보양식', '매운맛']
        for(var i in thema_arr){
            txt = '';
            txt = '<li class="font20 thema_wrap thema_divide"><span>'+thema_arr[i]+'</span></li>'

            menu_html = menu_html + txt;
        }
        $('.tab_right_ul').html(menu_html);
    }

    // 테마 아이템 채우기
    function fill_thema_item(){
        thema_pdt = [];
        var thema_value = $('.thema_divide').eq(thema_li_index).children('span').text();
        $('.deliver_5day').text('#'+thema_value+' 추천 메뉴입니다.');
        $('.thema_divide').children('span').removeClass('thema_divide_focus');
        
        if(thema_li_index!==0){
            $('.thema_divide').eq(thema_li_index).children('span').addClass('thema_divide_focus');
            $('.thema_divide').children('.all_span').removeClass('all_focus');

            for(var i in pdt){
                var pdt_thema_value = pdt[i].thema.split(',')
                for(var a in pdt_thema_value){
                    if(pdt_thema_value[a]==thema_value){
                        thema_pdt.push(pdt[i]);
                    }
                }
            }
            fill(thema_pdt);
        }else{
            $('.thema_divide').children('.all_span').addClass('all_focus');
            fill(pdt);
        }    
    }
    
    // 질문 재정리
    // 하나의 함수에 여러가지 이벤트를 통해 각기 다른 값을 넣으려 할 때
    // 그 각기 다른 값을 넣는데, 어떤 이벤트는 key와 value가 둘다 다를 때
    // index같이 값만변하는게 아니라 키도 변하는것들만 _같이 변수로 넣어주는건지
    function fill(_pdt){        
        item_page_txt = '';
        item_page_html = '';
        html = '';
        
        page_number_length = Math.ceil((_pdt.length)/cut_item);
        last_item = _pdt.length%cut_item;
        if(page_number_length!==0){
            for(var p = 1; p <= page_number_length; p++){
                item_page_txt = '';
                item_page_txt = '<div class="item_page_number font20">'+p+'</div>'
                item_page_html = item_page_html + item_page_txt;
            }
        }
        $('.item_wrap_page_number').html(item_page_html);
        
        pdt12 = pdt_divide12(item_page_index,item_page_text,page_number_length,last_item,_pdt);

        for(var i in pdt12){
            txt = '';

            name = pdt12[i].name;
            cookitsrc = pdt12[i].cookitsrc;
            price = Number(pdt12[i].price);
            sale = Number(pdt12[i].sale);
            people = pdt12[i].people;
            deliveryevent = pdt12[i].deliveryevent;
            new2 = pdt12[i].new;
            hotdeal = pdt12[i].hotdeal;
            time = pdt12[i].time;
            star = pdt12[i].star;
            id = pdt12[i].id;
            soldout = pdt12[i].soldout.split(',');

            if(deliveryevent){
                var deliver_tag = '<span class="deliver_tag font20">무료배송</span>'
            }else if(!deliveryevent){
                deliver_tag = '';
            }

            if(new2){
                var new_tag = '<span class="new_tag font20">NEW</span>'
            }else if(!new2){
                new_tag = '';
            }

            if(sale < price){
                price = '<span class="discount font20">'+comma(sale)+'원</span><del class="font font20">'+comma(price)+'원</del>'
            }else{
                price = comma(price)+'원'
            }            

            if(hotdeal){
                var hotdeal_tag = '<span class="hotdeal_tag font20">핫딜</span>'
            }else{
                hotdeal_tag = '';
            }

            // 좋아요 옆에 재고상황에 따라 카트 혹은 대기 if만들기
            
            txt = '<div class="item"><input type="hidden" value="'+id+'" class="item_id"><div class="item_img menu2_item_img"><img src="'+cookitsrc+'" alt="'+name+'"></div><div class="item_banner">'+deliver_tag+new_tag+'</div><div class="people_time"><span class="people">'+people+'인분</span><span class="time">조리'+time+'분</span></div><div class="name menu2_item_name font20">'+name+'</div><div class="price font20">'+hotdeal_tag+price+'</div><div class="star_review"><span class="star"><span class="star_fill" style="width:'+star+'%;"></span></span><span class="review font20">리뷰</span></div><div class="alert"><div class="heart"></div><div class="cart_or_replace"></div></div></div>';

            html = html + txt;
        }
        $('.sub_menu_item_wrap').html(html);
    }

    function refill(sub_menu_li_index){        
        $('.li_check').removeClass('li_check_show');
        $('.sub_menu_li').removeClass('fontfocus');

        $('.li_check').eq(sub_menu_li_index).addClass('li_check_show');
        $('.sub_menu_li').eq(sub_menu_li_index).addClass('fontfocus');

        switch(sub_menu_li_index){
            case 0 : {;
                pdt.sort(function(a, b){
                    return a.id - b.id;
                });
                thema_pdt.sort(function(a, b){
                    return a.id - b.id;
                });
            }break;
            case 1 : {
                pdt.sort(function(a, b){
                    return a.best_number - b.best_number;
                });
                thema_pdt.sort(function(a, b){
                    return a.best_number - b.best_number;
                });
            }break;
            case 2 : {
                pdt.sort(function(a, b){
                    return b.price - a.price;
                });                
                thema_pdt.sort(function(a, b){
                    return b.price - a.price;
                });                
            }break;
            case 3 : {
                pdt.sort(function(a, b){
                    return a.price - b.price;
                });                
                thema_pdt.sort(function(a, b){
                    return a.price - b.price;
                });                
            }break;
            case 4 : {
                pdt.sort(function(a, b){
                    return b.star - a.star;
                });                
                thema_pdt.sort(function(a, b){
                    return b.star - a.star;
                });                
            }break;
        }
        
        if(span_index==0){
            fill_date_item(delivery_li_index);     
        }else if(span_index==1){
            fill_thema_item(thema_li_index);
        }
    }

    function pdt_divide12(item_page_index,item_page_text,page_number_length,last_item,pdt){
        pdt12 = [];
        if(item_page_text==page_number_length){
            for(var m = item_page_index*cut_item; m < (item_page_index*cut_item)+last_item; m++){
                pdt12.push(pdt[m]);
            }
        }else{
            for(i = item_page_index*cut_item; i < item_page_text*cut_item; i++){
                pdt12.push(pdt[i])
            }
        }
        
        return pdt12;
    }


    function zero(value){
        if(value<10){
            return '0'+value;
        }else{
            return value;
        }
    }

    function comma(num){
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")};
})