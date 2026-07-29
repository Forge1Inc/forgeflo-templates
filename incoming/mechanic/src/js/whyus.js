/**
 * @file src/js/whyus.js
 * @description This file contains functions to for Setting up Counter Boxes.
 */

const counterBoxesData = [
  {
    id: "business-counter",
    number: 5,
    text: "Years in Business",
  },
  {
    id: "tires-counter",
    number: 650,
    text: "Tires Changed",
  },
  {
    id: "wheels-counter",
    number: 2250,
    text: "Wheels Aligned",
  },
  {
    id: "oil-counter",
    number: 5000,
    text: "Oils Changed",
  },
];
const counterBoxesHtml = counterBoxesData.map((cb) => {
  const id = cb.id ? cb.id : ``;
  const number = cb.number ? cb.number : ``;
  const text = cb.text ? cb.text : ``;
  const output =
    `<div id="${id}" class="counter-widget col-6 col-lg-3">
      <div class="shadow-sm rounded p-4 bg-secondary text-bg-secondary h-100 d-flex flex-column justify-content-center">
        <div class="counter-container">
          <div class="counter-head fs-3">
            <span class="counter-number">${number}</span>+
          </div>
        </div>
        <div>${text}</div>
      </div>
    </div>`;
  return output;
});
const counterBoxesElement = document.getElementById("counter-boxes");
if (counterBoxesElement) counterBoxesElement.innerHTML = counterBoxesHtml.join("");

// animate counters
const reasonCounter = document.querySelectorAll(`.counter-number`);
reasonCounter.forEach(reason => {
  if (reason) countWhenVisible(reason, reason.innerHTML, 1000);
})
function countWhenVisible(element, targetCount, speed) {
  let hasCounted = false;
  let startTime = null;
  let observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hasCounted) {
      hasCounted = true;
      startTime = performance.now();
      let count = 0;
      let duration = speed;
      let interval = setInterval(() => {
        let elapsedTime = performance.now() - startTime;
        let progress = elapsedTime / duration;
        if (progress >= 1) {
          clearInterval(interval);
          element.innerHTML = targetCount;
        } else {
          count = Math.floor(progress * targetCount);
          element.innerHTML = count;
        }
      }, 20);
    }
  });
  if (element) observer.observe(element);
}




// Setup WhyUs Counter Boxes
const reasonBoxesData = [
  {
    title: `Trusted by Locals`,
    body: `We’ve built a reputation for honesty and reliability in the community. Our customers keep coming back because they know we provide transparent services, fair pricing, and quality workmanship on every vehicle we service.`,
  },
  {
    title: `State-of-the-Art Equipment`,
    body: `Our shop is equipped with the latest diagnostic tools and repair technology, allowing us to accurately identify issues and perform repairs efficiently. This ensures your car gets the best possible care every time.`,
  },
  {
    title: `Customer-Centric Approach`,
    body: `We prioritize your needs and comfort. From clear explanations of repairs to flexible scheduling, our goal is to make every visit smooth, stress-free, and transparent for our customers.`,
  },
  {
    title: `Comprehensive Services`,
    body: `From routine maintenance to complex repairs, we handle it all. Whether it’s brakes, suspension, diagnostics, or tire services, you can rely on us for a complete, one-stop solution for your vehicle’s needs.`,
  },
  {
    title: `Certified & Experienced Technicians`,
    body: `All of our technicians are fully certified and undergo continuous training. This expertise allows us to tackle a wide range of vehicles and issues confidently and accurately, giving you peace of mind.`,
  },
  {
    title: `Commitment to Quality`,
    body: `We never cut corners. Every repair and service is performed with attention to detail and a commitment to long-lasting results. Our goal is to ensure your vehicle runs safely and reliably for years to come.`,
  },
];
const reasonBoxesHtml = reasonBoxesData.map((rs) => {
  const title = rs.title ? rs.title : ``;
  const body = rs.body ? rs.body : ``;
  const output =
    `<div class="col-lg-4 col-6 col-12">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h4 class="fs-5 text-primary fw-medium card-title mb-3">${title}</h4>
          ${body}
        </div>
      </div>
    </div>`;
  return output;
});
const reasaonBoxesElement = document.getElementById("reason-boxes");
if (reasaonBoxesElement) reasaonBoxesElement.innerHTML = reasonBoxesHtml.join("");