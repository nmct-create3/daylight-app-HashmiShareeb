// _ = helper functions
let sunSetElement;
let sunRiseElement;
let locationElement;
let sunElement;
let minutesLeft;

function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// // 5 TODO: maak updateSun functie

const updateSun = (sunElement, sunPositionLeft, sunPositionBottom, today) => {
	// Do your thing 💪🏼
	sunElement.style.left = `${sunPositionLeft}%`;
	sunElement.style.bottom = `${sunPositionBottom}%`;
	sunElement.setAttribute(
		'data-time',
		('0' + today.getHours()).slice(-2) +
			':' +
			('0' + today.getMinutes()).slice(-2)
	);
};

//document.querySelector('html').classList.add('is-night');

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	const sunElement = document.querySelector('.js-sun');
	const minutesLeft = document.querySelector('.js-time-left');

	let today = new Date();
	const sunRiseDate = new Date(sunrise * 1000);


	// Bepaal het aantal minuten dat de zon al op is.
	const minutesSunUp = (today.getHours() * 60 + today.getMinutes()) - (sunRiseDate.getHours() * 60 + sunRiseDate.getMinutes());
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	let percentage = (100 / totalMinutes) * minutesSunUp,
	sunLeft = percentage, sunBottom = percentage <50 ? percentage * 2 : (100 - percentage) * 2;
	updateSun(sunElement ,sunLeft ,sunBottom ,today);
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	document.querySelector('html').classList.add('is-loaded');
	// Vergeet niet om het resterende aantal minuten in te vullen.
	minutesLeft.innerHTML = totalMinutes - minutesSunUp;
	// Nu maken we een functie die de zon elke minuut zal updaten
	let moveSun = setInterval(() => {
		today = new Date();

		// Bekijk of de zon niet nog onder of reeds onder is
		if (minutesSunUp < 0 || minutesSunUp > totalMinutes) {
			// Sun is down or set
			clearInterval(moveSun);
			document.querySelector('html').classList.add('is-night');
		} else {
			// Anders kunnen we huidige waarden evalueren en ...
			let leftPercentage = (100 / totalMinutes) * minutesSunUp;
			let bottomPercentage =
				leftPercentage < 50
					? leftPercentage * 2
					: (100 - leftPercentage) * 2;
			// de zon updaten via de updateSun functie.
			updateSun(sunElement, leftPercentage, bottomPercentage, today);
			// PS.: vergeet weer niet om het resterend aantal minuten te updaten en ...
			minutesLeft.innerHTML = totalMinutes - minutesSunUp;
		}
		// verhoog het aantal verstreken minuten.
		minutesSunUp++;
	}, 60000); // 60000
	// 1s = 1000ms
	
};

//3 Met de data van de API kunnen we de app opvullen


//3 Met de data van de API kunnen we de app opvullen
const showResult = (queryResponse) => { //ophaleb van de geladen api met een parameter
	const sunSetElement = document.querySelector('.js-sunset');
	const sunRiseElement = document.querySelector('.js-sunrise');
	const locationElement = document.querySelector('.js-location');
	// We gaan eerst een paar onderdelen opvullen
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	locationElement.innerHTML = `${queryResponse.city.name}, ${queryResponse.city.country}`;
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	sunRiseElement.innerHTML = _parseMillisecondsIntoReadableTime(
		queryResponse.city.sunrise
	);
	sunSetElement.innerHTML = _parseMillisecondsIntoReadableTime(
		queryResponse.city.sunset
	);
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	const GetPositionSun = new Date(
		queryResponse.city.sunset * 1000 - queryResponse.city.sunrise * 1000
	);
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
	placeSunAndStartMoving(
		GetPositionSun.getHours() * 60 + GetPositionSun.getMinutes(),
		queryResponse.city.sunrise
	);
};
// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
const getAPI = async (lat, lon) => {
	// Eerst bouwen we onze url op
	let APIKey = '0676a3fba8c5aafa6a630f2f76abd77f';
	const endpoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric&lang=nl&cnt=1`;
	// Met de fetch API proberen we de data op te halen.
	// Als dat gelukt is, gaan we naar onze showResult functie.
	const request = await fetch(endpoint);
	const data = await request.json();
	console.log(data);	
	showResult(data);
	
};

document.addEventListener('DOMContentLoaded', function() {
	
	// 1 We will query the API with longitude and latitude.
	getAPI(50.82806, 3.265);
	

});





// getAPI(50.8027841, 3.2097454);
	// let lat = 50.8027841;
	// let lng = 3.2097454;
	// const endpoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=0676a3fba8c5aafa6a630f2f76abd77f&units=metric&lang=nl&cnt=1`;
	// getData(endpoint);

	// updateTimeAndTimeLeft(
	// 	makeReadableTimeFormatFromTimestamp(city.sunset - city.sunrise)
	// );
	// const {city} = await getData(endpoint);
	// setLocationData(city);
	// updateTimeAndTimeLeft('TODO');
	// totalTime = city.sunset - city.sunrise;
	// placeSun(city.sunrise);







	