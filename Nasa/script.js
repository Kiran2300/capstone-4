// Global variables
const favoritesKey = 'apodFavorites';

// DOM elements
const dateForm = document.getElementById('date-form');
const calendarDateInput = document.getElementById('calendar-date');
const apodContainer = document.getElementById('apod-container');
const favoritesContainer = document.getElementById('favorites-container');
const latestApodContainer = document.getElementById('latest-apod');

// Event listener for form submission
dateForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const selectedDate = calendarDateInput.value;
    fetchAPOD(selectedDate);
});

// Function to fetch APOD data
function fetchAPOD(date) {
    const apiKey = 'PeLxh0Gwa6nQebs095syzt4bkueRiusf4NI38YgO'; // Replace with your NASA APOD API key
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayAPOD(data);
        })
        .catch(error => {
            console.error('Error fetching APOD:', error);
        });
}

// Function to display APOD data
function displayAPOD(apodData) {
    // Clear previous content
    apodContainer.innerHTML = '';

    // Create elements to display APOD
    const apodImage = document.createElement('img');
    apodImage.src = apodData.url;
    apodImage.alt = apodData.title;
    apodImage.classList.add('apod-image');
    apodImage.addEventListener('click', function() {
        window.open(apodData.hdurl, '_blank');
    });

    const apodTitle = document.createElement('h2');
    apodTitle.textContent = apodData.title;

    const apodDate = document.createElement('p');
    apodDate.textContent = `Date: ${apodData.date}`;

    const apodExplanation = document.createElement('p');
    apodExplanation.textContent = apodData.explanation;

    const addToFavoritesButton = document.createElement('button');
    addToFavoritesButton.textContent = 'Add to Favorites';
    addToFavoritesButton.addEventListener('click', function() {
        addToFavorites(apodData);
    });

    // Append elements to container
    apodContainer.appendChild(apodImage);
    apodContainer.appendChild(apodTitle);
    apodContainer.appendChild(apodDate);
    apodContainer.appendChild(apodExplanation);
    apodContainer.appendChild(addToFavoritesButton);
}

// Function to add APOD to favorites
function addToFavorites(apodData) {
    let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

    // Check if APOD is already in favorites
    const isAlreadyFavorite = favorites.some(item => item.date === apodData.date);

    if (!isAlreadyFavorite) {
        favorites.push(apodData);
        localStorage.setItem(favoritesKey, JSON.stringify(favorites));
        alert('Added to Favorites!');
    } else {
        alert('This picture is already in Favorites!');
    }
}

// Function to display favorites
function displayFavorites() {
    favoritesContainer.innerHTML = '';

    let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

    if (favorites.length === 0) {
        const noFavoritesMessage = document.createElement('p');
        noFavoritesMessage.textContent = 'No favorites saved yet.';
        favoritesContainer.appendChild(noFavoritesMessage);
    } else {
        favorites.forEach(apod => {
            const favoriteCard = document.createElement('div');
            favoriteCard.classList.add('favorite-card');

            const apodImage = document.createElement('img');
            apodImage.src = apod.url;
            apodImage.alt = apod.title;
            apodImage.classList.add('favorite-image');
            apodImage.addEventListener('click', function() {
                window.open(apod.hdurl, '_blank');
            });

            const apodTitle = document.createElement('h3');
            apodTitle.textContent = apod.title;

            const apodDate = document.createElement('p');
            apodDate.textContent = `Date: ${apod.date}`;

            const removeFromFavoritesButton = document.createElement('button');
            removeFromFavoritesButton.textContent = 'Remove from Favorites';
            removeFromFavoritesButton.addEventListener('click', function() {
                removeFromFavorites(apod.date);
            });

            favoriteCard.appendChild(apodImage);
            favoriteCard.appendChild(apodTitle);
            favoriteCard.appendChild(apodDate);
            favoriteCard.appendChild(removeFromFavoritesButton);

            favoritesContainer.appendChild(favoriteCard);
        });
    }
}

// Function to remove APOD from favorites
function removeFromFavorites(date) {
    let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

    favorites = favorites.filter(apod => apod.date !== date);

    localStorage.setItem(favoritesKey, JSON.stringify(favorites));

    displayFavorites();
}

// Function to fetch the latest APOD and display it separately
function fetchLatestAPOD() {
    const apiKey = 'PeLxh0Gwa6nQebs095syzt4bkueRiusf4NI38YgO'; // Replace with your NASA APOD API key
    const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayLatestAPOD(data);
        })
        .catch(error => {
            console.error('Error fetching latest APOD:', error);
        });
}

// Function to display latest APOD
function displayLatestAPOD(apodData) {
    latestApodContainer.innerHTML = '';

    const apodImage = document.createElement('img');
    apodImage.src = apodData.url;
    apodImage.alt = apodData.title;
    apodImage.classList.add('latest-apod-image');
    apodImage.addEventListener('click', function() {
        window.open(apodData.hdurl, '_blank');
    });

    const apodTitle = document.createElement('h2');
    apodTitle.textContent = apodData.title;

    const apodDate = document.createElement('p');
    apodDate.textContent = `Date: ${apodData.date}`;

    const apodExplanation = document.createElement('p');
    apodExplanation.textContent = apodData.explanation;

    latestApodContainer.appendChild(apodImage);
    latestApodContainer.appendChild(apodTitle);
    latestApodContainer.appendChild(apodDate);
    latestApodContainer.appendChild(apodExplanation);
}

// Initialize page based on current URL
function initializePage() {
    const path = window.location.pathname;

    if (path.endsWith('index.html')) {
        // Home page initialization
        fetchLatestAPOD(); // Fetch and display latest APOD
        displayFavorites(); // Display favorites on the home page
    } else if (path.endsWith('favorites.html')) {
        // Favorites page
        initFavoritesPage();
    } else if (path.endsWith('about.html')) {
        // About page
        // You can add specific about page initialization here if needed
    } else if (path.endsWith('contact.html')) {
        // Contact page
        // You can add specific contact page initialization here if needed
    }
}

// Call initializePage when DOM content is loaded
document.addEventListener('DOMContentLoaded', initializePage);
