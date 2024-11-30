let selectedCarRate = null;
let selectedCarName = null;

function selectCar(element) {
    // Deselect any previously selected car
    const carOptions = document.querySelectorAll(".car-option");
    carOptions.forEach(car => car.classList.remove("selected"));

    // Select the clicked car and store its rate
    element.classList.add("selected");
    selectedCarRate = parseInt(element.getAttribute("data-rate"));
    selectedCarName = element.getAttribute("data-car");
}

async function calculateFare() {
    // Get locations
    const startLocation = document.getElementById("start-location").value;
    const endLocation = document.getElementById("end-location").value;

    // Validate inputs
    if (!selectedCarRate || !startLocation || !endLocation) {
        alert("Please select a car and enter both locations.");
        return;
    }

    try {
        const distanceInKm = await getDistanceFromGoogleMaps(startLocation, endLocation);

        if (distanceInKm !== null) {
            const totalFare = distanceInKm * selectedCarRate;

            // Display the result
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = `
                <p>Car: ${selectedCarName}</p>
                <p>Distance: ${distanceInKm} km</p>
                <p>Total Fare: ₹${totalFare}</p>
            `;

            // Show UPI payment section
            const paymentSection = document.getElementById("payment-section");
            paymentSection.style.display = "block";
        }
    } catch (error) {
        console.error("Error fetching distance:", error);
        alert("Could not calculate distance. Please try again.");
    }
}

async function getDistanceFromGoogleMaps(origin, destination) {
    const apiKey = 'AIzaSyAf-qnt2wOq79CF-Y7eKvFfgt8BT5IvcLU';
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.rows[0].elements[0].status === "OK") {
        const distanceText = data.rows[0].elements[0].distance.text;
        return parseFloat(distanceText.replace(" km", ""));
    } else {
        return null;
    }
}
