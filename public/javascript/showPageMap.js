
mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11', 
center: campground.geometry.coordinates,
zoom: 10 
});
map.addControl(new mapboxgl.NavigationControl());

map.addControl(
    new mapboxgl.GeolocateControl({
    positionOptions: {
    enableHighAccuracy: true
    },
    trackUserLocation: true
    })
    );
    
new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:30})
    .setHTML(
        `<h6>${campground.title}</h6>
        <P>${campground.location}</p>`
    )
)
.addTo(map)