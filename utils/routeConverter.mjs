export const routeConverter = (route) => {
    return {
        id: route.locationslist_id,
        title: route.locationslist_name,
        routeLength: route.total_locations,
    };
}

export const routesConverter = (routes) => {
    return Array.from(routes.map(route => { return routeConverter(route)}));
}