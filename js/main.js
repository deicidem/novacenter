document.addEventListener("DOMContentLoaded", () => {
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

function setupSlider() {
  const prevArrow = $(".news-slider")
    .parents(".section")
    .find(".arrow-button_left");
  const nextArrow = $(".news-slider")
    .parents(".section")
    .find(".arrow-button_right");
  $(".news-slider").slick({
    slidesToShow: 3,
    infinite: true,
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
  $('a[href^="#"]').on('click', function(event) {
    let targetId = $(this).attr('href');
    if (targetId == "#") return;
    event.preventDefault();


    let targetElement = $(targetId);

    if (targetElement.length) {
      let headerHeight = $('.header').outerHeight();
      let offset = targetElement.offset().top - headerHeight - 50;
      console.log(offset);
      $('html, body').scrollTop(offset);
    }
  });
}

function setupTabs() {
  const hash = $(location).attr("hash");
  const $tabs = $("a.tabs-item");
  const $nextTabLink = $("#next-tab");


  function setNextTab(tabIndex) {
    const $nextTab = $tabs.eq((tabIndex + 1) % $tabs.length);
    $nextTabLink.attr("href", $nextTab.attr("href")).find(".link__text").text($nextTab.text());
  }

  function showTab($tab) {
    $(".tabs-content > .tab").addClass("tab_hidden");
    $($tab.attr("href")).removeClass("tab_hidden");
    scrollToBase();
  }

  function scrollToBase() {
    const $tabsBase = $("#tabs");
    if ($tabsBase.length == 0) return;
    const $header = $('.header');
    let headerHeight = $header.outerHeight();
    let offset = $tabsBase.offset().top - headerHeight - 50;
    $('html, body').scrollTop(offset);
  }

  if (!hash || $tabs.filter(`[href='${hash}']`).length === 0) {
    const $firstTab = $tabs.eq(0);
    $firstTab.addClass("tabs-item_active");
    setNextTab(0);
    showTab($firstTab);
  } else {
    const $currentTab = $tabs.filter(`[href='${hash}']`).first();
    $currentTab.addClass("tabs-item_active");
    showTab($currentTab);
    setNextTab($tabs.index($currentTab));
  }

  $tabs.on("click", function (e) {
    const $clickedTab = $(this);
    $tabs.removeClass("tabs-item_active");
    $clickedTab.addClass("tabs-item_active");

    showTab($clickedTab);
    setNextTab($tabs.index($clickedTab));
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
