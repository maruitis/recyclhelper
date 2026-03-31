function findRecyclingPoints(userAddress) {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    
    // We search for "recycling" + the specific item material
    const material = document.getElementById('material-type').innerText;
    const request = {
        query: `${material} recycling center near ${userAddress}`,
        fields: ['name', 'formatted_address', 'geometry'],
    };

    service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const top5 = results.slice(0, 5);
            const listElement = document.getElementById('map-list');
            listElement.innerHTML = top5.map(place => 
                `<li><strong>${place.name}</strong><br>${place.formatted_address}</li>`
            ).join('');
        }
    });
}
