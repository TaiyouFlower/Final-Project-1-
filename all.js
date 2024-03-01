const url = "./data.json";
const toursContainer = document.getElementById("tours-container");

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
    const sortedData = data.sort((a, b) => b.avg_visitors - a.avg_visitors);
    const topCities = sortedData.slice(0, 8);
    function renderAllTours() {
      sortedData.forEach((city) => {
        city.attractions.forEach((attraction) => {
          if (attraction.attraction_cover !== undefined) {
            const attractionCard = document.createElement("li");
            attractionCard.classList.add("card");
            attractionCard.innerHTML = `
      <div class="mini-img-container"><img src="${
        attraction.attraction_cover
      }" alt=""></div>
      <div class="card-info">
        <h4 class="card-title">${attraction.attraction_name}</h4>
        <h5 class="duration">${attraction.duration}</h5>
        <h5 class="transport">${isBeginner(attraction.beginner)}</h5>
        <h5 class="plan">${isFamily(attraction.family)}</h5>
        <div class="overview">
          <div class="rating">${attraction.rating}</div>
          <div class="price">${attraction.price}</div>
        </div>
      </div>
      `;
            attractionCard.addEventListener("click", () => {
              redirectToTourPage(attraction);
            });

            toursContainer.appendChild(attractionCard);
          }
        });
      });
    }
    function redirectToTourPage(attraction) {
      const city = findCityWithAttraction(attraction);
      const params = new URLSearchParams();
      params.append("name", attraction.attraction_name);
      params.append("duration", attraction.duration);
      params.append("beginner", attraction.beginner);
      params.append("family", attraction.family);
      params.append("rating", attraction.rating);
      params.append("price", attraction.price);
      params.append("cover", attraction.attraction_cover);
      params.append("location-city", city.name);
      params.append("location-country", city.country);

      const tourPageUrl = `/tour.html?${params.toString()}`;
      window.open(tourPageUrl, "_blank");
    }
    function findCityWithAttraction(attraction) {
      return topCities.find((city) => city.attractions.includes(attraction));
    }
    function isBeginner(beginner) {
      if (beginner) {
        return "Beginner Friendly";
      } else return "Not Beginner Friendly";
    }
    function isFamily(family) {
      if (family) {
        return "Family Plan";
      } else return "Not Family Plan";
    }
    renderAllTours();
  })
  .catch((error) => {
    console.error("There was a problem with your fetch operation:", error);
  });
document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("alertShown")) {
    setTimeout(function () {
      alert(
        "WARNING:HORRIBLE DESIGN :D my creative skills as a designer have ran out :)"
      );
      localStorage.setItem("alertShown", "true");
    }, 4000);
  }
});
