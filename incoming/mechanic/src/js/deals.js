/**
 * @file deals.js
 * @description This file sets up the alert boxes and deals slides for the webpage,
 *  generating HTML content dynamically based on predefined data.
 */

// Setup Alert Boxes

/**
 * @constant {Array<Object>} alertBoxesData
 * @description An array of objects representing the data for each alert box.
 * @property {string} body - The message to be displayed in the alert box.
 */
const alertBoxesData = [
  {
    body: `We are Open 7 days a week.`,
  },
  {
    body: `Both Appointments and Walkins are Welcome.`,
  },
  {
    body: `Special Discounts for Veterans & Military Personel, Students, and Senior Citizens.`,
  },
];

/**
 * @function generateAlertBoxHtml
 * @description Generates HTML for each alert box based on the alertBoxesData array.
 * @param {Array<Object>} boxesData - The array of alert box data.
 * @returns {Array<string>} An array of HTML strings for each alert box.
 */
const generateAlertBoxHtml = (boxesData) => {
  return boxesData.map((bx) => {
    const body = bx.body ? bx.body : ``; // Use the body if available, otherwise use an empty string
    return `<li>${body}</li>`; // Wrap the body in a list item
  });
};

/**
 * @constant {HTMLElement} alertBoxesElement
 * @description The DOM element where the alert boxes will be inserted.
 */
const alertBoxesElement = document.querySelector("#alert-boxes .card-body");

/**
 * @description If the alertBoxesElement exists, set its innerHTML to the generated alert boxes HTML.
 */
if (alertBoxesElement) alertBoxesElement.innerHTML = generateAlertBoxHtml(alertBoxesData).join("");

// Setup Deals Slides

/**
 * @constant {Array<Object>} dealsSlidesData
 * @description An array of objects representing the data for each deal slide.
 * @property {string} icon - The HTML string for the deal icon.
 * @property {string} title - The title of the deal.
 * @property {string} body - The description of the deal.
 */
const dealsSlidesData = [
  {
    icon: `<i class="icon bx bxs-car display-6"></i>`,
    title: `Oil Change Special - Only $29.99`,
    body: `Keep your engine running smoothly! Get a full synthetic oil change today at a special price. Hurry, limited time offer!`,
    price: 29.99,
  },
  {
    icon: `<i class="icon bx bxs-car display-6"></i>`,
    title: `Brake Inspection & Pad Replacement - $89.99`,
    body: `Ensure your safety on the road! Get a complete brake inspection and pad replacement for a discounted price.`,
    price: 89.99,
  },
  {
    icon: `<i class="icon bx bxs-car display-6"></i>`,
    title: `Tire Rotation & Balance - $39.99`,
    body: `Extend the life of your tires and improve handling with our tire rotation and balance service. Limited time offer!`,
    price: 39.99,
  },
  {
    icon: `<i class="icon bx bxs-car display-6"></i>`,
    title: `Full Vehicle Diagnostic - $49.99`,
    body: `Check your car for hidden issues! Our full diagnostic service will ensure your vehicle runs at its best.`,
    price: 49.99,
  },
  {
    icon: `<i class="icon bx bxs-battery display-6"></i>`,
    title: `Battery Check & Replacement - $69.99`,
    body: `Don't get stranded! Get a battery inspection and replacement at a special discounted price.`,
    price: 69.99,
  },
  {
    icon: `<i class="icon bx bxs-car display-6"></i>`,
    title: `Suspension Check & Repair - $99.99`,
    body: `Smooth ride guaranteed! Get your suspension inspected and repaired for a limited time at this special price.`,
    price: 99.99,
  },
];

/**
 * @function generateDealsSlidesHtml
 * @description Generates HTML for each deal slide based on the dealsSlidesData array.
 * @param {Array<Object>} slidesData - The array of deal slide data.
 * @returns {Array<string>} An array of HTML strings for each deal slide.
 */
const generateDealsSlidesHtml = (slidesData) => {
  return slidesData.map((sl) => {
    const {
      icon = '',
      title = '',
      body = '',
      price = ''
    } = sl;

    const output =
      `<li class="glide__slide h-auto">` +
        `<div class="ag-courses_item h-100 bg-primary p-3 text-light rounded">` +
          `<div class="ag-courses-item_bg"></div>` +
          `<div class="ag-courses-item_title fs-5 fw-medium mb-2">` +
            `<div>${icon}</div>` +
            `<h4>${title}</h4>` +
          `</div>` +
          `<div class="ag-course-body">
            <p>${body}</p>
            ${price ? `<div class="btn btn-outline-light fs-3 py-1 px-3">$ ${price.toFixed(2)}</div>` : ''}
          </div>` +
        `</div>` +
      `</li>`;
    return output;
  });
};

/**
 * @constant {HTMLElement} dealsSlidesElement
 * @description The DOM element where the deals slides will be inserted.
 */
const dealsSlidesElement = document.getElementById("deals-slides");

/**
 * @description If the dealsSlidesElement exists, set its innerHTML to the generated deals slides HTML.
 */
if (dealsSlidesElement) dealsSlidesElement.innerHTML = generateDealsSlidesHtml(dealsSlidesData).join("");