const hijriDate = document.querySelector(".hijri");
const gregorianDate = document.querySelector(".gregorian");
const prayerTimeWrapper = document.querySelector(".prayer-time-wrapper");
const countriesSelect = document.querySelector(".select-country");
const citySearchInput = document.querySelector(".select-city");
const searchBtn = document.querySelector(".btn");
const hadithWrapper = document.querySelector(".dates-hadit .hadit");

let countrySelected;
let citySelected;

appendDateToDom();
getHadit();
addListOfCountries();
getSelectedCountry();
getSelectedCity();
setDataOnClickOnBtn();

async function addListOfCountries() {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const data = await response.json();

  const countryList = [];
  for (let i = 0; i < data.length; i++) {
    countryList.push({
      countryName: data[i].name.common,
      countryCCA2: data[i].cca2,
    });
  }

  countryList.sort((a, b) => {
    const counntryNameA = a.countryName.toLowerCase(),
      counntryNameB = b.countryName.toLowerCase();

    if (counntryNameA < counntryNameB) {
      return -1;
    }
    if (counntryNameA > counntryNameB) {
      return 1;
    }
    return 0;
  });

  countryList.forEach((country) => {
    countriesSelect.innerHTML += `<option value="${country.countryCCA2}">${country.countryName}</option>`;
  });
}

async function getHadit() {
  const hadithBooks = [
    "muslim",
    "bukhari",
    "tirmidzi",
    "nasai",
    "abu-daud",
    "ibnu-majah",
    "ahmad",
    "darimi",
    "malik",
  ];
  const randomHadithBook = Math.floor(Math.random() * hadithBooks.length);
  const response = await fetch(
    `https://api.hadith.gading.dev/books/${hadithBooks[randomHadithBook]}?range=001-300`
  );
  const data = await response.json();
  const hadiths = data.data.hadiths;
  const randomHadithNumber = Math.floor(Math.random() * hadiths.length);
  hadithWrapper.innerHTML = hadiths[randomHadithNumber].arab;
}

async function getSelectedCountry() {
  countriesSelect.addEventListener("change", () => {
    countrySelected = countriesSelect.value;
  });
}

async function getSelectedCity() {
  citySearchInput.addEventListener("input", () => {
    citySelected = citySearchInput.value;

    if (citySearchInput.value.length >= 3) {
      searchBtn.removeAttribute("disabled");
    } else {
      searchBtn.setAttribute("disabled", "true");
    }
  });
}

async function getPrayerData() {
  const response = await fetch(
    `http://api.aladhan.com/v1/calendarByCity?city=${citySelected}&country=${countrySelected}&method=1`
  );
  const data = await response.json();
  let days;

  if (data.data === "Unable to find city and country pair.") {
    alert("please write a correct city name");
  } else {
    days = data.data;
  }

  // get today date
  let day = new Date().getDate();
  if (day < 10) day = `0${day}`;
  let month = new Date().getMonth();
  if (month < 10) month = `0${month}`.slice(0, 1);
  const year = new Date().getFullYear();
  const todayDate = `${day}-${month + 1}-${year}`.toString();

  // filter to get the exact day
  const correctDay = days.filter((day) => {
    return day.date.gregorian.date == todayDate;
  });
  appendTimingsToDom(correctDay[0]);
}

async function setDataOnClickOnBtn() {
  searchBtn.addEventListener("click", () => {
    getPrayerData();

    if (countriesSelect.value === "undefined") {
      alert("please choose your country");
    }
  });
}

async function appendDateToDom() {
  const response = await fetch(
    `http://api.aladhan.com/v1/calendarByCity?city=taza&method=1`
  );
  const data = await response.json();
  const days = data.data;

  // get today date
  let day = new Date().getDate();
  if (day < 10) day = `0${day}`;
  let month = new Date().getMonth();
  if (month < 10) month = `0${month}`.slice(0, 1);
  const year = new Date().getFullYear();
  const todayDate = `${day}-${month + 1}-${year}`.toString();

  // filter to get the exact day
  const correctDay = days.filter((day) => {
    return day.date.gregorian.date == todayDate;
  });

  const date = correctDay[0].date;
  hijriDate.innerHTML = `${date.hijri.weekday.ar} ${date.hijri.day} ${date.hijri.month.ar} ${date.hijri.year}`;
  gregorianDate.innerHTML = `${date.gregorian.weekday.en} ${date.gregorian.day} ${date.gregorian.month.en} ${date.gregorian.year}`;
}

function appendTimingsToDom(correctDay) {
  const {
    timings: { Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha },
  } = correctDay;
  console.log();
  const dayTiming = `
    <div class="row fw-bold fs-5 py-2 py-md-3 border-bottom border-1 border-dark bg-dark text-light rounded-2">
        <p class="col-4 mb-0 text-capitalize">salat</p>
        <p class="col-4 mb-0 text-center text-capitalize">time</p>
        <p class="col-4 mb-0 arab-font text-end">الصلاة</p>
    </div>
    <div class="row fw-bold fs-6 py-2 py-md-3 border-bottom border-1 border-dark fajr">
        <p class="col-4 mb-0 text-capitalize">fajr</p>
        <p class="col-4 mb-0 text-center">${Fajr.split(" ")[0]}am</p>
        <p class="col-4 mb-0 arab-font text-end">الفجر</p>
    </div>
    <div class="row fw-bold fs-6 py-2 py-md-3 border-bottom border-1 border-dark sunrise">
        <p class="col-4 mb-0 text-capitalize">sunrise</p>
        <p class="col-4 mb-0 text-center">${Sunrise.split(" ")[0]}am</p>
        <p class="col-4 mb-0 arab-font text-end">الشروق</p>
    </div>
    <div class="row fw-bold fs-6 py-2 py-md-3 border-bottom border-1 border-dark duhr">
        <p class="col-4 mb-0 text-capitalize">duhr</p>
        <p class="col-4 mb-0 text-center">${Dhuhr.split(" ")[0]}pm</p>
        <p class="col-4 mb-0 arab-font text-end">الظهر</p>
    </div>
    <div class="row fw-bold fs-6 py-2 py-md-3 border-bottom border-1 border-dark asr">
        <p class="col-4 mb-0 text-capitalize">asr</p>
        <p class="col-4 mb-0 text-center">${Asr.split(" ")[0]}pm</p>
        <p class="col-4 mb-0 arab-font text-end">العصر</p>
    </div>
    <div class="row fw-bold fs-6 py-2 py-md-3 border-bottom border-1 border-dark maghrib">
        <p class="col-4 mb-0 text-capitalize">maghrib</p>
        <p class="col-4 mb-0 text-center">${Maghrib.split(" ")[0]}pm</p>
        <p class="col-4 mb-0 arab-font text-end">المغرب</p>
    </div>
    <div class="row fw-bold fs-6 py-2 py-md-3  isha">
        <p class="col-4 mb-0 text-capitalize">isha</p>
        <p class="col-4 mb-0 text-center">${Isha.split(" ")[0]}pm</p>
        <p class="col-4 mb-0 arab-font text-end">العشاء</p>
    </div>
    `;
  prayerTimeWrapper.innerHTML = dayTiming;
}
