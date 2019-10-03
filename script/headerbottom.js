$(document).ready(function(){
    var footer_sub_count = 0;
    var localcart = [];
    var hamburgercount = 0;
    var hamburgerslide = false;
    
    // footer
    $(document).on('click', '.cj_group_show', function(){
        footer_sub_count++;
        footer_sub_count = footer_sub_count%2;
        console.log(footer_sub_count)
        if(footer_sub_count==1){
            $('.footer_bottom_sub').addClass('displayblock');
        }else if(footer_sub_count==0){
            $('.footer_bottom_sub').animate({
                bottom : '-='+213
            }, {
                duration : 500,
                complete : function(){
                    $('.footer_bottom_sub').removeClass('displayblock');
                    $('.footer_bottom_sub').css('bottom', '0');
                }
            })            
        }
    })

    // 상품상세 이동
    // 메인슬라이드부분
    $(document).on('click', '.main_slide_link, .main_slide_video, .slide_text', function(){
        window.location = 'iteminform.html?item_id='+$(this).siblings('input').attr('value');
    })
    // 맛별 추천 부분
    $(document).on('click', '.taste_food_item_img', function(){
        window.location = 'iteminform.html?item_id='+$(this).siblings('input').attr('value');
    })
    $(document).on('click', '.taste_food_item_price', function(){
        window.location = 'iteminform.html?item_id='+$(this).parent().parent().parent().siblings('input').attr('value');
    })
    $(document).on('click', '.taste_food_item_name', function(){
        window.location = 'iteminform.html?item_id='+$(this).parent().parent().siblings('input').attr('value');
    })
    // 실시간 베스트 부분
    $(document).on('click', '.best_item_img, .best_item_name', function(){
        window.location = 'iteminform.html?item_id='+$(this).siblings('input').attr('value');
    })
    // index 쿡킷 모든메뉴, 핫딜 부분
    $(document).on('click', '.section5_item_img, .section5_item_text', function(){
        window.location = 'iteminform.html?item_id='+$(this).siblings('input').attr('value');
    })
    // menu2(COOKIT메뉴)의 아이템 부분
    $(document).on('click', '.menu2_item_name', function(){
        window.location = 'iteminform.html?item_id='+$(this).siblings('input').attr('value');
    })
    $(document).on('click', '.menu2_item_img img', function(){
        window.location = 'iteminform.html?item_id='+$(this).parent().siblings('input').attr('value');
    })
    // cart에서 iteminform 이동
    $(document).on('click', '.cart_date_item_img, .cart_date_item_desc', function(){
        window.location = 'iteminform.html?item_id='+$(this).siblings('input').eq(0).attr('value');
    })

    // menu이동
    // main
    $(document).on('click', '.header_bottom_logo, .m_home, .header_mobile_section1_home, .m_logo', function(){
        hamburgercount=0;
        hamburger_move(hamburgercount)
        location.href = 'index.html';
    })
    // menu1
    $(document).on('click', '.menu_introduce, .m_pop_intro', function(){
        hamburgercount=0;
        hamburger_move(hamburgercount)
        location.href = 'cookitintro.html';
    })
    // menu2
    $(document).on('click', '.menu_cookitmenu, .empty_txt3_go_menu, .m_menu, .m_pop_menu', function(){
        hamburgercount=0;
        hamburger_move(hamburgercount)
        location.href = 'cookitmenu.html';
    })
    // menu4
    $(document).on('click', '.menu_review, .m_review', function(){
        hamburgercount=0;
        hamburger_move(hamburgercount)
        location.href = 'review.html';
    })
    // menu4
    $(document).on('click', '.menu_event, .m_pop_event', function(){
        hamburgercount=0;
        hamburger_move(hamburgercount)
        location.href = 'event.html';
    })
    // menu5
    $(document).on('click', '.menu_mycookit, .m_my, .header_mobile_mycookit, .header_mobile_section5_bottom ', function(){
        hamburgercount=0;
        hamburger_move(hamburgercount)
        location.href = 'mycookit.html';
    })

    // mobile
    $(document).on('click', '.m_hamburger', function(){
        hamburgercount=1;
        hamburger_move(hamburgercount)
    })
    
    $(document).on('click', '.header_mobile_section1_remove', function(){
        hamburgercount=0;
        hamburger_move(hamburgercount)
    })
    
    var popup_height = $('.header_mobile_popup').height();
    function hamburger_move(_hamburgercount){
        if(hamburgercount==1&&hamburgerslide==false){
            hamburgerslide = true;
            $('.header_mobile_popup').animate({
                left : 0
            }, {
                duration : 300,
                complete : function(){
                    hamburgerslide = false;
                }
            });
            $('#body').css('height', popup_height);
        }else if(hamburgercount==0&&hamburgerslide==false){
            hamburgerslide = true;
            $('.header_mobile_popup').animate({
                left : 100+'%'
            }, {
                duration : 300,
                complete : function(){
                    hamburgerslide = false;
                }
            });
            $('#body').css('height', 'auto');
        }
    }
    // cart 수량
    fill_cart_number();
    $(document).on('click', '.item_infrom_cart', function(){
        fill_cart_number();
    })

    // 장바구니
    $(document).on('click', '.header_bottom_ul_2 .cart, .m_cart', function(){
        location.href = 'cart.html'
    })
    
    function fill_cart_number(){
        if(localStorage.length==0){
            localcart = [];
        }else{
            localcart = (localStorage.getItem('Storage')).split(',');
        }
        $('.cart_number').text(localcart.length);
    }

    rest_time();
    
    setInterval(function(){
        rest_time()
    }, 1000)

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

    function zero(value){
        if(value<10){
            return '0'+value;
        }else{
            return value;
        }
    }
})