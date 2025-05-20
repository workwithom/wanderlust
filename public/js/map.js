    const defaultCenter = [77.209, 28.6139]; // Default center (Delhi)
    
    // Set up the map instance
    const map = tt.map({
        container: 'map',
        key: mapTokenKey,
        center: listing.geometry ? listing.geometry.coordinates : defaultCenter,
        zoom: 12
    });

    // Add navigation controls
    map.addControl(new tt.NavigationControl());

    // If we have listing coordinates, add a marker
    if (listing.geometry && listing.geometry.coordinates) {
        const marker = new tt.Marker()
            .setLngLat(listing.geometry.coordinates)
            .addTo(map);

        // Add a popup
        const popup = new tt.Popup({ offset: 30 })
            .setLngLat(listing.geometry.coordinates)
            .setHTML(`
                <h6>${listing.title}</h6>
                <p>${listing.location}</p>
            `)
            .addTo(map);
    }

  map.addControl(new tt.NavigationControl());
