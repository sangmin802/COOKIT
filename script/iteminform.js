$(document).ready(function(){
    var name, price, sale, people, deliveryevent, new2, hotdeal, time, star, id, score, soldout_class, canbuy_price, single_buy_item_count, local_cart, canbuy_name;
    var html = '';
    var txt = '';
    var item=[];
    var pdt=[];
    var items_arr=[];
    var dateli_cart = [];
    var check_cart = [];
    var li_count = 0;
    var total_buy_item_count = 0; // 세부 날짜별 count까지 포함되는 총 수량 count

    if(localStorage.length==0){
        Storage = [];
    }else{
        Storage = (localStorage.getItem('Storage')).split(',');
        for(var s in Storage){
            // 기존에 장바구니에 담았던 상품들을 갖고와서, list에 선택불가상태로 만들기위함(다른 상품창을 보고 오더라도 이러한 상태 유지시키기)
            check_cart.push(Storage[s].split(':')[0]);
        }
    }
    $.ajax({
        url : 'https://raw.githubusercontent.com/sangmin802/COOKIT/master/json/items.json',
        method : 'GET',
        dataType : 'json'
    }).done(function(data){
        var item_id = find_id();
        pdt = data;
        console.log(pdt)
        for(var i in pdt){
            if(pdt[i].id==item_id){
                item = pdt[i];
            }
        }
    
        fill(item)
    })

    // 세부날짜 띄우기
    $(document).on('click', '.item_infrom_deliver_date', function(){
        canbuy_name = $('.item_infrom_name').text();
        li_count++;
        li_count = li_count%2;

        dateli_displaynone(li_count)
        // 이전에 선택했던 상품-날짜는 선택불가상태
        cantbuy_blocking(check_cart)
    })

    // 세부날짜 선택 시 구매수량 박스 생성하기
    $(document).on('click', '.canbuy_class', function(){
        canbuy_name = $('.item_infrom_name').text();
        li_count++;
        var canbuy_text = $(this).text();
        canbuy_price = removecomma($('.item_infrom_price').children('.item_inform_content').text().split('원')[0]); // 할인가 기존가를 고려하여 적용된 가격 갖고오기

        if(check_cart.indexOf(canbuy_text)==-1){
            check_cart.push(canbuy_name+'-'+canbuy_text); // 중복되는것인지 아닌지 체크
            total_buy_item_count++; // 아닌게 확인되면, 세부날짜 추가할때마다 총수량 count 증가

            fill_count_price(total_buy_item_count) // 총수량, 총가격 text 생성
            fill_date_item(canbuy_text, canbuy_price, canbuy_name); // 세부날짜 수량기입 태그 삽입
        }else{
            // alert('동일한 날짜의 상품이 선택되어있습니다.')
        }
        console.log(check_cart)
        // 방금 선택한 상품은 선택불가상태
        cantbuy_blocking(check_cart)
        dateli_displaynone(li_count)
    })

    $(document).on('click', '.date_item_plus', function(){
        canbuy_name = $('.item_infrom_name').text();


        single_buy_item_count = Number($(this).siblings('.date_item_count').text()); // 기존 적혀있는 수량 (초기값은 1) this로 찝어서 선언해준 다음, 거기에다 +1해줘야지됨 count자체를 해주면 다른 세부날짜 수량에도 누적되서 +1씩되는것이 아닌 한번에 확증가해버림(누적됨)

        total_buy_item_count++; // + 누를때마다 총수량count도 하나씩 증가

        $(this).siblings('.date_item_count').text(single_buy_item_count+1); // 기존 세부수량에다 +1
        fill_count_price(total_buy_item_count) // 새롭게 count된 총수량 count로 총수량, 총가격 text 다시생성
    })

    $(document).on('click', '.date_item_minus', function(){
        single_buy_item_count = Number($(this).siblings('.date_item_count').text()); // 기존 적혀있는 수량
        if(single_buy_item_count>1){
            total_buy_item_count--; // 세부수량 1이하부터는 총수량도 더이상 감소 안됨
            $(this).siblings('.date_item_count').text(single_buy_item_count-1); // 기존 세부수량에다 -1
        }
        fill_count_price(total_buy_item_count);
    })

    $(document).on('click', '.close', function(){
        var close_index = $(this).parent().parent().index();
        var close_index_count = Number($('.date_item').eq(close_index).children('.date_item_desc').children('.date_item_count_box').children('.date_item_count').text());
        var close_index_date_indexOf = check_cart.indexOf(canbuy_name+'-'+$('.date_item').eq(close_index).children('.date_item_date').text());
        canbuy_name = $('.item_infrom_name').text();
        
        if(close_index_date_indexOf!==-1){
            check_cart.splice(close_index_date_indexOf,1) // cart에서 빼줘야, 다시 추가할 때 넣을 수 있음
        }
        
        $('.date_item').eq(close_index).detach(); // 지운 태그 html코드에서 영구삭제
        total_buy_item_count = total_buy_item_count - close_index_count; // 지운 세부수량의 갯수를 파악해서, 총수량에서 빼준다음 총수량, 총가격 text 다시생성
        console.log(check_cart)
        fill_count_price(total_buy_item_count);
        cantbuy_blocking(check_cart)
    })

    // 로컬카트
    $(document).on('click', '.item_infrom_cart', function(){
        var date_item_length = $('.date_item').length;
        var local_text = '';

        if(date_item_length==0){
            alert('선택된 상품이 없습니다!')
        }else{
            for(var i =0; i < date_item_length; i++){
                var cart_item_name = $(this).siblings('.item_infrom_name').text();
                var cart_item_date = $(this).siblings('.item_infrom_itemcount_wrap').children('.date_item').eq(i).children('.date_item_date').text();
                var cart_item_count = $(this).siblings('.item_infrom_itemcount_wrap').children('.date_item').eq(i).children('.date_item_desc').children('.date_item_count_box').children('.date_item_count').text();

                local_text = cart_item_name+'-'+cart_item_date+':'+cart_item_count;
                
                Storage.push(local_text);
            }       
        }
        localStorage.setItem('Storage', Storage);
        $('.date_item').remove();

        total_buy_item_count = 0
        fill_count_price(total_buy_item_count);
    })

    // 함수모음
    function fill_date_item(canbuy_text, canbuy_price, canbuy_name){
        txt = ''
        txt = '<div class="date_item"><div class="date_item_date font20">'+canbuy_text+'<span class="close"></span></div><div class="date_item_desc"><div class="date_item_name font20">'+canbuy_name+'</div><div class="date_item_count_box"><span class="date_item_minus font20">-</span><span class="date_item_count">1</span><span class="date_item_plus font20">+</span></div><div class="date_item_price"><span class="font20">'+comma(canbuy_price)+'</span>원</div></div></div>'

        $('.item_infrom_itemcount_wrap').append(txt);
    }

    function fill_count_price(total_buy_item_count){
        canbuy_price = removecomma($('.item_infrom_price').children('.item_inform_content').text().split('원')[0]);
        
        $('.item_infrom_totalacount span').text(total_buy_item_count)
        $('.item_infrom_totalprice span').text(comma(total_buy_item_count*canbuy_price));
    }

    // id값 갖고오기
    function find_id(){
        var location_code = location.search.slice(1).split(',')
        for(var i in location_code){
            if(location_code[i].split('=')[0]=='item_id'){
                return location_code[i].split('=')[1]
            }
        }
    }

    // 상품상세페이지 채우기
    function fill(item){
        txt = '';
        
        name = item.name;
        cookitsrc = item.cookitsrc;
        price = Number(item.price);
        sale = Number(item.sale);
        people = item.people;
        deliveryevent = item.deliveryevent;
        new2 = item.new;
        hotdeal = item.hotdeal;
        time = item.time;
        star = item.star;
        id = item.id;
        // 두번째자리 반올림
        score = ((item.star/100)*5).toFixed(1);
        soldout = item.soldout.split(',');

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
        
        txt = '<div class="item_inform_item"><div class="item_inform_item_left"><div class="item_inform_img"><img src="'+cookitsrc+'" alt="'+name+'"></div><div class="item_infrom_star_share"><div class="item_inform_star"><span class="blank_star star_bg"><span class="fill_star  star_bg" style="width : '+star+'%;"></span></span><span class="star_score font20">'+score+'</span></div><div class="recipt_share"><div class="item_inform_recipt font20">레시피</div><div class="item_inform_share font20">공유하기</div></div></div></div><div class="item_inform_item_right"><div class="item_infrom_banner">'+new_tag+deliver_tag+hotdeal_tag+'</div><div class="item_infrom_name font30">'+name+'</div><div class="item_infrom_home font30">원산지 : 상품정보 참조</div><div class="item_infrom_people_cooktime"><div class="item_infrom_people font20">'+people+'인분</div><div class="item_infrom_cooktime font20">조리'+time+'분</div></div><div class="item_infrom_price"><div class="item_inform_lavel font20">판매가</div><div class="item_inform_content font26">'+price+'</div></div><div class="item_infrom_point"><div class="item_inform_lavel font20">포인트적립</div><div class="item_inform_content font20">CJ ONE 포인트<span class="green font20">0.2% 적립</span></div></div><div class="item_infrom_deliver"><div class="item_inform_deliver_way"><div class="item_inform_lavel font20">배송방법</div><div class="item_inform_content"><span class="dawn_deliver font20">새벽배송</span><u class="can_deliver font20">배송가능여부 조회</u></div></div><div class="item_inform_deliver_price"><div class="item_inform_lavel font20">배송비</div><div class="item_inform_content font20">3,000원<span class="up4_freedeliver font20">4만원 이상 구매 시 무료배송</span></div></div></div><div class="item_inform_lastorder font20">주문마감시간 오전7시</div><div class="item_infrom_deliver_date_wrap"><div class="item_infrom_deliver_date font20">배송받을 날짜를 선택하세요</div><div class="item_infrom_deliver_datelist">'+datelist(soldout)+'</div></div><div class="item_infrom_itemcount_wrap"></div><div class="item_infrom_total_price"><div class="item_infrom_totalacount font20">수량 <span class="font20">0</span>개</div><div class="item_infrom_totalprice font32 red"><span class="font32 red">0</span>원</div></div><div class="item_infrom_cart font20">장바구니 담기</div></div></div>'

        $('.item_inform_item').html(txt);
        $('title').html(name+' - COOKIT');
        datelist();
    }

    // 배송날짜 선택하기
    function datelist(soldout){
        html = '';
        var today = new Date();
        // var today = new Date(2019+'-'+10+'-'+26);
        var year = today.getFullYear();
        var month = today.getMonth()+1;
        var yoil_arr = ['일', '월', '화', '수', '목', '금', '토'];
        var today_date = today.getDate()+1;
        var this_month_date = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
        var today_day = new Date(year+'-'+month+'-'+today_date).getDay();
        $('.datelist_li').removeClass('soldout_class')
        

        for(var i = 0; i<5; i++){
            txt = '';

            if(today_date>=this_month_date){
                month = month+1;
                today_date = 1;
            }else{
                today_date = today_date+1;
            }
            
            if(month > 12){
                month = 1;
            }

            var today_day = new Date(year+'-'+month+'-'+today_date).getDay();

            if(today_day==0){
                today_date=today_date+2;
                today_day=today_day+2;
                if(today_date > this_month_date){
                    today_date= 1;
                    month = month+1;
                    if(month > 12){
                        month = 1;
                    }
                    today_day = new Date(year+'-'+month+'-'+today_date).getDay();
                }
            }else if(today_day==1){
                today_date=today_date+1;
                today_day=today_day+1;
            }

            txt = '<li class="datelist_li canbuy_class"><span class="datelist_month font20">'+zero(month)+'월 </span><span class="datelist_date font20">'+zero(today_date)+'일</span><span class="datelist_day font20"> ('+yoil_arr[today_day]+')</span></li>'
            
            html = html + txt;
        }
        $('.item_infrom_deliver_datelist').html(html);
        
        setTimeout(function(){
            for(var d in soldout){
                if(soldout[d] < 10){
                    soldout[d] = zero(soldout[d])
                }
                for(var l=0; l<5; l++){
                    if($('.datelist_date').eq(l).text().split('일')[0]==soldout[d]){
                        $('.datelist_li').eq(l).removeClass('canbuy_class')
                        $('.datelist_li').eq(l).addClass('soldout_class')
                    }
                }
            }
        })

    }


    function dateli_displaynone(li_count){
        if(li_count==1){
            $('.item_infrom_deliver_datelist').addClass('displayblock');
            $('.item_infrom_deliver_date').addClass('border_bottom_none');
        }else{
            $('.item_infrom_deliver_datelist').removeClass('displayblock');
            $('.item_infrom_deliver_date').removeClass('border_bottom_none');
        }
    }

    function cantbuy_blocking(check_cart){
        // 현재상품의 이름, 날짜
        dateli_cart = [canbuy_name+'-'+$('.datelist_li').eq(0).text(),canbuy_name+'-'+$('.datelist_li').eq(1).text(),canbuy_name+'-'+$('.datelist_li').eq(2).text(),canbuy_name+'-'+$('.datelist_li').eq(3).text(),canbuy_name+'-'+$('.datelist_li').eq(4).text()];

        // 날짜 선택했다가, x(해당날짜 선택에서 제외했을 때)눌렀을 때 초기화
        $('.datelist_li').removeClass('already_chosen');
        $('.datelist_li').addClass('canbuy_class');
        $('.soldout_class').removeClass('canbuy_class');

        for(var i in dateli_cart){
            for(var a in check_cart){
                if(dateli_cart[i]==check_cart[a]){
                    $('.datelist_li').eq(i).addClass('already_chosen');
                    $('.datelist_li').eq(i).removeClass('canbuy_class');
                }
            }
        }
    }

    function zero(value){
        if(value<10){
            return '0'+value;
        }else{
            return value;
        }
    }

    function comma(num){
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    };

    function removecomma(num){
        return num.replace(',','');
    }
});