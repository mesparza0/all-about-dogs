let timer;
let deleteFirstPhotoDelay;

async function start() {
    try {
        const response = await fetch("https://dog.ceo/api/breeds/list/all");
        const data = await response.json();
        createBreedList(data.message);
    } catch (e) {
        console.log("There was a problem loading the breeds.");
    }
}

start();

function createBreedList(breedList) {
    document.getElementById("breed").innerHTML = `
        <select onchange="loadByBreed(this.value)">
            <option>Choose a dog breed</option>
            ${Object.keys(breedList).map(breed => `<option>${breed}</option>`).join('')}
        </select>
    `;
}

async function loadByBreed(breed) {
    if (breed !== "Choose a dog breed") {
        try {
            const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random/5`);
            const data = await response.json();
            createSlideshow(data.message);
        } catch (error) {
            console.log("Error loading images:", error);
        }
    }
}

function createSlideshow(images) {
    let currentPosition = 0;
    clearInterval(timer);
    clearTimeout(deleteFirstPhotoDelay);

    if (images.length > 1) {
        document.getElementById("slideshow").innerHTML = `
            <div class="slide" style="background-image: url('${images[0]}')"></div>
            <div class="slide" style="background-image: url('${images[1]}')"></div>
        `;

        currentPosition = 2;
        if (images.length === 2) currentPosition = 0;

        timer = setInterval(nextSlide, 3000);
    } else {
        document.getElementById("slideshow").innerHTML = `
            <div class="slide" style="background-image: url('${images[0]}')"></div>
            <div class="slide"></div>
        `;

        currentPosition = 1;
        timer = setInterval(nextSlide, 3000);
    }

    function nextSlide() {
        document.getElementById("slideshow").insertAdjacentHTML("beforeend", `
            <div class="slide" style="background-image: url('${images[currentPosition]}')"></div>
        `);

        deleteFirstPhotoDelay = setTimeout(function () {
            document.querySelector(".slide").remove();
        }, 1000);

        if (currentPosition + 1 >= images.length) {
            currentPosition = 0;
        } else {
            currentPosition++;
        }
    }
}
