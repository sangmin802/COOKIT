$(document).ready(function(){
    var pdt, remove_samedate_arr;
    var cart_btn = '';
    var html = '';
    var txt = '';
    var additional_price = '';
    var date_item_count;
    var date_item_price;
    var date_item_name;
    var date_item_date;
    var mobile = false;
    var window_w = $(window).width();

    mobile_check(window_w);
    date_item_bill(mobile);
    $(window).resize(function(){
        window_w = $(window).width();
        mobile_check(window_w);

        date_item_bill(mobile);
    })

    function mobile_check(_window_w){
        if(_window_w < 1024){
            mobile = true;
        }else{
            mobile = false;
        }
    }

    $.ajax({
        url : 'https://raw.githubusercontent.com/sangmin802/COOKIT/master/json/items.json',
        method : 'GET',
        dataType : 'json'
    }).done(function(data){
        pdt = data;
    })

    // 로컬스토리지에 하나라도 있으면 창 띄우고, 아니면 비어있다는 태그(내용) 띄우기
    if(localStorage.length==1){
        var storage_arr = (localStorage.getItem('Storage')).split(',')
        var date_arr = [];
        fill_cart3_btn(storage_arr);

        make_date_arr(storage_arr);
    }else{
        // 장바구니가 비었습니다 태그
        empty();
    }

    // 모두 지우기
    $(document).on('click', '.cart_remove_all', function(){
        localStorage.clear();
        $('.cart_3_btn').html('')
        $('.cart_3_wrap').html('')
        fill_final(); // 총 가격태그 띄우는 함수. 로컬스토리지가 비어서 모두 0

        $('.cart_number').text(localStorage.length); // 0

        empty();
    })

    // date, 상품별 + 눌렀을 때
    $(document).on('click', '.cart_date_item_plus', function(){
        date_item_name = $(this).parent().siblings('.cart_date_item_desc').children('.cart_date_item_name').text();
        date_item_date = $(this).parent().parent().parent().siblings('.cart_date_title_wrap').children('.cart_date_title').text();
        date_item_count = $(this).siblings('.cart_date_item_ea').text();
        date_item_price = removecomma($(this).parent().siblings('.cart_date_item_desc').children('.cart_date_item_price').text().split('원')[0])*1;

        // 로컬스토리지 배열에 같은 상품이름-날짜가 있다면 배열에서 제거
        for(var i in storage_arr){
            var plusminus_split = (storage_arr[i].split(':'))[0]
            if(plusminus_split==date_item_name+'-'+date_item_date){
                storage_arr.splice(i,1);
            }
        }

        // 수량증가
        date_item_count++;

        // 증가된 수량으로 해당 상품이름-날짜 배열에 추가
        storage_arr.push(date_item_name+'-'+date_item_date+':'+date_item_count);

        // 로컬스토리지 비운다음, 새롭게 수정된 배열을 삽입
        localStorage.clear();
        localStorage.setItem('Storage', storage_arr);

        // 해당 상품 총가격
        $(this).siblings('.cart_date_item_ea').text(date_item_count);   
        $(this).parent().siblings('.cart_date_item_totalprice').children('.cart_date_item_totalprice_value').text(comma(date_item_price*date_item_count));

        // 해당 날짜에 배달되는 상품의 총 가격
        date_item_bill();
    })

    // date, 상품별 - 눌렀을 때
    $(document).on('click', '.cart_date_item_minus', function(){
        date_item_name = $(this).parent().siblings('.cart_date_item_desc').children('.cart_date_item_name').text();
        date_item_date = $(this).parent().parent().parent().siblings('.cart_date_title_wrap').children('.cart_date_title').text();
        date_item_count = $(this).siblings('.cart_date_item_ea').text();
        date_item_price = removecomma($(this).parent().siblings('.cart_date_item_desc').children('.cart_date_item_price').text().split('원')[0])*1;

        // 로컬스토리지 배열에 같은 상품이름-날짜가 있다면 배열에서 제거
        for(var i in storage_arr){
            var plusminus_split = (storage_arr[i].split(':'))[0]
            if(plusminus_split==date_item_name+'-'+date_item_date){
                storage_arr.splice(i,1);
            }
        }

        // 2이상일 때만 수량감소
        if(date_item_count > 1){
            date_item_count--
        }

        // 증가된 수량으로 해당 상품이름-날짜 배열에 추가
        storage_arr.push(date_item_name+'-'+date_item_date+':'+date_item_count);

        // 로컬스토리지 비운다음, 새롭게 수정된 배열을 삽입
        localStorage.clear();
        localStorage.setItem('Storage', storage_arr);

        // 해당 상품 총가격
        $(this).siblings('.cart_date_item_ea').text(date_item_count);   
        $(this).parent().siblings('.cart_date_item_totalprice').children('.cart_date_item_totalprice_value').text(comma(date_item_price*date_item_count));

        // 해당 날짜에 배달되는 상품의 총 가격
        date_item_bill();
    })


    // 이전에 장바구니에 담았는데, 임시품절이 된 상품 제거하기
    $(document).on('click', '.cart_remove_soldout', function(){
        // 모든 상품중에서 input hidden의 value가 soldout인 애들을 로컬스토리지 배열에서 제거
        for(i = 0; i<$('.cart_date_item').length; i++){
            if($('.cart_date_item').eq(i).children('.soldout_remove').attr('value')=='soldout'){
                var soldout_date_item_name = $('.cart_date_item').eq(i).children('.cart_date_item_desc').children('.cart_date_item_name').text();
                var soldout_date_item_date = $('.cart_date_item').eq(i).parent().siblings('.cart_date_title_wrap').children('.cart_date_title').text();
                for(var a in storage_arr){
                    if((storage_arr[a].split(':'))[0]==soldout_date_item_name+'-'+soldout_date_item_date){
                        storage_arr.splice(storage_arr.indexOf(storage_arr[a]),1);                 
                    }
                }
            }
        }
        
        // 임시품절인 상품태그 제거
        $('.cart_soldout_bg').parent('.cart_date_item').remove();      

        // 임시품절 제거로 인해 해당 날짜에 상품이 한개도 없다면, 해당 날짜 태그 제거
        for(var p = 0; p<$('.cart_date').length; p++){
            if($('.cart_date').eq(p).children('.cart_date_item_wrap').children().length==0){
                $('.cart_date').eq(p).remove();
            }
        }

        // 상품이 한개도 없다면, 로컬스토리지랑 배열 비우고 아무것도없다는 내용태그 띄우기
        if($('.cart_date_item').length==0){
            localStorage.clear();
            storage_arr = [];
            empty();
        }else{
            localStorage.clear();
            localStorage.setItem('Storage', storage_arr);
        }
        
        // 임시품절 상품이 제거된 배열로 총 수량 표시하는 태그 재 생성
        fill_cart3_btn(storage_arr);
        // 제거된 상품을 적용시킨 총 가격창 최신화
        date_item_bill();

        $('.cart_number').text(storage_arr.length);
    })

    // 상품 낱개지우기
    $(document).on('click', '.cart_date_item_remove', function(){
        var remove_date_item_name = $(this).siblings('.cart_date_item_desc').children('.cart_date_item_name').text();
        var remove_date_item_date = $(this).parent().parent().siblings('.cart_date_title_wrap').children('.cart_date_title').text();

        // 로컬스토리지 배열에서 이름-날짜가 같다면 해당 상품 배열에서 삭제
        for(var i in storage_arr){
            if((storage_arr[i].split(':'))[0]==remove_date_item_name+'-'+remove_date_item_date){
                storage_arr.splice(i,1);
            }
        }

        // 해당 상품태그 삭제
        $(this).parent().remove();
        
        // 임시품절상품 제거와 같은과정
        for(var p = 0; p<$('.cart_date').length; p++){
            if($('.cart_date').eq(p).children('.cart_date_item_wrap').children().length==0){
                $('.cart_date').eq(p).remove();
            }
        }

        if($('.cart_date_item').length==0){
            localStorage.clear();
            storage_arr = [];
            empty();
        }else{
            localStorage.clear();
            localStorage.setItem('Storage', storage_arr);
        }
        
        fill_cart3_btn(storage_arr);
        date_item_bill();
        
        $('.cart_number').text(storage_arr.length);
    })

    // 함수모음
    // 총수량, 품절삭제, 전체삭제 부분
    function fill_cart3_btn(storage_arr){
        cart_btn = '<span class="cart_counting font22">총 <span class="cart_counting_number font22 red">'+storage_arr.length+'</span>개</span><span class="cart_remove_soldout font20">품절 삭제</span><span class="cart_remove_all font20">전체 삭제</span>'

        $('.cart_3_btn').html(cart_btn);
    }

    // 로컬스토리지에서 따온 배열에서 중복되는 날짜를 제거해주고, 빠른순으로 재정렬
    function make_date_arr(storage_arr){
        for(var i in storage_arr){
            date_arr.push(((storage_arr[i].split('-'))[1].split(':'))[0])
        }
        
        // 동일날짜 제거
        remove_samedate_arr = Array.from(new Set(date_arr));
        
        // 빠른순으로 재정렬
        remove_samedate_arr.sort(function(a, b){
            return (((a.split(' '))[0].split('월'))[0]+((a.split(' '))[1].split('일'))[0]) - (((b.split(' '))[0].split('월'))[0]+((b.split(' '))[1].split('일'))[0]);
        });

        // 상품들을 감싸는 날짜 부모들 생성
        fill_cart3_wrap_date(remove_samedate_arr)
    }

    // 날짜들 생성
    function fill_cart3_wrap_date(remove_samedate_arr){
        html = '';
        txt = '';
        for(var i in remove_samedate_arr){
            txt = '';
            txt = '<div class="cart_date"><input type="hidden" value="'+remove_samedate_arr[i]+'"><div class="cart_date_title_wrap"><span class="cart_date_title font22">'+remove_samedate_arr[i]+'</span> 도착예정</div><div class="cart_date_item_wrap"></div><div class="cart_date_desc"><div class="cart_date_top font20"></div></div></div>'

            html = html + txt;
        }
        $('.cart_3_wrap').html(html);

        // 해당 날짜에 해당되는 상품들 생성
        setTimeout(function(){
            fill_cart_date_item()
        },50)
    }

    // 로컬스토리지에서 해당 상품 날짜에 맞는 위치에 태그 넣기
    function fill_cart_date_item(){
        // console.log(pdt[1].name)
        // console.log(((storage_arr[1].split(':'))[0].split('-'))[0])
        // for문 짤때 처음꺼 들어가서 어떠한 과정을 거친뒤 다음꺼로 넘어가는지 생각하면서 짜면 편한듯하다

        // 가공된 날짜배열에서
        for(var i in remove_samedate_arr){
            txt = '';
            html = '';
            for(var a in storage_arr){ // 로컬스트리지의 모든 상품
                // 가공된 날짜배열의[i] 와 로컬스트리지 상품의[a]의 이름=날짜가 동일하다면
                if(remove_samedate_arr[i]==((storage_arr[a].split('-'))[1].split(':'))[0]){
                    var cart_item, name, price, sale, id, soldout, count, cookitsrc;
                    txt = '';
                    // 모든 상품 pdt중에서
                    for(var c in pdt){
                        // pdt에서 해당 상품의 모든 정보 가져오기
                        // pdt[c]의 이름과 로컬스토리지 상품의 이름과 동일한 것이 cart_item이 됨
                        // 로컬스토리지 상품[a]는 가공된 날짜배열의[i]와 같아야 함
                        if(pdt[c].name==((storage_arr[a].split(':'))[0].split('-'))[0]){
                            cart_item = pdt[c];
                        }
                    }
                    
                    name = cart_item.name;
                    price = cart_item.price;
                    sale = cart_item.sale;
                    id = cart_item.id;
                    soldout = cart_item.soldout.split(',');
                    count = (storage_arr[a].split(':'))[1];
                    cookitsrc = cart_item.cookitsrc;

                    if(sale < price){
                        price = comma(sale);
                        additional_price = '<span class="cart_original_price">'+comma(price)+'원</span>'
                    }else {
                        price = comma(price);
                        additional_price = '';
                    }

                    // 임시품절 날짜 가져오기
                    var soldout_date = ((((storage_arr[a].split('-'))[1].split(':'))[0].split(' '))[1].split('일'))[0];

                    for(var s in soldout){
                        if(soldout[s] < 10){
                            soldout[s] = zero(soldout[s])
                        }
                    }
                    
                    if(soldout.indexOf(soldout_date)!==-1){
                        var soldout_tag = '<div class="cart_soldout_bg font24">임시품절</div>';
                        var soldout_value = 'soldout';
                    }else{
                        soldout_tag = '';
                        soldout_value = '';
                    }
                    
                    txt = '<div class="cart_date_item"><input type="hidden" value="'+id+'"><input type="hidden" class="soldout_remove" value="'+soldout_value+'">'+soldout_tag+'<div class="cart_date_item_img"><img src="'+cookitsrc+'" alt="'+name+'"></div><div class="cart_date_item_desc"><div class="cart_date_item_name font20">'+name+'</div><div class="cart_date_item_price font20">'+price+'원'+additional_price+'</div></div><div class="cart_date_item_count"><div class="cart_date_item_minus"></div><div class="cart_date_item_ea font20">'+count+'</div><div class="cart_date_item_plus"></div></div><div class="cart_date_item_totalprice font20"><span class="cart_date_item_totalprice_value font20">'+comma(count*removecomma(price))+'</span>원</div><div class="cart_date_item_remove"></div></div>';

                    html = html + txt;
                }
            }
            // 생성된 날짜부모태그들중에서 value가 가공된 날짜 배열[i]]와 같은 태그 안에다 html 삽입
            for(var m = 0; m<$('.cart_date').length; m++){
                if($('.cart_date').eq(m).children('input').eq(0).attr('value')==remove_samedate_arr[i]){
                    $('.cart_date').eq(m).children('.cart_date_item_wrap').html(html);
                }
            }
        }

        // 해당 날짜의 총 가격 함수실행
        date_item_bill()
    }

    // 해당 날짜의 총 가격 함수
    function date_item_bill(){
        for(var q = 0; q < $('.cart_date').length; q++){
            txt = '';
            html = '';
            for(var w = 0; w < $('.cart_date').eq(q).children('.cart_date_item_wrap').children('.cart_date_item').length; w++){
                txt ='';
                var base = $('.cart_date').eq(q).children('.cart_date_item_wrap').children('.cart_date_item').eq(w);
                txt = removecomma(base.children('.cart_date_item_totalprice').children('.cart_date_item_totalprice_value').text());
                html = html*1+txt*1;
            }
            var price1 = html
            if(price1 > 43000){
                var price2 = 0;
                var more_buy = '';
            }else {
                price2 = 3000
                more_buy = '<div class="buy_more_freedeliver font20">'+comma(43000-price1)+'원 더 구매 시 무료배송해드려요</div>'
            }
            
            if(mobile){
                var br = '<br>'
            }else {
                br = '';
            }
            var totalprice = price1+price2;

            $('.cart_date').eq(q).children('.cart_date_desc').children('.cart_date_top').html('상품금액 <span class="date_price_default_won">'+comma(price1)+'</span>원 <span class="count_date_add"></span> 배송비 <span class="date_deliver_default_won">'+comma(price2)+'</span>원'+br+' <span class="count_date_equal"></span> 총 <span class="date_total_default_won">'+comma(totalprice)+'</span>원');
            
            $('.cart_date').eq(q).children('.cart_date_desc').children('.cart_date_top').append(more_buy);
        }
        // 모든 날짜의 총 가격 합산 함수 실행
        fill_final();
    }
    
    // 모든 날짜의 총 가격 합산 함수
    function fill_final(){
        var totalprice_txt = '';
        var totalprice_html = '';
        var totaldeliver_txt = '';
        var totaldeliver_html = '';
        for(i = 0; i < $('.cart_date').length; i++){
            totalprice_txt = '';
            totaldeliver_txt = '';
            totalprice_txt = (removecomma($('.cart_date').eq(i).children('.cart_date_desc').children('.cart_date_top').children('.date_price_default_won').text()))*1;

            totaldeliver_txt = (removecomma($('.cart_date').eq(i).children('.cart_date_desc').children('.cart_date_top').children('.date_deliver_default_won').text()))*1;
            
            totalprice_html = totalprice_html*1 + totalprice_txt;
            totaldeliver_html = totaldeliver_html*1 + totaldeliver_txt;
        }
        $('.default_won1').html(comma(totalprice_html))
        $('.default_won3').html(comma(totaldeliver_html))
        $('.default_won4').html(comma(totalprice_html+totaldeliver_html))

        if(totalprice_html==0){
            $('.default_won1').html(0)
        }
        if(totaldeliver_html==0){
            $('.default_won3').html(0)
        }
        if(totalprice_html+totaldeliver_html==0){
            $('.default_won4').html(0)
        }
    }

    function zero(value){
        if(value<10){
            return '0'+value;
        }else{
            return value;
        }
    }

    function empty(){
        html = '';
        html = '<div class="empty"><div class="empty_img"></div><div class="empty_txt1 font20">장바구니에 담긴 메뉴가 없습니다.</div><div class="empty_txt2 font20">다양한 맛을 가진 메뉴를 확인해보세요.</div><div class="empty_txt3 font20"><span class="empty_txt3_go_menu">메뉴보러가기<span class="empty_go_btn"></span></span></div></div>'

        $('.cart_3_wrap').html(html);
    }

    function comma(num){
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    };

    function removecomma(num){
        return num.replace(',','');
    }
})