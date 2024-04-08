


  /* ======

    basic setting

  ====== */ 


  /* ------ 미디어쿼리 ------ */
  // 미디어쿼리 리스트(실시간)
  var devDesktop = window.matchMedia('(min-width: 1025px)');
  var devTablet = window.matchMedia('(min-width: 768px) and (max-width:1024px)');
  var devMobile = window.matchMedia('(max-width: 767px)');








$(function(){


  /* ------ 클릭 & 터치 이벤트 전환 ------ */
  // iOS click event 300ms delay 
  // ios가 클릭과 스와이프 동작을 구분하기 위해 의도적으로 click event를 지연시키기 때문에, 이를 막기 위해 핀치 줌을 비활성화하지 않아도 터치 지원 디바이스를 미리 인식하여 적절한 이벤트를 적용한다.
  var clickEvent = ('ontouchstart' in document.documentElement === true) ? 'touchstart' : 'click';



  /* 강제 클릭 이벤트 (초기값 설정) */
  function simulateClick(element) {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(event);
  }


  /* ------ var(--vh)  ------ */
  // 모바일 vh 변동으로 인한 버벅임 해소
  const setVh = () => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  };

  setVh();






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
  


  /* ====== svg size = text size ====== */
  function svgResizeForTxt(el){
    let txt = el.querySelector('text');

    el.style.width = txt.getBBox().width;
    el.style.height = txt.getBBox().height;
  }

  const txtlineEls = document.querySelectorAll('.txt-line');
  txtlineEls.forEach(svgResizeForTxt);



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
    // console.log(activeIndex);
    
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




  /* ====== basic tab menu ====== */
  function tabMenu(el){
    let rel = el.getAttribute('rel');
    let tabHeader = el.querySelector('.tab-header');
    let tabsPane = tabHeader.querySelectorAll('.tab-pane[rel=' + rel + "]");
    
    let tabBody = el.querySelector('.tab-body');
    let tabsItem = tabBody.querySelectorAll('.tab-item[rel=' + rel + "]");

    // indicator
    let tabsPaneWidth = tabHeader.querySelectorAll('.tab-pane span');
    let tabIndicator = tabHeader.querySelectorAll('.tab-indicator[rel=' + rel + "] > span");

    function activeAll(tg){
      tg.forEach(function(index){
        index.classList.add('active');
      });
    }
  
    function activeClear(tg){
      tg.forEach(function(index){
        index.classList.remove('active');
      });
    }

    for(let i=0; i<tabsPane.length; i++){

      tabsPane[i].addEventListener('click', function() {

        // active 초기화
        activeClear(tabsPane);
        activeClear(tabsItem);

        // active 추가
        tabsPane[i].classList.add('active');

        /* 탭버튼과 컨텐츠 개수가 다른 경우 첫 번째 버튼의 컨텐츠 처리 */
        if(tabsPane.length !== tabsItem.length){

          if(i!=0){
            tabsItem[i-1].classList.add("active"); // 첫번째 버튼 제외하고 일반적인 탭메뉴 기능
            
          } else {
            activeAll(tabsItem); // 첫번째 버튼을 클릭하면 전부 표시함.
          }

        } else {
          // 일반적인 탭메뉴 기능
          tabsItem[i].classList.add('active');
        }


        /* tab indicator */
        if(tabIndicator && tabIndicator.length > 0){
          let leftValue = 0;
          
          for (iIndex = 0; iIndex < i; iIndex++) {
            leftValue += tabsPane[iIndex].offsetWidth;
          }  // left 값에 클릭한 탭의 이전 탭들 너비를 전부 더해주기
          tabIndicator[0].style.left = tabsPane[i].offsetWidth / 2 + leftValue + 'px';
          tabIndicator[0].style.width = tabsPaneWidth[i].offsetWidth + 'px';
        }
        // if(devDesktop.matches){
          ScrollTrigger.refresh();
        // }
      }); // click.addEventListener
    } // for
    
    // tabsPane[0]에 대한 클릭 이벤트 초기값
    simulateClick(tabsPane[0]);
  }

  window.tabMenu = tabMenu;



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
  



  /* ====== rolling ====== */
  function rolling(selector, speed) {
    const parentSelector = document.querySelector(selector);
    const clone = parentSelector.innerHTML;
    const firstElement = parentSelector.children[0];
    let i = 0;

    for(n=0; n<5; n++){
      parentSelector.insertAdjacentHTML('beforeend', clone);
    }
  
    setInterval(function () {
      firstElement.style.marginLeft = `-${i}px`;
      if (i > firstElement.clientWidth) {
        i = 0;
      }
      i = i + speed;
    }, 0);
  }
  
  window.addEventListener('load', rolling('.rolling-banner', 0.2))
  




  /* ======
  
    execution statement
    
  ====== */



  /* ====== mainHeader white-color ====== */
  var overviewBgTl = gsap.timeline({
    scrollTrigger:{
      trigger:"#overview .overview-bg",
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
        $('#mainHeader').removeClass('white-color');
      },
      onEnterBack:function(){
        $('#mainHeader').addClass('white-color');
      },
    },
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
  
        // locoScroll.scrollTo(target, {offset : - (window.innerHeight - target.offsetHeight) / 2 + 2});
  
        locoScroll.scrollTo(target, {offset : -80});
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

        tg.scrollIntoView({ behavior: 'smooth', block: 'start' }); 

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







  
  /* ------ 
  
    contents
    
  ------ */

  /* ====== tabMenu ====== */
  let tabMenuEl = document.querySelectorAll('.tab-menu');

  tabMenuEl.forEach(function(el){
    tabMenu(el);
  });




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


  /* ------ fab-more-btn ------ */
  const fabMoreBtn = document.getElementById('fab-more-btn');
  const fabMoreBtnTg = document.querySelector('.fab-more-btn-wrap');

  if(fabMoreBtn !== null){
    fabMoreBtn.addEventListener('click', ()=>{
      fabMoreBtn.classList.toggle('active');
      fabMoreBtnTg.classList.toggle('active');
    });
  }








  
  /* ====== 
  
    break point
    
  ====== */

  /* scrollTrigger matchMedia */
  ScrollTrigger.matchMedia({
    
    /* desktop device : 1025px ~ */
    "(min-width: 1025px)" : function(){

      /* ====== 깜빡임 방지 및 성능향상 ====== */
      performance_improve_willChange();

      parallaxBg();

    },


  })

  /* matchMediaChange */  
  function matchMediaChange(){

    /* tablet device : 768px ~ 1024px */
    if(devTablet.matches){

      parallaxBg();

      /*  ------ scroll to top ------ */
      $(window).scroll(function() {
        var scrollPosition = $(window).scrollTop();
    
        // 스크롤 위치가 일정 값 이상일 때 버튼 보이기/숨기기
        if (scrollPosition > 60) {
          $('#scroll-top-btn').addClass('active');
    
        } else {
          $('#scroll-top-btn').removeClass('active');
        }
      });

    /* mobile device : ~ 767px */
    } else if(devMobile.matches){

      /*  ------ scroll to top ------ */
      $(window).scroll(function() {
        var scrollPosition = $(window).scrollTop();
    
        // 스크롤 위치가 일정 값 이상일 때 버튼 보이기/숨기기
        if (scrollPosition > 60) {
          $('#scroll-top-btn').addClass('active');
    
        } else {
          $('#scroll-top-btn').removeClass('active');
        }
      });


      /* ------ tool tip mobile ------ */
      toolTipEls.forEach(el => {
        el.addEventListener('click', e => toolTipShow(e.target));
      });

      toolTipAlert.addEventListener('click', toolTipHide);


      

    } // mobile device matches
  } // matchMediaChange()


  // query 값 실시간 감지하여 핸들러 작동
  devTablet.addEventListener('change',() => {matchMediaChange();});

  // 초기 실행
  matchMediaChange();



    




  /* ====== 
  
    clip board.js
  
  ====== */


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

    
});

