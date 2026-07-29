/**
 * @file aboutus.js
 * @description This file sets up the service slides for the "About Us" section of the page,
 *  generating HTML content dynamically based on predefined service data.
 */

/**
 * @constant {Array<Object>} serviceSlidesData
 * @description An array of objects representing the data for each service slide.
 * @property {string} icon - The HTML string for the service icon.
 * @property {string} title - The title of the service.
 * @property {string} body - The description of the service.
 */
const serviceSlidesData = [
  {
    icon: `<i class="icon bx bxs-car display-6"></i>`,
    title: `Engine Diagnostics`,
    body: `Our advanced diagnostic tools allow us to accurately identify engine issues and get your vehicle back to peak performance quickly and efficiently.`,
  },
  {
    icon: `<i class="bx bxs-battery"></i>`,
    title: `Battery & Electrical`,
    body: `From battery replacements to complex electrical system repairs, we ensure your car’s power systems are reliable and functioning properly.`,
  },
  {
    icon: `<i class="icon bx bxs-car display-6"></i>`,
    title: `Brake Services`,
    body: `Keep your vehicle safe on the road with our brake inspections, pad replacements, and full brake system repairs handled by certified technicians.`,
  },
  {
    icon: `<i class="icon bx bxs-car display-6"></i>`,
    title: `Oil & Fluid Change`,
    body: `Regular maintenance keeps your engine running smoothly. We provide oil, coolant, transmission, and other fluid services to extend the life of your car.`,
  },
  {
    icon: `<i class="icon bx bxs-car display-6"></i>`,
    title: `Suspension & Steering`,
    body: `From shocks and struts to steering components, we ensure your vehicle handles safely and comfortably in every driving condition.`,
  },
  {
    icon: `<i class="icon bx bxs-car display-6"></i>`,
    title: `Preventive Maintenance`,
    body: `Our preventive maintenance services help detect potential problems early, saving you time and money while keeping your car reliable year-round.`,
  },
];

/**
 * @function generateSlideBoxesHtml
 * @description Generates HTML for each service slide based on the serviceSlidesData array.
 * @param {Array<Object>} slidesData - The array of service slide data.
 * @returns {Array<string>} An array of HTML strings for each service slide.
 */
const generateSlideBoxesHtml = (slidesData) => {
  return slidesData.map((sl) => {
    const body = sl.body ? sl.body : ``;
    const icon = sl.icon ? sl.icon : ``;
    const title = sl.title ? sl.title : ``;
    const output =
      `<li class="glide__slide h-auto">`+
        `<div class="card h-100">`+
          `<div class="card-body">`+
            `<div class="card-title text-primary fw-medium fs-5">${icon} ${title}</div>`+
            `${body}`+
          `</div>`+
        `</div>`+
      `</li>`;
    return output;
  });
};

/**
 * @constant {HTMLElement} slideBoxesElement
 * @description The DOM element where the service slides will be inserted.
 */
const slideBoxesElement = document.getElementById("service-slides");

/**
 * @description If the slideBoxesElement exists, set its innerHTML to the generated slide boxes HTML.
 */
if (slideBoxesElement) slideBoxesElement.innerHTML = generateSlideBoxesHtml(serviceSlidesData).join("");