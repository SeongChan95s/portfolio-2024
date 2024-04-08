





/* ======

  basic setting

====== */ 


/* mobile device check */
var isMobile = function() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

document.documentElement.dataset.ismobile = isMobile();



/* ------

  scrollTrigger

-------  */

gsap.registerPlugin(ScrollTrigger);
// ScrollTrigger.normalizeScroll(true); // 스크롤러 초기화. touch-pan:x가 적용됨.


// 창 크기 바뀔때마다 ScrollTrigger 새로 고침
window.addEventListener('resize', () => {
  setTimeout(ScrollTrigger.refresh(), 100);
});

// refresh 조건 : 가시성 변화, 돔컨텐트 로드, 로드
ScrollTrigger.config({
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
}); 

/* 높이값 감지하여 locomotive scroll 업데이트 */
// new ResizeObserver(() => ScrollTrigger.refresh()).observe(container);

// window.addEventListener('load', ScrollTrigger.refresh());



/* ------

  locomotive scroll

-------  */

function locoScrollBuild(){
  locoScroll = new LocomotiveScroll({
    el: container,
    smooth: true,
    // for tablet smooth
    tablet: {
      smooth:false,
      breakpoint: 1025 /* ~1024px */
  
      /* 태블릿에서 작동하게 하려면 */
      //  smooth: true,
      //  breakpoint: 768,
    },
  
    // for mobile
    smartphone: {
      breakpoint: 767,
      smooth: false 
    }
  });

  // locomotive scroll을 기본 스크롤러로 설정
  ScrollTrigger.defaults({ scroller: container });


  // locomotive Scroll이 스크롤을 가로채고 있으므로 ScrollTrigger에게 ".smoot-scroll" 요소에 대해 이러한 프록시 방법을 사용하라고 말합니다
  ScrollTrigger.scrollerProxy(container, {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, {disableLerp: true, duration: 0})
        // ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },

    // 세로로만 스크롤하기 때문에 왼쪽 스크롤을 정의할 필요가 없습니다.
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    },

    // 불안정함을 방지하기 위해 locomotive scroll이 켜져있을 때(PC)는 transform, 꺼지있을 때(TABLET, MOBILE) fixed를 사용
    pinType: document.querySelector(".smooth-scroll").style.transform ? "transform" : "fixed"
  });


  // locomotive Scroll이 스크롤되면 Scroll Trigger 업데이트(동기 포지셔닝)
  locoScroll.on("scroll", ScrollTrigger.update);

  // scrollTrigger가 refresh되면 locomotive scroll도 업데이트
  ScrollTrigger.addEventListener("refresh", () => {
    locoScroll.update();
  });

} // locoScrollBuild()


let locoScroll;
const container = document.querySelector('.smooth-scroll'); // locomotive scroll container
const sections = document.querySelectorAll('.section'); // section
const loadingScreen = document.querySelector('#loading_screen');

// only desktop can locomotive scroll
if(!isMobile()){
  locoScrollBuild();

  // 전체 페이지 로드(scrollTrigger refresh) 뒤에 로딩화면 제거
  window.onload = () => {
    setTimeout(()=>{
      window.scrollTo({
        top:0, 
        left:0, 
        behavior:"instant"
      });
  
      loadingScreen.remove();
    }, 500);
  }
}





/* ======

  parallax function

====== */ 

/* ====== 깜빡임 방지 및 성능향상 ====== */
// section.will .will-tg 요소에 will-change
function performance_improve_willChange(){
  sections.forEach(e=>{
    ScrollTrigger.create({
      trigger: e,
      start: "top bottom",
      end: "bottom top",
      toggleClass: "will", // .will .will-tg:contents
      // markers:true,
      onToggle: scrollTrigger => {
        // refresh because height start changes
        scrollTrigger.refresh()
      },
    });
  })
}


/* ====== parallaxBg ====== */
function parallaxBg(){
  /* ------ paralllax bg ------ */
  let parallaxBg = gsap.utils.toArray(".parallax-bg");

  parallaxBg.forEach(i => {

    gsap.to(i, {
      ease: "none",
      backgroundPositionY: "0%",
      scrollTrigger:{
        trigger:i,
        scrub: 0.3,
        // start:"top top",
        // end:"bottom top",
        // markers:true,
      },
    });
  });
}



