// navigator.geolocation.getCurrentPosition(
//   function (position) {
//     initMap(position.coords.latitude, position.coords.longitude);
//   },
//   function errorCallback(error) {
//     console.log(error);
//   }
// );
"use strict";

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  // clicks = 0;

  constructor(coords, distance, duration) {
    // this.date = ...
    // this.id = ...
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    //this.type[0].toUpperCase()
    this.description = `${
      months[this.date.getMonth()]
    }${this.date.getDate()} : ${this.distance} `;
  }

  // click() {
  //   this.clicks++;
  // }
}

class Running extends Workout {
  type = "running";

  constructor(coords, distance, duration) {
    super(coords, distance, duration);
    //this.cadence = cadence;
    // this.calcPace();
    this._setDescription();
  }

  // calcPace() {
  //   // min/km
  //   this.pace = this.duration / this.distance;
  //   return this.pace;
  // }
}

class Cycling extends Workout {
  type = "cycling";

  constructor(coords, distance, duration) {
    super(coords, distance, duration);
    //  this.elevationGain = elevationGain;
    // this.type = 'cycling';
    // this.calcSpeed();
    this._setDescription();
  }

  // calcSpeed() {
  //   // km/h
  //   this.speed = this.distance / (this.duration / 60);
  //   return this.speed;
  // }
}

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");
// const remove = document.querySelector(".workout__title");
// const removebar = document.querySelector(".workout__icon2");
//const remove = document.querySelector(".workout__icon");
//const remove = document.querySelector(".workout__title");
//const removebar = document.querySelector(".workout__icon2");
// let map, mapEvent;
// window.onload = function () {
//   const remove = document.querySelector(".workout__icon");
//   remove.addEventListener("click", function () {
//     form.style.display = "none";
//     form.classList.add("hidden");
//   });
// };
//var place = 0;
class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();
    // Get data from local storage
    this._getLocalStorage();
    form.addEventListener("submit", this._newWorkout.bind(this));
    // window.onload = function () {
    //   const remove = document.querySelector(".workout__icon");

    //   remove.addEventListener("click", this._removeForm);
    // };
    // inputType.addEventListener("change", this._toggleElevationField);
  }

  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert("cloud not get your position");
      }
    );
  }

  _loadMap(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    var myLatLng = {
      lat,
      lng,
    };
    this.#map = new google.maps.Map(document.getElementById("map"), {
      mapId: "a0997b219b3d6d73",
      //  center: { lat: 48.85, lng: 2.35 },
      center: myLatLng,
      zoom: 11,
      mapTypeControl: false,
      fullscreenControl: false,
      streeViewControl: false,
    });

    const marker = new google.maps.Marker({
      // position: { lat: 48.85, lng: 2.35 },
      position: myLatLng,
      // map,
      title: "Pin",
      icon: { url: "pin.png", scaledSize: new google.maps.Size(38, 31) },
      animation: google.maps.Animation.DROP,
    });
    marker.setMap(this.#map);
    //marker.setMap(null);
    const infowindow = new google.maps.InfoWindow({
      content: "You are here",
    });

    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
    //  infowindow.open(map, marker);

    google.maps.event.addListener(
      this.#map,
      "click",
      this._showForm.bind(this)
    );

    this.#workouts.forEach((work) => {
      this._renderWorkoutMarker(work);
    });

    // const infowindow = new google.maps.InfoWindow({
    //   content: "task",
    // });

    // marker.addListener("click", () => {
    //   infowindow.open(map, marker);
    // });
  }

  // _toggleElevationField() {
  //   inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  //   inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  // }

  _showForm(e) {
    this.#mapEvent = e;

    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _hideForm() {
    // Empty inputs
    inputDistance.value = inputDuration.value =
      // inputCadence.value =
      // inputElevation.value =
      "";

    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  // _removeForm() {
  //   form.style.display = "none";
  //   form.classList.add("hidden");
  // }

  _newWorkout(e) {
    /////

    // const validInputs = (...inputs) =>
    //   inputs.every((inp) => Number.isFinite(inp));
    // const allPositive = (...inputs) => inputs.every((inp) => inp > 0);

    e.preventDefault();

    const type = inputType.value;
    const distance = inputDistance.value;
    const duration = +inputDuration.value;
    const coords = this.#mapEvent["latLng"];
    let workout;

    if (type === "running") {
      // const cadence = +inputCadence.value;

      // Check if data is valid
      if (
        // !Number.isFinite(distance) ||
        !Number.isFinite(duration)
        // !Number.isFinite(cadence)
      ) {
        return alert("Inputs for time have to be positive numbers!");
      }
      workout = new Running(coords, distance, duration);
    }

    if (type === "cycling") {
      // const elevation = +inputElevation.value;

      if (!Number.isFinite(duration)) {
        return alert("Inputs for time  have to be positive numbers!");
      }
      workout = new Cycling(coords, distance, duration);
    }

    this.#workouts.push(workout);

    this._hideForm();
    /////
    //this._renderWorkout(workout);
    //////
    // If workout running, create running object
    this._renderWorkoutMarker(workout);

    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    if (workout.type === "running") {
      var marker = new google.maps.Marker({
        position: workout.coords,
        title: "task",
        icon: { url: "learning.png", scaledSize: new google.maps.Size(38, 31) },
        animation: google.maps.Animation.DROP,
      });
      marker.setMap(this.#map);
    }

    if (workout.type === "cycling") {
      var marker = new google.maps.Marker({
        position: workout.coords,
        title: "task",
        icon: {
          url: "robotic-head.png",
          scaledSize: new google.maps.Size(38, 31),
        },
        animation: google.maps.Animation.DROP,
      });
      marker.setMap(this.#map);
    }

    const infowindow = new google.maps.InfoWindow({
      content: workout.description,
    });

    // marker.addListener("click", () => {
    //   infowindow.open(map, marker);
    // });
    infowindow.open(map, marker);

    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>

      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
  `;

    if (workout.type === "running")
      html += `
    <div class="workout__details">
      <span class="workout__icon">⚡️</span>

      <span class="workout__unit">study!!!</span>
    </div>

  `;

    if (workout.type === "cycling")
      html += `
    <div class="workout__details">
      <span class="workout__icon">⚡️</span>

      <span class="workout__unit">Play!!!</span>
    </div>

  `;

    html += `<div class="workout__details workout__icon2">
  <span class="workout__icon ">⛰</span>

  <span class="workout__unit">remove</span>
  </div>
  </li>
  `;
    form.insertAdjacentHTML("afterend", html);

    const remove = document.querySelector(".workout__title");
    const removebar = document.querySelector(".workout__icon2");

    remove.addEventListener("click", function () {
      this.classList.toggle("completed");
    });

    removebar.addEventListener("click", function () {
      this.closest(".workout").remove();
      //  place = 1;
      marker.setMap(null);
      //_renderWorkoutMarker.marker.setMap(null);
    });
  }

  //   _renderWorkout(workout) {
  //     let html = `
  //   <li class="workout workout--${workout.type}" data-id="${workout.id}">
  //     <h2 class="workout__title">${workout.description}</h2>

  //     <div class="workout__details">
  //       <span class="workout__icon">⏱</span>
  //       <span class="workout__value">${workout.duration}</span>
  //       <span class="workout__unit">min</span>
  //     </div>
  // `;

  //     if (workout.type === "running")
  //       html += `
  //   <div class="workout__details">
  //     <span class="workout__icon"></span>

  //     <span class="workout__unit">study!!!</span>
  //   </div>

  // `;

  //     if (workout.type === "cycling")
  //       html += `
  //   <div class="workout__details">
  //     <span class="workout__icon">⚡️</span>

  //     <span class="workout__unit">Play!!!</span>
  //   </div>

  // `;

  //     html += `<div class="workout__details workout__icon2">
  // <span class="workout__icon ">⛰</span>

  // <span class="workout__unit">remove</span>
  // </div>
  // </li>
  // `;
  //     form.insertAdjacentHTML("afterend", html);

  //     const remove = document.querySelector(".workout__title");
  //     const removebar = document.querySelector(".workout__icon2");

  //     remove.addEventListener("click", function () {
  //       this.classList.toggle("completed");
  //     });

  //     removebar.addEventListener("click", function () {
  //       this.closest(".workout").remove();
  //       //  place = 1;
  //       //_renderWorkout(workout).marker.setMap(null);
  //       //_renderWorkoutMarker.marker.setMap(null);
  //     });
  //   }
  /////////////////////////////////////////////////////////////////////////////
  _setLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("workouts"));

    if (!data) return;

    this.#workouts = data;

    // this.#workouts.forEach((work) => {
    //   this._renderWorkout(work);

    // });
  }

  reset() {
    localStorage.removeItem("workouts");
    location.reload();
  }
}

const app = new App();
