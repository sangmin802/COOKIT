$(document).ready(function(){
    var index;
    var html = '';
    var count = 0;

    divide_way(0)
    $(document).on('click', '.login_way', function(){
        index = $(this).index();
        $('.login_way').removeClass('login_way_focus')
        $(this).addClass('login_way_focus')
        divide_way(index);
    })

    $(document).on('click', '.save_id', function(){
        count++;
        count = count%2;

        if(count==1){
            $('.btn').addClass('nosave_id');
        }else{
            $('.btn').removeClass('nosave_id');
        }
    })

    function divide_way(index){
        html = '';
        switch(index){
            case 0 : {
                fill_member_way();
            }break;
            case 1 : {
                fill_none_member_way();
            }break;
        }
        console.log(index)
    }

    function fill_member_way(){
        html = '<input type="text" placeholder="CJ ONE 통합아이디 6~20자" class="id"><input type="password" placeholder="비밀번호 영문, 특수문자, 숫자혼합 8~12자" class="pw"><div class="find_save"><div class="save_id font20"><div class="btn"></div>아이디 저장</div><div class="find_idpw"><div class="find_id font20">아이디 찾기</div><div class="find_pw font20">비밀번호 찾기</div></div></div><div class="login_btn font20">로그인</div><div class="other_potal_login"><span class="mobile"></span><span class="kakao"></span><span class="naver"></span><span class="facebook"></span></div><div class="cj_member_check font20"><b class="font20">CJ ONE 통합회원이 아니신가요?</b><br>CJ ONE 통합회원으로 가입하시면 CJ제일제당의<br>다양한 서비스(COOKIT, CJ THE MARKET,<br>CJ제일제당 홈페이지)를 이용하실 수 있습니다.<div class="member_ing font20">CJ ONE 통합회원 신규<br>가입하기<span class="right_arrow"></div></div>';

        $('.login_content').html(html);
    }

    function fill_none_member_way(){
        html = '<input type="text" placeholder="주문번호 입력" class="id"><input type="password" placeholder="주문 비밀번호 입력" class="pw"><div class="find_save"><div class="login_btn font20">주문/배송 조회</div><ul class="cj_member_check font20"><li>주문 시 입력한 주문비밀번호와 문자로 발송된 주문<br>번호를 입력하시면 주문내역/배송현황을 조회할 수<br>있습니다.</li><li>비회원으로 구매 시 쿠폰 및 포인트적립 혜택을 받<br>으실 수 없습니다.</li><li>주문번호 및 주문비밀번호를 잊어버리셨다면 COO<br>KIT 고객행복센터 1668-1920로 문의해주세요.</li></ul>';

        $('.login_content').html(html);
    }
})