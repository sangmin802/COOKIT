$(document).ready(function(){
    var scrollTop, scrollLeft;
    var section1_offsetTop = $('.section1').offset().top;
    var section2_offsetTop = $('.section2').offset().top;
    var section7_offsetTop = $('.section7').offset().top;
    var moving_left = $('.section7_moving_title').offset().left;
    var section2_textbox_offsetTop = $('.section2_textbox').offset().top;
    var section_gap = section2_offsetTop-section1_offsetTop;
    var section_gap2 = section2_textbox_offsetTop-section2_offsetTop;
    var offsetTop = $(window).scrollTop();
    var window_width = $(window).width();
    var moving_logo_width = $('.moving_logo').width();
    var section7_moving_title = $('.section7_moving_title').width();

    mobile_logo(moving_logo_width);
    check_mobile(window_width, section7_moving_title);
    section7_title(section7_moving_title);

    $(window).resize(function(){
        moving_logo_width = $(window).width();
        window_width = $(window).width();
        section7_moving_title = $('.section7_moving_title').width();
        
        mobile_logo(moving_logo_width);
        check_mobile(window_width, section7_moving_title);      
    })

    function check_mobile(_window_width, _section7_moving_title){
        if(_window_width>=1024){
            size_act(offsetTop)
            
            $(window).scroll(function(){
                scrollTop = $(window).scrollTop();
                scrollLeft = $(window).scrollLeft();
                size_act(scrollTop, scrollLeft);
            })
            $('.section7_moving_title').css('margin-left', 0);
        }else{
            $(window).unbind('scroll');
            $('.section2_img').css('transform', 'scale(1)');
            $('.section2_img').removeClass('section2_img_fixed');
            section7_title(_section7_moving_title);
        }
    }

    function mobile_logo(_moving_logo_width){
        $('.moving_logo').css('margin-left' , -(_moving_logo_width/2));
        $('.matar').css('margin-bottom' , -(_moving_logo_width/2));
    }    
    
    function section7_title(__section7_moving_title){
        $('.section7_moving_title').css('margin-left' , -(__section7_moving_title/2));
    }

    function size_act(){
        section1_offsetTop = $('.section1').offset().top;
        section2_offsetTop = $('.section2').offset().top;
        section7_offsetTop = $('.section7').offset().top;
        moving_left = $('.section7_moving_title').offset().left;
        section2_textbox_offsetTop = $('.section2_textbox').offset().top;
        section_gap = section2_offsetTop-section1_offsetTop;
        section_gap2 = section2_textbox_offsetTop-section2_offsetTop;        
        // 스크롤 scale
        if(scrollTop >= section1_offsetTop && scrollTop <= section2_offsetTop){
            var section_gap_percent = Math.round(((scrollTop-section1_offsetTop) / section_gap * 100));
            var scale_precent = (section_gap_percent / 100 * 20)/ 100;

            $('.section2_img').css('transform', 'scale('+(0.8+scale_precent)+')');
        }

        // 일정위치되면 scale 무조건 고정
        if(scrollTop > section2_offsetTop){
            $('.section2_img').css('transform', 'scale(1)');
        }

        // 스크롤 opacity
        if(scrollTop >= section2_offsetTop && scrollTop <= section2_textbox_offsetTop ){
            var section_opacity_percent = Math.round(((scrollTop-section2_offsetTop) / section_gap2 * 100));
            var opacity_precent = (section_opacity_percent / 100 * 50)/ 100;

            $('.section2_img').children('img').css('opacity', 1-opacity_precent);
        }

        // 일정위치되면 opacity 무조건 고정
        if(scrollTop > section2_textbox_offsetTop){
            $('.section2_img').children('img').css('opacity', 0.5);
        }

        // 스크롤 내릴 때
        if(scrollTop >= section2_offsetTop){
            $('.section2_img').addClass('section2_img_fixed');
            $('.section2_img').addClass('section2_img_scale1');
        }else if(scrollTop < section2_offsetTop){
            $('.section2_img').removeClass('section2_img_fixed');
        }

        // 스크롤 올릴 때
        if(scrollTop >= section2_textbox_offsetTop){
            $('.section2_img').removeClass('section2_img_fixed');
            $('.section2_img').addClass('top969');
        }else if(scrollTop < section2_textbox_offsetTop){
            $('.section2_img').removeClass('top969');
        }

        if(scrollTop >= section7_offsetTop){
            $('.section7_moving_title').addClass('section7_fixed');
        }else if(scrollTop < section7_offsetTop){
            $('.section7_moving_title').removeClass('section7_fixed');
        }
        
        if(scrollLeft > 0 && scrollTop >= section7_offsetTop){
            $('.section7_moving_title').addClass('position_absolute');
            $('.section7_moving_title').css('margin-top', scrollTop-$('.section7').offset().top);
        }else {
            $('.section7_moving_title').removeClass('position_absolute');
            $('.section7_moving_title').css('margin-top', 0);
        }
    }


})