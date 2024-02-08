export const locationsConverter = (locations) => {
    let convertedLocations = [];
    locations.map(location => {
        let gallery = []
        for(let i = 1; i <= 5; i++){
            if(`frames_frame${i}` in location && location[`frames_frame${i}`]) gallery.push(location[`frames_frame${i}`])
        }
        let sponsors = []
        for(let i = 1; i <= 5; i++){
            if(`frames_frame${i}` in location && location[`frames_frame${i}`]) sponsors.push(location[`frames_frame${i}`])
        }

        convertedLocations.push({
            id: location.frames_id,
            latitude: location.frames_latitude,
            longitude: location.frames_longitude,
            title: location.files_title,
            director: location.files_director,
            start: location.files_start,
            end: location.files_finish,
            producer: location.files_company,
            place: location.frames_place,
            town: location.towns_town,
            region: location.regions_region,
            state: location.states_state,
            gallery: gallery
        });
    });
    return convertedLocations;
}
