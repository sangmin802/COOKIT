$(document).ready(function(){
    var items_pdt, name, src, deliveryevent, new2, price, peoplem, best, best_src, sale, id;
    var main_slide_btn_count = 0;
    var video_count = 0;
    var recommend_count = 0;
    var taste_btn_count = 0;
    var start_fin_count = 1;
    var review_slide_count = 0;
    var html = '';
    var txt = '';
    var recommend_slide = false;
    var review_slide = false;

    $.ajax({
        url : ('https://raw.githubusercontent.com/sangmin802/COOKIT/master/json/items.json'),
        method : 'GET',
        dataType : 'json'
    }).done(function(data){
        var all_item_cart = [];
        var hot_deal_item_cart = [];
        items_pdt = data;

        for(var l in items_pdt){
            if(items_pdt[l].all==true){
                all_item_cart.push(items_pdt[l])
            }
        }
        
        for(var h in items_pdt){
            if(items_pdt[h].hotdeal==true){
                hot_deal_item_cart.push(items_pdt[h])   
            }
        }

        taste_find(0);
        best_item(items_pdt)
        allmenu_fill(all_item_cart);
        hotdeal_fill(hot_deal_item_cart);
    })

    // main_slide
    var swiper = new Swiper('.main_slide', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // main_slide 색변경
    $(document).on('click', '.swiper-button-next', function(){
        // 실행중이였던 영상 정지
        if(video_count == 1){
            video_count = 0;
            $('.swiper-slide').children('.video_btn').removeClass('video_btn_pause')
            $('.swiper-slide').children('.main_slide_video').children('video').trigger('pause')
        }
        $('.swiper-slide').children('.main_slide_video').removeClass('zindex1');

        main_slide_btn_count++;
        main_slide_btn_count = main_slide_btn_count%5;
        main_slide_btn_count_effect(main_slide_btn_count);
    })

    $(document).on('click', '.swiper-button-prev', function(){
        if(video_count == 1){
            video_count = 0;
            $('.swiper-slide').children('.video_btn').removeClass('video_btn_pause')
            $('.swiper-slide').children('.main_slide_video').children('video').trigger('pause')
        }
        $('.swiper-slide').children('.main_slide_video').removeClass('zindex1');

        main_slide_btn_count--;
        if(main_slide_btn_count<0){
            main_slide_btn_count = 4;
        }
        main_slide_btn_count_effect(main_slide_btn_count);
    })

    // video 실행
    $(document).on('click', '.video_btn', function(){
        var video_btn_index = $(this).parent().index();
        video_count++;
        video_count=video_count%2;
        video_play(video_btn_index);
    })

    // 다음날 배송 가능한시간 타임어택
    rest_time()
    setInterval(function(){
        rest_time()
    }, 1000)

    // 추천메뉴리스트 보이기
    $(document).on('click', '.taste', function(){
        recommend_count++;
        recommend_count = recommend_count%2;
        if(recommend_count==1){
            $('.taste_list').addClass('displayblock');
        }else{
            $('.taste_list').removeClass('displayblock');
        }
    })
    
    // 추천메뉴리스트에서 원하는 맛 선택
    $(document).on('click', '.taste_list li', function(){
        var taste_index = $(this).index();
        taste_find(taste_index);
        taste_btn_count = 0;
        start_fin_count = 1;
        $('.taste_start').html(1);
    })

    // 맛별 선택 슬라이드 오른족
    $(document).on('click', '.taste_next', function(){
        var food_item_length = $('.taste_food_item').length;
        var food_item_width = $('.taste_food_item').width();
        console.log(food_item_width)

        if(recommend_slide == false){
            recommend_slide = true;
            taste_btn_count++;
            taste_btn_count = taste_btn_count % food_item_length;
    
            start_fin_count++;
            if(start_fin_count > Number($('.taste_fin').text())){
                start_fin_count = 1
            }
            $('.taste_start').text(start_fin_count);
            

            $('.taste_food_item').animate({
                left : '-='+food_item_width
            }, {
                duration : 800,
                complete : function(){
                    $('.taste_food_item').eq(taste_btn_count-1).css('left', food_item_width * (food_item_length - 2));
                    setTimeout(function(){
                        recommend_slide = false;
                    }, 400)
                }
            })
        }
    })


    // 맛별 선택 슬라이드 왼쪽
    $(document).on('click', '.taste_prev', function(){
        var food_item_length = $('.taste_food_item').length;
        var food_item_width = $('.taste_food_item').width();

        if(recommend_slide == false){
            recommend_slide = true;
            taste_btn_count--;
            taste_btn_count = taste_btn_count % food_item_length;

            // 맛 별 갯수가 달라서 변수로 처리
            if(taste_btn_count==-1){
                taste_btn_count = food_item_length-1;
            }else{
                taste_btn_count = taste_btn_count;
            }

            start_fin_count--;
            if(start_fin_count < 1){
                start_fin_count = Number($('.taste_fin').text())
            }
            $('.taste_start').text(start_fin_count);
            
            $('.taste_food_item').animate({
                left : '+='+food_item_width
            }, {
                duration : 800,
                complete : function(){
                    $('.taste_food_item').eq(taste_btn_count).css('left', -food_item_width);
                    setTimeout(function(){
                        recommend_slide = false;
                    }, 400)
                }
            })
        }
    })

    // section2 swiper
    var swiper = new Swiper('.section2_swiper', {
        loop : true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
      });

    // 리뷰 슬라이드 오른쪽버튼
    $(document).on('click', '.review_next_btn', function(){
        var review_slide_width = $('.review_img').eq(1).width();
        var review_slide_length = $('.review_img').length;
        
        if(review_slide == false){
            $('.review_img_png').removeClass('left0animation');
            $('.review_img_png').removeClass('opacity0animation');

            $('.review').removeClass('opacity1animation');
            $('.review').removeClass('opacity0animation');

            review_slide = true;
            review_slide_count++;
            review_slide_count = review_slide_count%5;

            $('.review_img').animate({
                left : '-='+review_slide_width
            }, {
                duration : 800,
                complete : function(){
                    $('.review_img').eq(review_slide_count-1).css('left', review_slide_width * (review_slide_length-2));
                    setTimeout(function(){
                        review_slide = false;
                    }, 400)
                }
            })

            $('.review_img_png').eq(review_slide_count).addClass('opacity0animation')
            $('.review').eq(review_slide_count).addClass('opacity0animation');
            setTimeout(function(){
                var review_subslide_count = review_slide_count+1
                review_subslide_count = review_subslide_count%5

                $('.review').eq(review_subslide_count).addClass('opacity1animation');

                $('.review_img_png').eq(review_subslide_count).addClass('left0animation')
            }, 400)

            var review_start_text = review_slide_count+1;
            $('.reveiw_start').html(review_start_text);
        }
    })

    // 리뷰 슬라이드 왼쪽버튼
    $(document).on('click', '.review_prev_btn', function(){
        var review_slide_width = $('.review_img').eq(1).width();

        if(review_slide == false){
            $('.review_img_png').removeClass('left0animation');
            $('.review_img_png').removeClass('opacity0animation');

            $('.review').removeClass('opacity1animation');
            $('.review').removeClass('opacity0animation');

            $('.review_img_png').eq(review_slide_count+1).addClass('opacity0animation');
            $('.review').eq(review_slide_count+1).addClass('opacity0animation');

            review_slide = true;
            review_slide_count--;
            // 리뷰 갯수는 동일해서 그냥 숫자로 표기
            if(review_slide_count < 0){
                review_slide_count = 4;
            }
            review_slide_count = review_slide_count%5;
    
            $('.review_img').animate({
                left : '+='+review_slide_width
            }, {
                duration : 800,
                complete : function(){
                    $('.review_img').eq(review_slide_count).css('left', -review_slide_width);
                    setTimeout(function(){
                        review_slide = false;
                    }, 800)
                }
            })

            setTimeout(function(){
                var review_subslide_count = review_slide_count+1
                review_subslide_count = review_subslide_count%5

                $('.review').eq(review_subslide_count).addClass('opacity1animation');

                $('.review_img_png').eq(review_subslide_count).addClass('left0animation')
            }, 400)

            console.log(review_slide_count)
            var review_fin_text = review_slide_count+1;
            $('.reveiw_start').html(review_fin_text);
        }
    })

    // 함수모음
    function main_slide_btn_count_effect(main_slide_btn_count){
        if(main_slide_btn_count==1||main_slide_btn_count==2||main_slide_btn_count==4){
            $('.main_prev').addClass('swiper-button-prev-white');
            $('.main_next').addClass('swiper-button-next-white');
            $('.main_pagination').addClass('colorwhite');
        }else{
            $('.main_prev').removeClass('swiper-button-prev-white');
            $('.main_next').removeClass('swiper-button-next-white');
            $('.main_pagination').removeClass('colorwhite');
        }
    }

    function video_play(video_btn_index){
        if(video_count == 1){
            $('.main_swiper_slide').eq(video_btn_index).children('.main_slide_video').addClass('zindex1');
            // 비디오 실행
            $('.main_swiper_slide').eq(video_btn_index).children('.video_btn').addClass('video_btn_pause')
    
            $('.main_swiper_slide').eq(video_btn_index).children('.main_slide_video').children('video').trigger('play')
        }else if(video_count == 0){
            $('.main_swiper_slide').eq(video_btn_index).children('.video_btn').removeClass('video_btn_pause')
            $('.main_swiper_slide').eq(video_btn_index).children('.main_slide_video').children('video').trigger('pause')
        }
    }

    // 다음날 배송 가능한시간 타임어택
    function rest_time(){
        var deliver_date;
        var real_today = new Date();
        // 주문가능한 날의 7시까지 남은시간
        if(real_today.getDay()==5&&real_today.getHours){
            deliver_date = new Date(real_today.getFullYear(), real_today.getMonth(), real_today.getDate()+3, 7, 0, 0);
        }else if(real_today.getDay()==6){
            deliver_date = new Date(real_today.getFullYear(), real_today.getMonth(), real_today.getDate()+2, 7, 0, 0);
        }else{
            deliver_date = new Date(real_today.getFullYear(), real_today.getMonth(), real_today.getDate()+1, 7, 0, 0);
        }

        var distance = deliver_date-real_today;
        var _second = 1000;
        var _minute = _second * 60;
        var _hour = _minute * 60;
        
        var hours = Math.floor(distance / _hour);
        // 시간으로 나누고남은 나머지를 분으로 나눈것이 남은 분
        var minutes = Math.floor((distance % _hour) / _minute);
        var seconds = Math.floor((distance % _minute) / _second);
        $('.arrive').html(deliver_date.getMonth()+1+'월 '+(deliver_date.getDate()+1)+'일('+yoil((deliver_date.getDay()+1))+')에 받을 수 있어요');
        $('.etc_time').html(hours+' : '+zero(minutes)+' : '+zero(seconds));
    }

    function yoil(day){
        var yoil = ['일', '월', '화', '수', '목', '금', '토'];
        return yoil[day];
    }

    function taste_find(taste_index){
        html = '';
        var taste_divide_cart = [];
        var taste_li_text = $('.taste_list').children('li').eq(taste_index).text();
        $('.taste_visible').text(taste_li_text);

        setTimeout(function(){
            for(var i in items_pdt){
                if(items_pdt[i].taste == taste_li_text){
                    taste_divide_cart.push(items_pdt[i])
                }
            }
            // 배열의 갯수가 2개 이하라면, 복사
            if(taste_divide_cart.length<3){
                taste_divide_cart.push(taste_divide_cart[0])
                taste_divide_cart.push(taste_divide_cart[1])
            }
            taste_food_fill(taste_divide_cart, taste_index);
        })
    }

    function taste_food_fill(taste_divide_cart, taste_index){
        html = '';
        for(var i in taste_divide_cart){
            txt = '';

            name = taste_divide_cart[i].name;
            src = taste_divide_cart[i].src;
            price = Number(taste_divide_cart[i].price);
            people = taste_divide_cart[i].people;
            deliveryevent = taste_divide_cart[i].deliveryevent;
            id = taste_divide_cart[i].id;
            new2 = taste_divide_cart[i].new;

            if(deliveryevent){
                var deliver_tag = '<span class="deliver_tag">무료배송</span>'
            }else if(!deliveryevent){
                deliver_tag = '';
            }

            if(new2){
                var new_tag = '<span class="new_tag">NEW</span>'
            }else if(!new2){
                new_tag = '';
            }

            txt = '<div class="taste_food_item"><input type="hidden" value="'+id+'" class="item_id"><div class="img taste_food_item_img"><img src="'+src+'" alt="'+name+'"></div><div class="text_table_cell"><div class="taste_food_item_text"><div class="event_banner">'+deliver_tag+new_tag+'</div><div class="name font20 taste_food_item_name">'+name+'</div><div class="price_people"><span class="taste_food_item_price price font28">'+comma(price)+'원</span><span class="people font16">/'+people+'인분</span></div></div></div></div>'

            html = html + txt;
        }
        $('.taste_food_item_wrap').html(html);
        remove_taste_divide_cart = Array.from(new Set(taste_divide_cart));
        $('.taste_fin').text(remove_taste_divide_cart.length);
    }

    // best item 내림차순
    var best_cart = [];
    function best_item(items_pdt){
        for(var b in items_pdt){
            best = items_pdt[b].best;
            if(best==true){
                best_cart.push(items_pdt[b])
            }
        }
        best_cart.sort(function(a,b){
            return a.best_number - b.best_number;
        })

        best_item_fill(best_cart)
    }

    function best_item_fill(best_cart){
        html = '';
        for(var i in best_cart){
            txt ='';

            name = best_cart[i].name;
            best_src = best_cart[i].best_src;
            price = Number(best_cart[i].price);
            people = best_cart[i].people;
            deliveryevent = best_cart[i].deliveryevent;
            new2 = best_cart[i].new;
            best_number = best_cart[i].best_number;
            id = best_cart[i].id;

            if(deliveryevent){
                var deliver_tag = '<span class="deliver_tag">무료배송</span>'
            }else if(!deliveryevent){
                deliver_tag = '';
            }

            if(new2){
                var new_tag = '<span class="new_tag">NEW</span>'
            }else if(!new2){
                new_tag = '';
            }

            if(best_number==1){
                best_number = '<div class="best1">BEST</div>'+zero(best_number);
            }else{
                best_number = zero(best_number);
            }
            txt = '<div class="best_item"><input type="hidden" value="'+id+'" class="item_id"><div class="best_item_img"><div class="best_number">'+best_number+'</div><img src="'+best_src+'" alt="'+name+'"></div><div class="best_item_banner">'+deliver_tag+new_tag+'</div><div class="best_item_name">'+name+'</div><div class="best_item_pricepeople"><span class="best_item_price">'+comma(price)+'원</span><span class="best_item_people">/'+people+'인분</span></div></div>'

            html = html + txt;
        }
        $('.best_item_wrap').html(html);
    }

    // 쿡킷 모든메뉴 보기
    function allmenu_fill(all_item_cart){
        html = '';
        for(var i in all_item_cart){
            txt = '';

            name = all_item_cart[i].name;
            src = all_item_cart[i].src;
            price = Number(all_item_cart[i].price);
            people = all_item_cart[i].people;
            deliveryevent = all_item_cart[i].deliveryevent;
            id = all_item_cart[i].id;
            new2 = all_item_cart[i].new;

            if(deliveryevent){
                var deliver_tag = '<span class="deliver_tag">무료배송</span>'
            }else if(!deliveryevent){
                deliver_tag = '';
            }

            if(new2){
                var new_tag = '<span class="new_tag">NEW</span>'
            }else if(!new2){
                new_tag = '';
            }

            txt = '<div class="section5_item"><input type="hidden" value="'+id+'" class="item_id"><div class="section5_item_img"><img src="'+src+'" alt="'+name+'"></div><div class="section5_item_text"><div class="section5_tablecell"><div class="section5_banner">'+new_tag+deliver_tag+'</div><div class="section5_item_name font20">'+name+'</div><div class="section5_item_pricepeople"><span class="section5_item_price font20">'+comma(price)+'원</span><span class="section5_item_people font20">/ '+people+'인분</span></div></div></div></div>'

            html = html+txt;
        }
        $('.section5_allitem_wrap').html(html);
    }

    // hotdeal 채우기
    function hotdeal_fill(hot_deal_item_cart){
        html = '';
        for(var i in hot_deal_item_cart){
            txt = '';

            name = hot_deal_item_cart[i].name;
            src = hot_deal_item_cart[i].src;
            price = Number(hot_deal_item_cart[i].price);
            sale = Number(hot_deal_item_cart[i].sale);
            people = hot_deal_item_cart[i].people;
            deliveryevent = hot_deal_item_cart[i].deliveryevent;
            id = hot_deal_item_cart[i].id;
            new2 = hot_deal_item_cart[i].new;

            if(deliveryevent){
                var deliver_tag = '<span class="deliver_tag">무료배송</span>'
            }else if(!deliveryevent){
                deliver_tag = '';
            }

            if(new2){
                var new_tag = '<span class="new_tag">NEW</span>'
            }else if(!new2){
                new_tag = '';
            }

            if(sale < price){
                price = sale
            }else{
                price = price
            }

            txt = '<div class="section5_item"><input type="hidden" value="'+id+'" class="item_id"><div class="section5_item_img"><img src="'+src+'" alt="'+name+'"></div><div class="section5_item_text"><div class="section5_tablecell"><div class="section5_banner">'+new_tag+deliver_tag+'</div><div class="section5_item_name font20">*'+name+'</div><div class="section5_item_pricepeople"><span class="hotdeal font20">핫딜</span><span class="section5_item_price font20">'+comma(price)+'원</span><span class="section5_item_people font20">/'+people+'인분</span></div></div></div></div>'

            html = html+txt;
        }
        $('.section5_hotdeal_wrap').html(html);
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