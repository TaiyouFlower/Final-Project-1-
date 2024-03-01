document
  .getElementById("confirm-booking")
  .addEventListener("click", function () {
    alert("Your booking has been confirmed!");
  });

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const attractionName = urlParams.get("name");
  const duration = urlParams.get("duration");
  const beginner = urlParams.get("beginner");
  const family = urlParams.get("family");
  const rating = urlParams.get("rating");
  const price = parseFloat(urlParams.get("price"));
  const cover = urlParams.get("cover");
  console.log(cover);
  const city = urlParams.get("location-city");
  const country = urlParams.get("location-country");

  document.querySelector(".tour-title").textContent = attractionName;
  document.querySelector(".tour-rating").textContent = `${rating}`;
  document.querySelector(".tour-location").textContent = `${city}, ${country}`;
  document.querySelector(".tour-duration").textContent = `${duration}`;
  console.log(cover);
  if (cover !== null && cover !== "undefined") {
    document.querySelector("body").style.backgroundImage = `url(${cover})`;
  } else {
    document.querySelector("body").style.backgroundImage =
      "url(./images/european-statues.jpg)";
  }

  const guestsSelect = document.getElementById("guests");

  const totalPriceElement = document.querySelector(".total-price");

  function updateTotalPrice() {
    const numGuests = parseInt(guestsSelect.value);

    const totalPrice = numGuests * price;

    totalPriceElement.textContent = `$${totalPrice}`;
  }

  updateTotalPrice();

  guestsSelect.addEventListener("change", updateTotalPrice);
});
