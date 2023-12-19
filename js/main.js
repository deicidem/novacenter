document.addEventListener("DOMContentLoaded", () => {
	setupHeroSlider();
	setupSlider();
	setupNavMenu();
	setupVideo();
	setupGoTop();
	setupSvg();
	setupTabs();
	setupImageCompare();
	setupImageViewer();
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
	const $navLinks = $(".header-menu__list__item");

	$navLinks.each(function () {
		const $link = $(this);

		if ($link.has("ul").length > 0) {
			$link.addClass("header-menu__list__item_has-submenu");
		}
		let timer = null;

		$link.on("touchstart click mouseover", function (e) {
			if (
				(e.type === "touchstart" || e.type === "click") &&
				$link.children(".header-menu__link").length > 0 &&
				!$link.hasClass("active")
			) {
				e.preventDefault();
			}

			clearTimeout(timer);

			$navLinks.removeClass("active");
			$link.addClass("active");
		});

		$link.on("mouseout", function () {
			timer = setTimeout(function () {
				$link.removeClass("active");
			}, 300);
		});
	});

	$(".header-menu-button").on("click", function () {
		$(".header-menu_wrapper").toggleClass("mobile-hidden");
		$(this).toggleClass("active");
	});
}

function setupSvg() {
	const svgElements = document.querySelectorAll(".svg");
	SVGInjector(svgElements);
}
function setupVideo() {
	let $buttons = $("button[data-video-href]");
	let $videoPlayer = $("#video-player");
	let $iframe = $videoPlayer.find("iframe");

	$buttons.on("click", function (e) {
		let href = $(this).data("video-href");
		href = href.includes("?") ? href + "&" : href + "?";
		href += "autoplay=1&mute=1";

		$iframe.attr("src", href);
		$videoPlayer.removeClass("hidden");
		$(document).on("click", hidePlayer);
		e.stopPropagation();
	});

	$iframe.on("click", function (e) {
		e.stopPropagation();
	});

	function hidePlayer() {
		$videoPlayer.addClass("hidden");
		$iframe.removeAttr("src");
		$(document).off("click", hidePlayer);
	}
}

function setupSlider() {
	const prevArrow = $(".news-slider").parents(".section").find(".arrow-button_left");
	const nextArrow = $(".news-slider").parents(".section").find(".arrow-button_right");
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
	$('a[href^="#"]').on("click", function (event) {
		let targetId = $(this).attr("href");
		if (targetId == "#") {
			$.smoothScroll({ offset: 0 });
			return;
		}

		let targetElement = $(targetId);

		if (targetElement.length) {
			let headerHeight = $(".header").outerHeight();
			let offset = targetElement.offset().top - headerHeight;
			// event.preventDefault();
			$.smoothScroll({
				offset,
			});
		}
	});
}

/**
 * This function initializes the tabs on the page. It checks if the tabs element exists, and if it does, it sets up the event listeners for the tab links and the "to base" link.
 */
function setupTabs() {
	if (!areTabsExist()) return;

	const $tabLinks = $("a.tabs-item");
	const $nextTabLink = $("#next-tab-link");
	const $toBaseLink = $("#tabs-base-link");

	let currentTabIndex = null;
	let nextTabIndex = null;

	init();

	$tabLinks.on("click", function (e) {
		const $clickedTab = $(this);
		const tabIndex = getTabLinkIndex($clickedTab);

		goToTab(tabIndex);
		scrollToBase();
	});

	$nextTabLink.on("click", function (e) {
		goToTab(nextTabIndex);
		scrollToBase();
	});

	$toBaseLink.on("click", function (e) {
		scrollToBase();
	});

	/**
	 * Checks if the tabs element exists on the page.
	 */
	function areTabsExist() {
		return $("#tabs").length > 0;
	}

	function showTabContent(tabId) {
		$(".tabs-content > .tab").addClass("tab_hidden");
		$(tabId).removeClass("tab_hidden");
	}

	/**
	 * Scrolls the page to the tabs element.
	 */
	function scrollToBase() {
		const $tabsBase = $("#tabs");
		if ($tabsBase.length == 0) return;

		const $header = $(".header");
		let headerHeight = $header.outerHeight();
		let offset = $tabsBase.offset().top - headerHeight;

		$.smoothScroll({
			offset,
		});
	}

	/**
	 * Goes to the tab with the given index.
	 * @param {number} tabIndex - The index of the tab to go to.
	 */
	function goToTab(tabIndex) {
		const $tab = $tabLinks.eq(tabIndex);
		const $tabId = getTabIdFromTabLink($tab);

		$tabLinks.removeClass("tabs-item_active");
		$tab.addClass("tabs-item_active");

		showTabContent($tabId);
		setNextTabIndex(tabIndex);
		setNextTabLinkText();
	}

	/**
	 * Gets the tab ID from a tab link.
	 * @param {jQuery} $tabLink - The jQuery object representing the tab link.
	 */
	function getTabIdFromTabLink($tabLink) {
		return $tabLink.attr("href");
	}

	/**
	 * Gets the index of a tab link.
	 * @param {jQuery} $tabLink - The jQuery object representing the tab link.
	 */
	function getTabLinkIndex($tabLink) {
		return $tabLinks.index($tabLink);
	}

	/**
	 * Sets the next tab index based on the current tab index.
	 * @param {number} currentTabIndex - The current tab index.
	 */
	function setNextTabIndex(currentTabIndex) {
		nextTabIndex = (currentTabIndex + 1) % $tabLinks.length;
	}

	/**
	 * Sets the text of the next tab link based on the next tab index.
	 */
	function setNextTabLinkText() {
		const nextTabText = $tabLinks.eq(nextTabIndex).text();
		$nextTabLink.find(".link__text").text(nextTabText ?? "Далее");
	}

	/**
	 * Initializes the tabs by setting up the initial tab and setting up the next tab link text.
	 */
	function init() {
		let hash = $(location).attr("hash");

		if (hash == null || $tabLinks.filter(`[href='${hash}']`).length === 0) {
			currentTabIndex = 0;
		} else {
			currentTabIndex = $tabLinks.index($tabLinks.filter(`[href='${hash}']`).first());
		}

		goToTab(currentTabIndex);
	}
}

/**
 * This function initializes the image comparison viewer on the page. It takes a DOM element as input and initializes the viewer with the default options.
 * @param {HTMLElement} element - The DOM element that contains the image comparison viewer.
 */
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
function setupImageViewer() {
	const images = document.querySelectorAll(".image-viewer");
	if (images.length > 0) {
		images.forEach((image) => {
			new Viewer(image);
		});
	}
}
