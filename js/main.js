document.addEventListener("DOMContentLoaded", () => {
  defineCustomComponents();
  setupSvg();
  setupHeroSlider();
  setupSlider();
  setupNavMenu();
  setupVideo();
  setupGoTop();
});

class HeroSlider {
  constructor(sliderSelector, slidesSelector) {
    this.slider = document.querySelector(sliderSelector);
    this.slides = this.slider.querySelectorAll(slidesSelector);
    this.currentSlideIndex = 0;
    this.totalSlides = this.slides.length;
    this.timer = 0;
    this.setActiveSlide(this.currentSlideIndex);
  }

  setActiveSlide(activeSlideIndex) {
    this.slides.forEach((slide, i) => {
      slide.classList.remove("active");
    });
    let activeSlide = this.slides[activeSlideIndex];
    activeSlide.classList.add("active");
    // let display = window
    //   .getComputedStyle(activeSlide.querySelector(".hero-images"))
    //   .getPropertyValue("display");
    // if (display == "none") {
    //   document.querySelector(".hero-mobile-image").innerHTML =
    //     activeSlide.querySelector(".hero-images").innerHTML;
    // }
    this.currentSlideIndex = activeSlideIndex;
    this.setTimer();
  }

  setNextSlide() {
    let index;
    if (this.currentSlideIndex >= this.totalSlides - 1) {
      index = 0;
    } else {
      index = this.currentSlideIndex + 1;
    }
    this.setActiveSlide(index);
  }

  setPrevSlide() {
    let index;
    if (this.currentSlideIndex <= 0) {
      index = this.totalSlides - 1;
    } else {
      index = this.currentSlideIndex - 1;
    }
    this.setActiveSlide(index);
  }

  setTimer() {
    this.timer = setTimeout(this.setNextSlide.bind(this), 10000);
  }

  clearTimer() {
    clearTimeout(this.timer);
  }
}

function setupHeroSlider() {
  let slider = new HeroSlider(".hero-slider", ".hero-slide");
}

function setupNavMenu() {
  let navLinks = document.querySelectorAll(".header-menu__list__item");

  navLinks.forEach((link) => {
    let timer = null;
    link.addEventListener("mouseover", () => {
      clearTimeout(timer);
      link.classList.add("active");
    });
    link.addEventListener("mouseout", (e) => {
      timer = setTimeout(() => {
        link.classList.remove("active");
      }, 300);
    });
  });
}

function setupSvg() {
  let SVGs = document.querySelectorAll(".svg");
  SVGInjector(SVGs);
}

function setupVideo() {
  let buttons = document.querySelectorAll("button[data-video-href]");
  let videoPlayer = document.querySelector("#video-player");
  let iframe = videoPlayer.querySelector("iframe");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      let src = document.createAttribute("src");
      let href = button.attributes.getNamedItem("data-video-href").value;
      href = href.includes("?") ? href + "&" : href + "?";
      href += "autoplay=1&mute=1";
      src.value = href;
      iframe.attributes.setNamedItem(src);
      videoPlayer.classList.remove("hidden");
      document.addEventListener("click", hidePlayer);
      e.stopPropagation();
    });
  });

  iframe.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  function hidePlayer() {
    videoPlayer.classList.add("hidden");
    iframe.attributes.removeNamedItem("src");
    document.removeEventListener("click", hidePlayer);
  }
}

class CardComponent extends HTMLElement {
  connectedCallback() {
    let href = this.getAttribute("data-href") || "#";
    let imageSrc = this.getAttribute("data-src") || "";
    let title = this.getAttribute("data-title") || "";
    this.innerHTML = `
    <div class="card">
    <div class="card-image">
      <img src="${imageSrc}" alt="" />
    </div>
    <a href="${href}" class="link link_white card-link">
      ${title}
      <span class="link__icon">
        <img class="svg" src="assets/icons/arrow.svg" alt="" />
      </span>
    </a>
  </div>
    `;
  }
}

class NewsCardComponent extends HTMLElement {
  connectedCallback() {
    let href = this.getAttribute("data-href") || "#";
    let imageSrc = this.getAttribute("data-src") || "";
    let title = this.getAttribute("data-title") || "";
    let date = this.getAttribute("data-date") || "";
    this.innerHTML = `
    <div class="news-card">
      <img
        class="news-card__image"
        src="${imageSrc}"
        alt=""
      />
      <div class="news-card__content">
        <div class="news-card__date">${date}</div>
        <h4 class="news-card__title">
        ${title}
        </h4>
        <a href="${href}" class="link">
          Узнать больше
          <span class="link__icon">
            <img class="svg" src="assets/icons/arrow.svg" alt="" />
          </span>
        </a>
      </div>
    </div>
    `;
  }
}

function defineCustomComponents() {
  customElements.define("card-component", CardComponent);
  customElements.define("news-card-component", NewsCardComponent);
}

function setupSlider() {
  new Glide(".glide", {
    type: "carousel",
    startAt: 0,
    perView: 3,
    gap: 24,
    rewind: false,
  }).mount();
}

function setupGoTop() {
  // first add raf shim
  // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  })();

  // main function
  function scrollToY(scrollTargetY, speed, easing) {
    // scrollTargetY: the target scrollY property of the window
    // speed: time in pixels per second
    // easing: easing equation to use

    var scrollY = window.scrollY || document.documentElement.scrollTop,
      scrollTargetY = scrollTargetY || 0,
      speed = speed || 2000,
      easing = easing || "easeOutSine",
      currentTime = 0;

    // min time .1, max time .8 seconds
    var time = Math.max(
      0.1,
      Math.min(Math.abs(scrollY - scrollTargetY) / speed, 0.8)
    );

    // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
    var easingEquations = {
      easeOutSine: function (pos) {
        return Math.sin(pos * (Math.PI / 2));
      },
      easeInOutSine: function (pos) {
        return -0.5 * (Math.cos(Math.PI * pos) - 1);
      },
      easeInOutQuint: function (pos) {
        if ((pos /= 0.5) < 1) {
          return 0.5 * Math.pow(pos, 5);
        }
        return 0.5 * (Math.pow(pos - 2, 5) + 2);
      },
    };

    // add animation loop
    function tick() {
      currentTime += 1 / 60;

      var p = currentTime / time;
      var t = easingEquations[easing](p);

      if (p < 1) {
        requestAnimFrame(tick);

        window.scrollTo(0, scrollY + (scrollTargetY - scrollY) * t);
      } else {
        console.log("scroll done");
        window.scrollTo(0, scrollTargetY);
      }
    }

    // call it once to get started
    tick();
  }

  document.querySelector(".scroll-to-top").addEventListener("click", () => {
    window.scrollTo(0, 0);
  });
}
