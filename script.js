'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content ');
const allSection = document.querySelectorAll('.section');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////////////////////
// get cookies
// console.log(allSection);

//create msg
const message = document.createElement('div');
message.classList.add('cookie-message');

message.innerHTML = `We use Cookies to improve Functionality and analytics 
<button class="btn btn--close-cookies"> Got it </button>`;

header.append(message);

const cookiesBtn = document.querySelector('.btn--close-cookies');

cookiesBtn.addEventListener('click', () => {
  message.remove();
});

document.body.style.overflowX = 'hidden';
message.style.width = '100vw';
message.style.padding = '1rem';
message.style.backgroundColor = '#2e2e2e';

///////////////////////////////////////
// scrolling btns

btnScrollTo.addEventListener('click', () => {
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// scrolling navigation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //prevent default behavior
  e.preventDefault();
  //matching links
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// tabbed components
function TabbedBtns() {
  tabsContainer.addEventListener('click', e => {
    const clicked = e.target.closest('.operations__tab');
    //gaurd clause
    if (!clicked) return;
    //remove classes (un active)
    tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
    tabsContent.forEach(content =>
      content.classList.remove('operations__content--active')
    );
    //add classes (active)
    clicked.classList.add('operations__tab--active');
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });
}
TabbedBtns();
//nav animation
function NavAnimation() {
  const handleAnimation = function (e) {
    const hovered = e.target;
    if (hovered.classList.contains('nav__link')) {
      const logo = nav.querySelector('.nav__logo');
      const siblings = nav.querySelectorAll('.nav__link');
      [...siblings, logo].forEach(el => {
        if (el !== hovered) el.style.opacity = this;
      });
    }
  };
  nav.addEventListener('mouseover', handleAnimation.bind(0.5));
  nav.addEventListener('mouseout', handleAnimation.bind(1));
}
NavAnimation();

// sticky nav
function StickyNav() {
  const navHeight = nav.getBoundingClientRect().height;

  const obsCallback = entries => {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      nav.classList.add('sticky');
    } else nav.classList.remove('sticky');
  };

  const headerObserver = new IntersectionObserver(obsCallback, {
    root: null,
    threshold: [0],
    rootMargin: `-${navHeight}px`,
  });

  headerObserver.observe(header);
}
StickyNav();
//Reveal sections
function RevealSections() {
  const observCallback = (entries, observer) => {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  };

  const sectionObserver = new IntersectionObserver(observCallback, {
    root: null,
    threshold: 0.15,
  });

  allSection.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
  });
}
RevealSections();
//lazy loading imgs
function lazyImgs() {
  const lazyImgs = document.querySelectorAll('img[data-src');

  const observImgCallback = (entries, observer) => {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    const img = entry.target;
    img.src = img.dataset.src;

    img.addEventListener('load', () => {
      img.classList.remove('lazy-img');
    });
    observer.unobserve(img);
  };

  const lazyImgsObserver = new IntersectionObserver(observImgCallback, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  });

  lazyImgs.forEach(img => lazyImgsObserver.observe(img));
}
lazyImgs();
//slider components
function Slider() {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');

  let currSlide = 0;
  let slides_num = slides.length;

  //functons
  function goToSlide(slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  }

  const nextSlide = () => {
    if (currSlide === slides_num - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    goToSlide(currSlide);
    activeDot(currSlide);
  };

  const pervSlide = () => {
    if (currSlide === 0) {
      currSlide = slides_num - 1;
    } else {
      currSlide--;
    }
    goToSlide(currSlide);
    activeDot(currSlide);
  };

  //create dots
  const createSliderDots = () => {
    slides.forEach((_, i) =>
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide = ${i} ></button>`
      )
    );
  };
  // avtive dots
  const activeDot = slide => {
    const dots = document.querySelectorAll('.dots__dot');
    dots.forEach(dot => dot.classList.remove('dots__dot--active'));

    dotContainer
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  //events handler
  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activeDot(slide);
    }
  });
  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', pervSlide);

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') pervSlide();
  });

  //initalized functions
  const init = () => {
    createSliderDots();
    goToSlide(0);
    activeDot(0);
  };
  init();
}
Slider();
