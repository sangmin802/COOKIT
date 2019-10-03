$(document).ready(function(){
    var count = 0;
    var width = $('.review').eq(0).width();
    var timer = 800;
    var slide = false;
    var length = $('.review').length;
    var w_percent = 20;
    
    $(document).on('click', '.review_next_btn', function(){
        if(slide==false){
            slide = true;
            count++;
            count=count%length
            $('.review').animate({
                left : '-='+width
            }, {
                duration : timer,
                complete : function(){
                    $('.review').eq(count-1).css('left', width*(length-2));
                    slide = false;
                }
            })

            $('.review_fill').animate({
                width : ((count+1)*w_percent)+'%'
            }, timer)
        }
    })

    $(document).on('click', '.review_prev_btn', function(){
        if(slide==false){
            slide = true;
            count--;
            if(count < 0){
                count = 4;
            }
            $('.review').animate({
                left : '+='+width
            }, {
                duration : timer,
                complete : function(){
                    $('.review').eq(count).css('left', -width);
                    slide = false;
                }
            })
            
            $('.review_fill').animate({
                width : ((count+1)*w_percent)+'%'
            }, timer)
        }        
    })

    $(document).on('click', '.review', function(){
        location.href = 'iteminform.html?item_id='+$(this).children('input').val();
    })
});