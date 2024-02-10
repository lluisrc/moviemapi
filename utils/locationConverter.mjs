export const locationConverter = (location) => {
    let gallery = [];
    for(let i = 1; i <= 5; i++){
        if(`frames_frame${i}` in location && location[`frames_frame${i}`]) gallery.push(location[`frames_frame${i}`])
    }
    let sponsors = [];
    for(let i = 1; i <= 3; i++){
        if(`sponsors${i}_id` in location && location[`sponsors${i}_id`] && location[`sponsors${i}_id`] !== 3) sponsors.push({href: location[`sponsors${i}_url`], logo: location[`sponsors${i}_img`], alt: 'Sponsor logo'})
    }
    let links = [{href: `https://www.imdb.com/title/${location.files_imdb}/`, logo: 'imdb.png', alt: 'IMDb logo'}, {href: `https://www.justwatch.com/es/${location.files_filmserie === "film" ? "pelicula" : "serie"}/${location.files_wheretowatchurl}/`, logo: 'justWatch.png', alt: 'JustWatch logo'}];

    return {
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
        gallery: gallery,
        sponsors: sponsors,
        links: links,
    };
}

export const locationsConverter = (locations) => {
    return Array.from(locations.map(location => { return locationConverter(location)}));
}
