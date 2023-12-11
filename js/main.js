document.addEventListener("DOMContentLoaded", () => {
  defineCustomComponents();
  setupHeroSlider();
  setupSlider();
  setupNavMenu();
  setupVideo();
  setupGoTop();
  setupSvg();
  setupTabs();
  setupImageCompare();
});

class HeroSlider {
  constructor(sliderSelector, slidesSelector) {
    this.slider = document.querySelector(sliderSelector);
    if (this.slider) {
      this.slides = this.slider.querySelectorAll(slidesSelector);
      this.currentSlideIndex = 0;
      this.totalSlides = this.slides.length;
      this.timer = 0;
      this.setActiveSlide(this.currentSlideIndex);
    }
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
    link.addEventListener("touchstart", (e) => {
      if (
        e.target.classList.contains("header-menu__link") &&
        !link.classList.contains("active")
      ) {
        e.preventDefault();
      }

      clearTimeout(timer);

      navLinks.forEach((link) => {
        link.classList.remove("active");
      });

      link.classList.add("active");
    });

    link.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("header-menu__link") &&
        !link.classList.contains("active")
      ) {
        e.preventDefault();
      }

      clearTimeout(timer);

      navLinks.forEach((link) => {
        link.classList.remove("active");
      });

      link.classList.add("active");
    });

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

  document
    .querySelector(".header-menu-button")
    .addEventListener("click", function () {
      document
        .querySelector(".header-menu_wrapper")
        .classList.toggle("mobile-hidden");
      this.classList.toggle("active");
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
    let large = this.getAttribute("data-large");
    this.innerHTML = `
    <div class="card ${large != null ? "card_large" : ""}">
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
    <div class="content-card">
      <img
        class="content-card__image"
        src="${imageSrc}"
        alt=""
      />
      <div class="content-card__content">
        <div class="content-card__content__wrapper">
          <div class="content-card__small">${date}</div>
          <h4 class="content-card__title">
          ${title}
          </h4>
        </div>
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
  // new Glide(".glide", {
  //   type: "carousel",
  //   startAt: 0,
  //   perView: 3,
  //   gap: 24,
  //   breakpoints: {
  //     768: {
  //       perView: 2,
  //     },
  //     576: {
  //       perView: 1,
  //     },
  //   },
  // }).mount();
  const prevArrow = $(".news-slider")
    .parents(".section")
    .find(".arrow-button_left");
  const nextArrow = $(".news-slider")
    .parents(".section")
    .find(".arrow-button_right");
  $(".news-slider").slick({
    slidesToShow: 3,
    infinite: false,
    prevArrow,
    nextArrow,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });
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

function setupTabs() {
  const hash = $(location).attr("hash");
  const $tabs = $("a.tabs-item");
  const $nextTabLink = $("#next-tab");

  if (
    $tabs.filter(`[href='${hash}']`).length == 0 ||
    hash == "" ||
    hash == "#"
  ) {
    $($tabs[0]).addClass("tabs-item_active");
    $nextTabLink.attr("href", $($tabs[1]).attr("href"));
    $nextTabLink.find(".link__text").text($($tabs[1]).text());
    $(".tabs-content > .tab").addClass("tab_hidden");
    $(`${$($tabs[0]).attr("href")}`).removeClass("tab_hidden");
    // $(location).attr("hash", $($tabs[0]).attr("href"));
  } else {
    $tab = $tabs.filter(`[href='${hash}']`).first();
    $tab.addClass("tabs-item_active");
    $nextTab = null;
    for (let i = 0; i < $tabs.length; i++) {
      $el = $($tabs[i]);
      if ($el.attr("href") == $tab.attr("href")) {
        if (i + 1 == $tabs.length) {
          $nextTab = $($tabs[0]);
        } else {
          $nextTab = $($tabs[i + 1]);
        }
        break;
      }
    }

    $(".tabs-content > .tab").addClass("tab_hidden");
    $(`${$tab.attr("href")}`).removeClass("tab_hidden");

    $nextTabLink.attr("href", $nextTab.attr("href"));
    $nextTabLink.find(".link__text").text($nextTab.text());
  }

  $tabs.on("click", function (e) {
    $tabs.removeClass("tabs-item_active");
    $(this).addClass("tabs-item_active");

    $(".tabs-content > .tab").addClass("tab_hidden");
    $(`${$(this).attr("href")}`).removeClass("tab_hidden");

    $nextTab = null;
    for (let i = 0; i < $tabs.length; i++) {
      $el = $($tabs[i]);
      if ($el.attr("href") == $(this).attr("href")) {
        if (i + 1 == $tabs.length) {
          $nextTab = $($tabs[0]);
        } else {
          $nextTab = $($tabs[i + 1]);
        }
        break;
      }
    }
    $nextTabLink.attr("href", $nextTab.attr("href"));
    $nextTabLink.find(".link__text").text($nextTab.text());
  });
}

function setupImageCompare() {
  const viewers = document.querySelectorAll(".image-compare");

  viewers.forEach((element) => {
    let view = new ImageCompare(element, {
      controlColor: "#0076E4",
      controlShadow: false,
      addCircle: true,
      addCircleBlur: false,
    }).mount();
  });
}