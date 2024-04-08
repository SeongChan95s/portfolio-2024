





  /* ======

    basic settings

  ====== */


  /* ------ 미디어쿼리 ------ */
  // 미디어쿼리 리스트(실시간)
  var devDesktop = window.matchMedia('(min-width: 1025px)');
  var devTablet = window.matchMedia('(min-width: 768px) and (max-width:1024px)');
  var devMobile = window.matchMedia('(max-width: 767px)');


  /* ------ 클릭 & 터치 이벤트 전환 ------ */
  // iOS click event 300ms delay 
  // ios가 클릭과 스와이프 동작을 구분하기 위해 의도적으로 click event를 지연시키기 때문에, 이를 막기 위해 핀치 줌을 비활성화하지 않아도 터치 지원 디바이스를 미리 인식하여 적절한 이벤트를 적용한다.
  var clickEvent = ('ontouchstart' in document.documentElement === true) ? 'touchstart' : 'click';


  // alert("본 페이지는 데스크탑에 최적화되어 있습니다. 태블릿과 모바일에서 일부 기능이 제한될 수 있습니다.");




  /* ------ scroll-y ------ */
  var scrollTopValue;

  window.addEventListener('scroll', () => {
    scrollTopValue = window.scrollY;

    document.documentElement.style.setProperty('--scroll-y', `${scrollTopValue}px`);
  });


  
  /* ------ var(--vh)  ------ */
  // 모바일 vh 변동으로 인한 버벅임 해소
  const setVh = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  };

  setVh();



  /* ------

    Splitting.js

  ------ */

  Splitting();







$(function(){



  /* ====== 

    function

  ====== */


  /* ====== view observer ====== */
  var observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.intersectionRatio > 0){
        entry.target.classList.add('inview'); // 보여질때
      }
    })
  });
  
  const viewObservers = document.querySelectorAll('.view-observer');

  viewObservers.forEach(el=>{
    observer.observe(el);
  })
  



  /* ====== tool tip mobile ====== */
  const toolTipEls = document.querySelectorAll('.toolTip');
  const toolTipAlert = document.getElementById('tool-tip-alert');
  const toolTipAlertTxt = toolTipAlert.querySelector('p');

  
  function toolTipShow(el){
    let copyTxt = el.children[0].innerHTML;

    toolTipAlertTxt.innerText = copyTxt;
    toolTipAlert.classList.add('active');
  };


  function toolTipHide(){
    toolTipAlert.classList.remove('active');

    setTimeout(function(){
      toolTipAlertTxt.innerText = '';
    }, 500);
  }
  




  /* ====== scroll disable, able ====== */
  /* this need scroll-disable class */
  function scrollDisable(){
    const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');

    document.body.classList.add('scroll-disable');
    document.body.style.top = `-${scrollY}`;
  }


  function scrollAble(){
    const scrollY = document.body.style.top;
    document.body.style.top = '';

    $('body').removeClass('scroll-disable');
    ScrollTrigger.refresh(); // scrollTrigger 위치보정

    window.scrollTo({
      top:parseInt(scrollY || '0') * -1, 
      left:0, 
      behavior:'instant'
    });
  }





  /* ====== svg error src handle ====== */
  function handleSvgError(el){
    let url = el.getAttribute('src');
    url = url.replace('.svg', '.png');
    el.setAttribute('src', url);
  }

  const svgErrorHandleTgs = document.querySelectorAll('.svg-error-handle');

  svgErrorHandleTgs.forEach(el => {
    el.addEventListener("error", e => {
      handleSvgError(e.target);
    });
  });




  /* ====== move indicator ====== */
  function moveIndicator(array, activeIndex, display){
    let width = array[activeIndex].offsetWidth;
    let currentLeft = 0;

    for (i = 0; i < activeIndex; i++) {
      currentLeft += array[i].offsetWidth;
      // console.log(currentLeft);
    }  // left 값에 활성화된 버튼[activeIndex]의 이전 너비를 전부 더해주기

    display.style.left = currentLeft + 'px';
    display.style.width = width + 'px';
  }


  function changeStatus(array, activeIndex){    

    // icon
    for(i=0; i<array.length; i++){
      let icon = array[i].querySelector('.icon');
      let src = icon.getAttribute('src');
      // console.log(activeIndex); // 0,1,2,3,4

      if(i == activeIndex){
        src = src.replace('disabled', 'enabled');
      } else {
        src = src.replace('enabled', 'disabled');
      }
      icon.setAttribute('src', src);
    }

    // color
    array.forEach(function(el){el.classList.remove('active');})
    array[activeIndex].classList.add('active');
  }


  
  /* ====== pathTxt appear ====== */
  function intro02PathTxt_appear(){
    const pathTxt = gsap.utils.toArray('.path-txt tspan');

    pathTxt.forEach((pathTl,i) => {
      ScrollTrigger.create({
        trigger: pathTl,
        id: i+1,
        start: "top 70%",
        end: 99999,
        toggleActions: 'play none none none',
        toggleClass: 'active',
        // markers: true,
      });
    }); // pathTxt.forEach
  } // function



  /* ====== works details ====== */
  let worksDetails = document.querySelector('#works-details');
  let worksDetailsLinks = document.querySelectorAll('.works-details-link');
  let worksDetailsItems= worksDetails.querySelectorAll('.works-details-item');
  let worksDetailsCloseBtn = worksDetails.querySelector('.close-btn');

  function worksDetailsShow(i){
    worksDetails.classList.add('active');
    worksDetailsItems[i].classList.add('active');
    // scrollDisable();
  }

  function worksDetailsHide(){
    worksDetailsItems.forEach(function(el){
      el.classList.remove('active');
    })
    // scrollAble();
    worksDetails.classList.remove('active');
  }






  /* ====== 
  
    execution statement

  ====== */


  /* ------ 
  
    all device
  
  ------ */



  /* ====== intro02 section  ====== */
  let intro02Section = document.getElementById("intro02");
  const intro02Items = document.querySelectorAll("#intro02 .item");


  intro02Items.forEach( item =>{
    /* ------ intro02 typo appear ------ */
    let card = item.querySelector('.card');

    let itemTl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 70%",
        end:"bottom top",
        toggleActions:"play resume resume resume",
        // markers:true,
      },
    }); // timeline
    

    /* tit, txt appear effect */
    let tit = item.querySelectorAll(".tit .char");
    let txt = item.querySelectorAll(".txt");

    itemTl
      .from(tit, {
        opacity:0,
        y:60,
        duration:.6,
        stagger:0.25,
        ease: "expo.out",
      },0)
      .from(txt, {
        opacity:0,
        x:120,
        duration:1.2,
        ease: "circ.out",
      },0);
  });
  


  /* item02 */
  gsap.from("#intro02 .paper-person .cls", {
    stagger:0.2,
    opacity:0,
    y:-30,
    ease: "bounce.out",
    scrollTrigger:{
      trigger:intro02Items[2],
      toggleActions:"restart resume resume restart",
      // markers:true
    }
  });



  /* ====== works details ====== */
  // show
  for(let i=0; i<worksDetailsLinks.length; i++){
    worksDetailsLinks[i].addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();

      worksDetailsShow(i);

      if(isMobile()){
        scrollDisable();
      }
    })
  } //for
  
  // hide
  worksDetailsCloseBtn.addEventListener('click', function(){
    worksDetailsHide();

    if(isMobile()){
      scrollAble();
    }
  })





  /* ====== 

    swiper slide
    
  ======*/

  var mainVisualSwiper = new Swiper(".main-visual-swiper", {
    slidesPerView: 1,
    allowTouchMove:false,
    speed:900,
    effect: "coverflow",
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 400,
      modifier: 1,
      slideShadows: false,
    },
  });


  var worksSwiper = new Swiper(".col2-swiper", {
    slidesPerView: 1,
    spaceBetween: 16,
    watchSlidesProgress : true, // 보여지는 슬라이드 감지
    slideVisibleClass: "swiper-slide-visible", // 보여지는 슬라이드 class
    grabCursor: true, // 마우스커서
    keyboard: true, // 키보드 조작
    simulateTouch: true, // 터치 조작
    observer: true, // display:none 감지
	  observeParents: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
      disabledClass: 'disabled-swiper-button'
    },
    breakpoints:{
      1025:{
        slidesPerView: 2,
        spaceBetween: 36,
      },
      768:{
        slidesPerView: 2,
        spaceBetween: 24,
      }
    }
  });


  var worksDetailsSwiper = new Swiper('.works-details-swiper', {
    slidesPerView:"auto",
    spaceBetween: 16,
    slidesPerGroup: 1,
    centeredSlides: true, // 가운데 정렬
    watchSlidesProgress : true, // 보여지는 슬라이드 감지
    grabCursor: true, // 마우스커서
    keyboard: true, // 키보드 조작
    simulateTouch: true, // 터치 조작
    slideVisibleClass: "swiper-slide-visible", // 보여지는 슬라이드 class
    observer:true,
    observeParents:true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
      disabledClass: 'disabled-swiper-button'
    },
    breakpoints:{
      1025:{
        spaceBetween: 24,
      },
      768:{
        spaceBetween: 24,
      }
    },
  })




  /* ------ 
   
    break point
  
  ------ */



  /* ------ mobile ------ */
  // linearGradient iOS 렌더링 문제로 모바일에서 삭제
  if(isMobile()){
    document.querySelector('linearGradient').remove();
  }
  
  

  /* ====== scrollTrigger breakpoint ====== */
  ScrollTrigger.matchMedia({
    /* desktop device : 1025px ~ */
    "(min-width: 1025px)" : function(){
      performance_improve_willChange(); // 성능향상

      /* ------ intro02 path txt appear ------ */
      intro02PathTxt_appear();


      /* ------ main visual fixed ------ */
      /* 화면 정중앙 배치를 위한 핀스페이스 보정 */
      const skillsHeight = document.querySelector('#skills').offsetHeight;
      let pinSpacingCorrectionValue = 0;

      if(skillsHeight < window.innerHeight){
        pinSpacingCorrectionValue = (window.innerHeight - skillsHeight) / 2;
      }

      /* main visual timeline */
      let mainVisualFixedTl = gsap.timeline({
        scrollTrigger:{
          trigger:".main-visual-fixed",
          start:"top bottom",
          end:"bottom+=" + pinSpacingCorrectionValue + " bottom",
          scrub:1,
          pin:".main-visual-img",
          // markers:true,
        },  
      });

      /* show floating layer */
      gsap.to(".main-visual-fixed-wrap", {
        scrollTrigger:{
          trigger:".main-visual-fixed-wrap",
          start:"top 20%",
          end:"top 20%",
          // markers:true,
          onEnter:()=>{
            $("#floating_layer").addClass('show');
            mainVisualSwiper.slideTo(1);
          },
          onEnterBack:()=>{
            $("#floating_layer").removeClass('show');
            mainVisualSwiper.slideTo(0);
          },
        }
      });

      /* slide change */
      gsap.to("#skills", {
        scrollTrigger:{
          trigger:"#skills",
          start:"top center",
          end:"top center",
          // markers:true,
          onEnter:()=>{
            mainVisualSwiper.slideTo(2);
          },
          onEnterBack:()=>{
            mainVisualSwiper.slideTo(1);
          },
        }
      });


      
    },

    /* desktop & tablet device : 768px ~ */
    "(min-width: 768px)" : function(){

      /* ------ intro01 section ------ */
      var stretchStickContainer = document.querySelector('.stretch-stick-wrap');
      var stretchStick = container.querySelector('.stretch-stick');

      for(num=1; num<5; num++){  // layer
        for(i=0; i<8; i++){ // stick
          var stretchStickClone =  stretchStick.cloneNode(true);
          stretchStickClone.classList.add('layer0' + num);  // layer num class
          stretchStickContainer.append(stretchStickClone);
        }
      };

      /* intro01 timeline */
      var intro01Tl = gsap.timeline({
        scrollTrigger:{
          trigger:"#intro01",
          pin:"#intro01 .scroll-container",
          start:"top top",
          end:"100%",
          // end:"+=150%",
          scrub:0.3,
          // markers:true
        }
      });

      /* random position */
      gsap.set("#intro01 .stretch-stick", {
        top: "random(70, 300)" + "vh",
        left: "random(2, 98)" + "vw",
      });

      intro01Tl
      .to("#intro01 .layer01", {
        y:"-100vh",
        "--stretch":8, // css 변수
        duration:80
      },0)
            
      .to("#intro01 .layer01", {
        autoAlpha:0,
        duration:50,
      }, ">-20")
      
      .to("#intro01 .layer02", {
        y:"-100vh",
        "--stretch":6, // css 변수
        duration:120
      },20 )
      
      .to("#intro01 .layer02", {
        autoAlpha:0,
        duration:50,
      }, ">-20")

      .to("#intro01 .layer03", {
        y:"-100vh",
        "--stretch":8, // css 변수
        duration:120
      },40 )
      
      .to("#intro01 .layer03", {
        autoAlpha:0,
        duration:50,
      }, ">-20")

      .to("#intro01 .layer04", {
        y:"-100vh",
        "--stretch":6, // css 변수
        duration:120
      },60 )
      
      .to("#intro01 .layer04", {
        autoAlpha:0,
        duration:50,
      }, ">-20");


      /* ------ intro01 boundary timeline ------ */
      let intro01BoundaryTl = gsap.timeline({
        scrollTrigger:{
          trigger:"#intro01 .land-boundary",
          start:"top center",
          end:"bottom top",
          scrub:0.3,
          // markers:true
        }
      });

      intro01BoundaryTl
        .to("#intro01 .land-boundary .boundary02", {
          yPercent:35,
        }, 0)
        .to("#intro01 .land-boundary .boundary03", {
          yPercent:40,
        }, 0)
        .to("#intro01 .land-boundary .boundary04", {
          yPercent:55,
        }, 0); 
        // 멀리 있는 배경일수록 내려가는 속도가 느려짐
        // = 가까이 있을수록 더 빨리 내려감


        /* ------ blogTl ------ */
        // 고정하려는 요소의 높이
        const blogFixedTxt = document.querySelector('#blog .front-txt');
        const blogFixedTxtHeight = blogFixedTxt.offsetHeight;

        var blogTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#blog>header",
            pin: blogFixedTxt,
            // pinType:"transform",
            scrub: 1,
            start:"top+=" + blogFixedTxtHeight / 2 + " center",
            // start:"top center",
            end:"bottom-=" + blogFixedTxtHeight + " center",
            // markers:true,
          },
        }); 

      
    }, // desktop & tablet device

    /* tablet & mobile device : ~ 1024px */
    "(max-width: 1024px)" : function(){

      /* ------ intro02 mainHeader white-color ------ */
      var intro02Tl = gsap.timeline({
        scrollTrigger:{
          trigger:"#intro02",
          start:"top top",
          end:"bottom top",
          // markers:true,
          onEnter:function(){
            $('#mainHeader').addClass('white-color');
          },
          onLeave:function(){
            $('#mainHeader').removeClass('white-color');
          },
          onLeaveBack:function(){
            $('#mainHeader').addClass('white-color');
          },
          onEnterBack:function(){
            $('#mainHeader').addClass('white-color');
          },
        },
      });
      
    },

  }) // scrollTrigger.matchMedia





  /* ------ 
  
    etc breakpoint
    
  ------ */
  
  /* ------ mainVisualImg clone ------ */
  if(devTablet.matches || devMobile.matches){
    const mainVisualImgs = document.querySelectorAll('.profile-img, .mockup-img');
    const aboutSectionWrap = document.querySelector('#about .wrap');
    const skillsSectionWrap = document.querySelector('#skills .wrap');

    
    mainVisualImgs.forEach(el=>{
      el.classList.remove('swiper-slide');
    });
    
    aboutSectionWrap.insertBefore(mainVisualImgs[0], aboutSectionWrap.childNodes[2]);
    skillsSectionWrap.appendChild(mainVisualImgs[1]);


  }





  function matchMediaChange(){
    
    switch (true) {

      /* mobile device : ~ 767px */
      case devMobile.matches:

      /* ------ mainHeader white-color ------ */
      $('#mainHeader').addClass('white-color');

      /* ------ tool tip mobile ------ */
      toolTipEls.forEach(el => {
        el.addEventListener('click', e => toolTipShow(e.target));
      });

      toolTipAlert.addEventListener('click', toolTipHide);

      break;

      /* tablet & mobile device : ~ 1024px */
      case devTablet.matches || devMobile.matches:

      /* ------ mainHeader white-color ------ */
      $('#mainHeader').addClass('white-color');


    }
  }


    
  // query 값 실시간 감지하여 핸들러 작동
  devTablet.addEventListener('change',() => {matchMediaChange();});

  // 초기 실행
  matchMediaChange();







  /* ------ 

    contents
    
  ------ */


  /* ====== image light Box ====== */
  /* need element

    .pic[data-src]
    #image-light-Box > img#lightBoxImg

  */
  const pics = document.getElementsByClassName('pic');
  const ImageLightBox = document.getElementById('image-light-box');
  const imageLightBoxView = ImageLightBox.querySelector('img');

  // 클릭 이벤트 연결
  for(i=0; i<pics.length; i++){
    pics[i].addEventListener("click", function(e){
      // scrollDisable();
      showlightBox(e.target);
    } );
  }


  // 라이트 박스 show
  function showlightBox(el){
    const bigLocation = el.getAttribute('data-src');
    imageLightBoxView.setAttribute('src', bigLocation);
    ImageLightBox.classList.add("active");
  }

  // 라이트 박스 hidden
  ImageLightBox.onclick = function(){
    // scrollAble();
    ImageLightBox.classList.remove("active");
  }


  

  /* ====== floating action button ====== */
  /* ------ scroll to top ------ */
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  scrollTopBtn.addEventListener('click', e=>{
    e.preventDefault();
    e.stopPropagation();
    
    window.scrollTo({
      top:parseInt(scrollY || '0') * -1, 
      left:0, 
      behavior:"smooth"
    });
  });


  window.addEventListener('scroll', ()=> {
    if(scrollTopValue > 60){
      scrollTopBtn.classList.add('active');
    } else {
      scrollTopBtn.classList.remove('active');
    }
  });


  /* ------ fab-more-btn ------ */
  const fabMoreBtn = document.getElementById('fab-more-btn');
  const fabMoreBtnTg = document.querySelector('.fab-more-btn-wrap');

  fabMoreBtn.addEventListener('click', ()=>{
    fabMoreBtn.classList.toggle('active');
    fabMoreBtnTg.classList.toggle('active');
  });











  /* ====== tab-menu ====== */
  let tabMenu = document.querySelector(".tab-menu");
  let tabHeader = tabMenu.querySelector(".tab-header");
  let tabsPane = tabHeader.querySelectorAll("li"); // 탭헤더 버튼
  let tabBody = tabMenu.querySelector(".tab-contents");

  for(let i=0; i<tabsPane.length; i++){
    tabsPane[i].addEventListener("click", function(){

      /* 탭헤더 active */
      tabHeader.getElementsByClassName("active")[0].classList.remove("active");
      tabsPane[i].classList.add("active");

      /* 탭바디 active */
      tabBody.getElementsByClassName("active")[0].classList.remove("active");
      tabBody.querySelectorAll(".tab-contents>li")[i].classList.add("active");
    });
  }






  /* ====== 
  
    clip board.js
  
  ====== */


  /* share url */
  const shareURLBtn = document.getElementById('share-btn');

  shareURLBtn.addEventListener('click', function() {
    var textToCopy = 'https://seongchan.net';

    navigator.clipboard.writeText(textToCopy)
      .then(function() {
          prompt('주소(URL)를 복사했습니다. 원하는 곳에 붙여넣기(Ctrl+V)해주세요.', textToCopy);
      })
      .catch(function(err) {
          console.error('복사 실패:', err);
      });
  });

  /* copy email */
  const copyEmailBtn = document.querySelector('.email-clip');

  copyEmailBtn.addEventListener('click', function() {
    var textToCopy = 'seongchan95s@gmail.com';

    navigator.clipboard.writeText(textToCopy)
      .then(function() {
        prompt('이메일 주소가 복사되었습니다.  원하는 곳에 붙여넣기(Ctrl+V)해주세요.', textToCopy);
      })
      .catch(function(err) {
          console.error('복사 실패:', err);
      });
  });

  /* copy phone number */
  const copyPhoneBtn =  document.querySelector('.phone-clip');;

  copyPhoneBtn.addEventListener('click', function() {
    var textToCopy = '010-3867-9431';

    navigator.clipboard.writeText(textToCopy)
      .then(function() {
          prompt('전화번호가 복사되었습니다. 원하는 곳에 붙여넣기(Ctrl+V)해주세요.', textToCopy);
      })
      .catch(function(err) {
          console.error('복사 실패:', err);
      });
  });




  
  /* ------
  
    navigation
  
  ------ */
  
  /* ====== gnb ====== */
  const gnb = document.getElementById('gnb');
  const gnbLinks = document.querySelectorAll("#gnb a");
  const gnbIndicatorDisplay = document.querySelector('#gnb .indicator-display');


  /* desktop device */
  if(!isMobile()){

    /* ------ locomotive scroll anchor ------ */
    const anchorLinks = document.querySelectorAll(
      'a[href^=\\#]:not([href$=\\#])'
    );

    anchorLinks.forEach((anchorLink) => {
      let hashval = anchorLink.getAttribute('href');
      let target = document.querySelector(hashval);
    
      anchorLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
  
        locoScroll.scrollTo(target, {offset : - (window.innerHeight - target.offsetHeight) / 2 + 2});
  
        // locoScroll.scrollTo(target);
      });
    });

  }  else {

    gnbLinks.forEach(el=>{
      el.addEventListener('click', e => {
        e.stopPropagation();
        e.preventDefault();

        let hashval = el.getAttribute('href');
        let tg = document.querySelector(hashval);
        let rect = tg.getBoundingClientRect();
        let elHeight = tg.offsetHeight;

        tg.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
      });
    })
  } 




  /* ------ navigation anchor 강조표시 ------ */
  const SECTION_LINKS = document.querySelectorAll(".section_link");
  SECTION_LINKS.forEach((el, index, array) => {

    ScrollTrigger.create({
      trigger: el,
      start: "top center",
      end: "bottom center",
      onToggle: scrollTrigger => {
        // scrollTrigger.refresh();
        moveIndicator(gnbLinks, index, gnbIndicatorDisplay);
        changeStatus(gnbLinks, index);
      },
      // markers:true,
    });
  }); // SECTION_LINKS.forEach


  /* ------ mouse hover effect ------ */
  gnbLinks.forEach(function(el, index, array){
    el.addEventListener('mouseover', e => {

      el.classList.add('hover');
    });
  });

  gnbLinks.forEach(function(el, index, array){
    el.addEventListener('mouseout', e => {
      el.classList.remove('hover');
    });
  });


  ScrollTrigger.refresh();
  
});


