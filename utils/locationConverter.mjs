export const locationsConverter = (locations) => {
    let convertedLocations = [];
    locations.map(location => {
        let gallery = []
        for(let i = 1; i <= 5; i++){
            if(`frame${i}` in location && location[`frame${i}`]) gallery.push(location[`frame${i}`])
        }
        convertedLocations.push({
            latitude: location.latitud,
            longitude: location.longitud,
            title: location.title,
            director: location.director,
            start: location.start,
            end: location.end,
            producer: location.company,
            place: location.place,
            town: location.town,
            region: location.region,
            state: location.state,
            gallery: gallery
        });
    });
    return convertedLocations;
}
