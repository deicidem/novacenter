document.addEventListener("DOMContentLoaded", () => {
  defineCard();
  setupSvg();
  setupHeroSlider();
  setupSlider();
  setupNavMenu();
  setupVideo();
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
    this.slides[activeSlideIndex].classList.add("active");
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
    let imageSrc = this.getAttribute("data-src");
    let title = this.getAttribute("data-title");
    this.innerHTML = `
    <div class="card">
    <div class="card-image">
      <img src="${imageSrc}" alt="" />
    </div>
    <a href="" class="link link_white card-link">
      ${title}
      <span class="link__icon">
        <img class="svg" src="assets/icons/arrow.svg" alt="" />
      </span>
    </a>
  </div>
    `;
  }
}

function defineCard() {
  customElements.define("card-component", CardComponent);
}

function setupSlider() {
  new Glide(".glide", {
    type: "carousel",
    startAt: 0,
    perView: 3,
    rewind: false,
  }).mount();
}
