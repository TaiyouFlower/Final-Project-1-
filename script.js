const url = "./data.json";
const popularAttractions = document.getElementById("popular-attractions");
for (let i = 0; i < 4; i++) {
  const card = document.createElement("li");
  card.classList.add("card");
  card.classList.add(`card-${i + 1}`);
  card.innerHTML = `
    <div class="mini-img-container"></div>
        <div class="card-info">
          <h4 class="card-title"></h4>
          <h5 class="duration"></h5>
          <h5 class="transport"></h5>
          <h5 class="plan"></h5>
          <div class="overview">
            <div class="rating"></div>
            <div class="price"></div>
          </div>
        </div>`;
  popularAttractions.appendChild(card);
}

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const sortedData = data.sort((a, b) => b.avg_visitors - a.avg_visitors);
    const topCities = sortedData.slice(0, 8);
    const popularCities = document.getElementById("popular-cities");
    function findDataWithName(name) {
      return sortedData.find((city) => city.name === name);
    }
    topCities.forEach((city) => {
      const listItem = document.createElement("li");
      if (city === topCities[0]) {
        listItem.classList.add("active");
      }
      listItem.textContent = city.name;
      popularCities.appendChild(listItem);
    });
    let currentCity = topCities[0].name;
    updateCityContent(currentCity);
    const popularCitiesUl = document.getElementById("popular-cities");
    popularCitiesUl.addEventListener("click", function (event) {
      if (event.target.tagName === "LI") {
        const prevSelectedCity = popularCitiesUl.querySelector(".active");
        if (prevSelectedCity) {
          prevSelectedCity.classList.remove("active");
        }
        event.target.classList.add("active");
        const selectedCity = event.target.textContent;
        updateCityContent(selectedCity);
        currentCity = selectedCity;
      }
    });
    function updateCityContent(cityName) {
      let index = 1;
      const cityData = findDataWithName(cityName);
      if (cityData) {
        const cityDesc = document.querySelector(".city-desc");
        cityDesc.querySelector("h2").textContent = cityName;
        cityDesc.querySelector("p").textContent = cityData.description;
        const mainImgContainer = document.querySelector(".main-img-container");
        mainImgContainer.style.backgroundImage = `url(${cityData.cover})`;
        const topCityAttractions = cityData.attractions.slice(0, 4);
        topCityAttractions.map((popularAttraction) => {
          currentCard(index).querySelector(".card-title").textContent =
            popularAttraction.name;
          currentCard(index).querySelector(".duration").textContent =
            popularAttraction.duration;
          currentCard(index).querySelector(".transport").textContent =
            isBeginner(popularAttraction.beginner);
          currentCard(index).querySelector(".plan").textContent = isFamily(
            popularAttraction.family
          );
          currentCard(index).querySelector(".rating").textContent =
            popularAttraction.rating;
          currentCard(index).querySelector(".price").textContent =
            popularAttraction.price;
          currentCard(index).querySelector(
            ".mini-img-container"
          ).style.backgroundImage = `url(${popularAttraction.attraction_cover}`;
          currentCard(index).addEventListener("click", () => {
            const attraction = findAttractionWithName(
              popularAttraction.attraction_name
            );

            redirectToTourPage(attraction);
          });
          index++;
        });
      }
    }

    function currentCard(num) {
      return document.querySelector(`.card-${num}`);
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

    const trending = document.getElementById("trending");
    const trendingCity = topCities[0];
    const trend = document.createElement("div");
    trend.classList.add("wrapper");
    trend.classList.add("trend");
    trend.innerHTML = ` 
<div class="trending-img-container"></div>
      <div class="trending-info">
        <h3>TRENDING NOW</h3>
        <h2>Wildlife of ${trendingCity.name}</h2>
        <div class="trending-overview">
          <h5 class="location">${trendingCity.name}, ${trendingCity.country}</h5>
          <div class="trending-rating">${trendingCity.rating}</div>
        </div>
        <p class="trending-desc">${trendingCity.description}</p>
        <button class="book-now">Book Now</button>
`;

    trending.appendChild(trend);

    function renderFeaturedAttractions(attractions) {
      const featuredCarousel = document.getElementById("featured-carousel");
      featuredCarousel.innerHTML = "";

      attractions.forEach((attraction) => {
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

        featuredCarousel.appendChild(attractionCard);
      });
    }

    const featuredAttractions = [];

    for (let i = 0; i < 5; i++) {
      featuredAttractions.push(topCities[i].attractions[0]);
    }
    renderFeaturedAttractions(featuredAttractions);

    function findCityWithAttraction(attraction) {
      return topCities.find((city) => city.attractions.includes(attraction));
    }
    function findAttractionWithName(attractionName) {
      let desiredCity = "";
      for (let i = 0; i < topCities.length; i++) {
        for (let j = 0; j < topCities[i].attractions.length; j++) {
          if (topCities[i].attractions[j].attraction_name === attractionName) {
            desiredCity = topCities[i];
          }
        }
      }
      return desiredCity.attractions.find(
        (attraction) => attraction.attraction_name === attractionName
      );
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
    const viewAllButton = document.getElementById("view-all-tours");
    viewAllButton.addEventListener("click", () => {
      window.open("/all.html", "_blank");
    });
  })
  .catch((error) => {
    console.error("There was a problem with your fetch operation:", error);
  });

document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("alertShown")) {
    setTimeout(function () {
      alert(
        "Hello!Since database was created by ME and I didn't have time to find all the high quality images,the data is incomplete.However,for full experience I suggest u choose the tours of ALASKA,as I manually finished its database with proper images.Thank you,Good Luck and Enjoy TOUR GUIDES!"
      );
      localStorage.setItem("alertShown", "true");
    }, 4000);
  }
});
