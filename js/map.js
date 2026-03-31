document.getElementById('find-map-btn').addEventListener('click', () => {
    const address = document.getElementById('user-address').value;
    const material = document.getElementById('material-type').innerText;
    
    if(!address) return alert("Please enter your address!");

    const service = new google.maps.places.PlacesService(document.createElement('div'));
    const request = {
        query: `${material} recycling center near ${address}`,
        fields: ['name', 'formatted_address']
    };

    service.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const list = document.getElementById('map-list');
            list.innerHTML = results.slice(0, 5).map(place => `
                <li><strong>${place.name}</strong><br>${place.formatted_address}</li>
            `).join('');
        }
    });
});
