/**
 * @file src/js/testimonials.js
 * @description This file contains functions to for Setting up Alerts.
 */

// Array of testimonial objects
const alertBoxesData = [
  {
    url: `/#home`,
    // img: ``,
    name: `Michael Ross`,
    body: `Came in for a brake check and oil change and was surprised how thorough they were. They showed me what needed attention and what could wait. No pressure, no upselling. The work was done quicker than expected and the price was fair. The staff was friendly and explained everything clearly. Definitely coming back for future maintenance.`,
  },
  {
    url: `/#home`,
    // img: ``,
    name: `Linda Howard`,
    body: `My AC stopped working in the middle of summer and I was stressed. These guys got me in the same day and figured out the issue fast. They were honest about the cost and finished the job earlier than promised. My car is blowing cold again and I couldn’t be happier. Great service and great people.`,
  },
  {
    url: `/#home`,
    // img: ``,
    name: `Jason Miller`,
    body: `I’ve been to many shops over the years and this is one of the few that actually makes you feel comfortable. They walked me through the inspection and didn’t try to sell me things I didn’t need. The team was professional, patient, and respectful. Highly recommend them if you’re tired of shady mechanics.`,
  },
  {
    url: `/#home`,
    // img: ``,
    name: `Sophia Reed`,
    body: `Took my car in for tire replacement and alignment. The service was fast and the waiting area was clean and comfortable. They kept me updated throughout the process and the price matched the quote. My car drives so much smoother now. Will be sending my friends and family here.`,
  },
  {
    url: `/#home`,
    // img: ``,,
    name: `Daniel Brooks`,
    body: `Had an engine light come on and didn’t know what to expect. They ran a full diagnostic and explained the problem in simple terms. No surprises on the bill and no unnecessary repairs. It’s rare to find a shop you can trust, but this place earned it.`,
  },
  {
    url: `/#home`,
    // img: ``,
    name: `Emily Turner`,
    body: `I brought my car in for a routine service and ended up getting much better care than expected. They noticed a small issue early that could have turned into a big problem later. I really appreciate their honesty and attention to detail. This will be my go-to shop from now on.`,
  },
];

const reviewerPics = import.meta.glob('../assets/media/reviewers/**/*', { eager: true });
import fallBackImg from '../assets/media/logo.svg';

const aletBoxHtml = alertBoxesData.map((rv) => {
  const {
    url = '',
    img = '',
    name = '',
    body = ''
  } = rv;
  const coverImage = reviewerPics[`../assets/media/reviewers/${img}`]?.default || fallBackImg;
  const avatar = img
    ? `<img decoding="async" loading="lazy" width="26" height="26" src="${coverImage}" alt="Google Reviewer's Photo">`
    : `<i class='bx bx-user p-1 border rounded-circle'></i>`

  const output =
  `<li class="glide__slide h-auto">`+
      `<figure class="h-100">`+
        `<figcaption class="text-center text-md-start mb-2 fw-medium">`+
          `<a href="${url}" title="5 star Google Review" rel="nofollow">`+
            `${avatar} ${name} &#8212; <i class="bx bxl-google"></i> <i class="bx bx-map-alt"></i>`+
          `</a>`+
        `</figcaption>`+
        `<div class="star-ratings mb-2 text-center text-md-start">`+
          `<i class="bxs-star bx"></i>`+
          `<i class="bxs-star bx"></i>`+
          `<i class="bxs-star bx"></i>`+
          `<i class="bxs-star bx"></i>`+
          `<i class="bxs-star bx"></i>`+
        `</div>`+
        `<blockquote class="blockquote">"${body}"</blockquote>`+
      `</figure>`+
    `</li>`

  return output;
});

const aletBoxesElement = document.getElementById(`review-slides`)
if (aletBoxesElement) aletBoxesElement.innerHTML = aletBoxHtml.join(``)
