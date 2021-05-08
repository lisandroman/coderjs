let swiper = new Swiper(".swiper-container", {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints:{
        // when window width is >= 640px
        1024: {
            slidesPerView: 4,
            spaceBetween: 30
        },
    },
    center: true,
    loop: true,
    pagination: {
        el: '.pagination',
        type: 'fraction',
    },
    navigation: {
        nextEl: '.next',
        prevEl: '.prev'
    },
     // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
    
})
let tl_ = gsap.timeline();
let tl_2 = gsap.timeline();

tl_.from(".loading", {
    duration: 1,
    delay: .5,
    scaleX: 0,
    transformOrigin: 'left',
    ease: "expo.out",
}).to(".loading", {
    duration: .9,
    delay: 0.2,
    scaleX: 0,
    transformOrigin: 'right',
    ease: "expo.In",
}).from(".bg", {
    duration: 2,
    delay: -1.1,
    backgroundSize: "200% 200%",
    opacity: 0,
    ease: Power4.easeOut,
})
    .from([".info span", ".info p"], {
        duration: 1.3,
        delay: -.9,
        y: 50,
        opacity: 0,
        ease: "expo.out",
        stagger: {
            amount: .3
        }
    })
    .from([".swiper-slide", ".next", ".prev", ".paginaton"], {
        delay: -1.2,
        x: -30,
        opacity: 0,
        ease: "expo.out",
        stagger: {
            amount: 1
        }
    })
    .from([".header_ h1", ".menu"], {
        delay: -1.2,
        x: -30,
        opacity: 0,
        ease: "expo.out",
        stagger: {
            amount: .3
        }
    })