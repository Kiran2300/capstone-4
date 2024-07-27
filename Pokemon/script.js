document.addEventListener('DOMContentLoaded', () => {
    const pokemonGallery = document.getElementById('pokemon-gallery');
    const loadMoreButton = document.getElementById('load-more');
    const pokemonDetails = document.getElementById('pokemon-details');
    const closeDetailsButton = document.getElementById('close-details');
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonImage = document.getElementById('pokemon-image');
    const pokemonAbilities = document.getElementById('pokemon-abilities');
    const pokemonTypes = document.getElementById('pokemon-types');
    const catchReleaseButton = document.getElementById('catch-release');
    let offset = 0;
    const limit = 20;
    const maxPokemons = 100;  // Maximum number of Pokémon to load
    let caughtPokemonIds = [];

    // Function to fetch Pokémon data from the PokéAPI
    const fetchPokemon = async (offset, limit) => {
        if (offset >= maxPokemons) {
            loadMoreButton.style.display = 'none';  // Hide the "Load More" button if limit is reached
            return;
        }
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
            const data = await response.json();
            displayPokemon(data.results);
            offset += limit;
        } catch (error) {
            console.error('Error fetching Pokémon:', error);
        }
    };

    // Function to display Pokémon cards in the gallery
    const displayPokemon = (pokemonList) => {
        pokemonList.forEach(pokemon => {
            const pokemonCard = document.createElement('div');
            pokemonCard.className = 'pokemon-card';
            const pokemonId = parseUrl(pokemon.url);
            pokemonCard.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemon.name}">
                <p>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</p>
            `;
            pokemonCard.addEventListener('click', () => showPokemonDetails(pokemon, pokemonId));
            if (isCaught(pokemonId)) {
                pokemonCard.classList.add('caught');
            }
            pokemonGallery.appendChild(pokemonCard);
        });
        updatePokemonCards();
    };

    // Function to show Pokémon details in the modal
    const showPokemonDetails = async (pokemon, id) => {
        try {
            const response = await fetch(pokemon.url);
            const data = await response.json();
            pokemonName.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
            pokemonAbilities.textContent = `Abilities: ${data.abilities.map(ability => ability.ability.name).join(', ')}`;
            pokemonTypes.textContent = `Types: ${data.types.map(type => type.type.name).join(', ')}`;
            catchReleaseButton.textContent = isCaught(id) ? 'Release' : 'Catch';
            catchReleaseButton.onclick = () => toggleCatch(id);
            pokemonDetails.style.display = 'flex';
        } catch (error) {
            console.error('Error fetching Pokémon details:', error);
        }
    };

    // Function to close Pokémon details modal
    closeDetailsButton.addEventListener('click', () => {
        pokemonDetails.style.display = 'none';
    });

    // Function to handle catching or releasing Pokémon
    const toggleCatch = (id) => {
        if (isCaught(id)) {
            releasePokemon(id);
        } else {
            catchPokemon(id);
        }
        updatePokemonCards();
    };

    // Function to catch a Pokémon
    const catchPokemon = (id) => {
        caughtPokemonIds.push(id);
    };

    // Function to release a Pokémon
    const releasePokemon = (id) => {
        caughtPokemonIds = caughtPokemonIds.filter(pokemonId => pokemonId !== id);
    };

    // Function to check if a Pokémon is caught
    const isCaught = (id) => {
        return caughtPokemonIds.includes(id);
    };

    // Function to update Pokémon cards with catch status
    const updatePokemonCards = () => {
        const pokemonCards = document.querySelectorAll('.pokemon-card');
        pokemonCards.forEach(card => {
            const pokemonId = parseUrl(card.querySelector('img').src);
            if (isCaught(pokemonId)) {
                card.classList.add('caught');
            } else {
                card.classList.remove('caught');
            }
        });
    };

    // Function to parse Pokémon ID from URL
    const parseUrl = (url) => {
        const parts = url.split('/');
        return parts[parts.length - 2];
    };

    // Initial fetch to load Pokémon when the page loads
    fetchPokemon(offset, limit);

    // Event listener for "Load More" button click
    loadMoreButton.addEventListener('click', () => {
        fetchPokemon(offset, limit);
    });
});
