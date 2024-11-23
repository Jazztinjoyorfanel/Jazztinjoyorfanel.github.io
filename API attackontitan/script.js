const searchTitan = async () => {
    const searchBar = document.getElementById("searchBar");
    const searchTerm = searchBar.value.toLowerCase().trim();
  
    const resultCard = document.getElementById("resultCard");
    const titanImage = document.getElementById("titanImage");
    const titanName = document.getElementById("titanName");
    const titanHeight = document.getElementById("titanHeight");
    const titanInheritor = document.getElementById("titanInheritor");
    const titanAllegiance = document.getElementById("titanAllegiance");
    const titanAbilities = document.getElementById("titanAbilities");
    const errorMessage = document.getElementById("errorMessage");
  
    // Reset previous error and results
    resultCard.classList.add("d-none");
    errorMessage.textContent = "";
  
    if (!searchTerm) {
        errorMessage.textContent = "Please enter a Titan name to search.";
        return;
    }
  
    try {
        const response = await fetch("https://api.attackontitanapi.com/titans");
        if (!response.ok) throw new Error(`Error: ${response.status}`);
  
        const data = await response.json();
        const titan = data.results.find(t => t.name.toLowerCase().includes(searchTerm));
  
        if (!titan) {
            errorMessage.textContent = "No Titan found with the provided name.";
            return;
        }
  
        // Update the result card with Titan data
        titanName.textContent = `Name: ${titan.name}`;
        titanHeight.textContent = `Height: ${titan.height}`;
        titanAllegiance.textContent = `Allegiance: ${Array.isArray(titan.allegiance) ? titan.allegiance.join(", ") : titan.allegiance}`;
        titanAbilities.textContent = `Abilities: ${Array.isArray(titan.abilities) ? titan.abilities.join(", ") : "N/A"}`;
  
        // Handle Titan Image
        const imageUrl = titan.img || "https://via.placeholder.com/300";
        console.log("Titan Image URL: ", imageUrl); // Debug image URL
        titanImage.src = imageUrl;
  
        // Handle image loading error
        titanImage.onerror = (event) => {
            console.error("Error loading image:", event, "using placeholder.");
            titanImage.src = "https://via.placeholder.com/300";  // Fallback image
        };
  
        // Fetch and display current inheritor's name
        if (titan.current_inheritor) {
            try {
                const inheritorResponse = await fetch(titan.current_inheritor);
                const inheritorData = await inheritorResponse.json();
                titanInheritor.textContent = `Current Inheritor: ${inheritorData.name || "Unknown"}`;
            } catch (error) {
                console.error("Error fetching inheritor data:", error);
                titanInheritor.textContent = "Current Inheritor: Unknown";
            }
        } else {
            titanInheritor.textContent = "Current Inheritor: Unknown";
        }
  
        // Show the result card
        resultCard.classList.remove("d-none");
    } catch (error) {
        console.error("Error fetching Titan data:", error);
        errorMessage.textContent = "Failed to fetch Titan information. Please try again later.";
    }
};
