// Make map a global variable because it doesn't like it if it isn't
var map;

// Function to initialize the map after the HTML is loaded
function initMap() {
  // Check if geolocation is supported in the browser
  if (navigator.geolocation) {
   
   
    // Get the user's current position
    navigator.geolocation.getCurrentPosition(
      function (position) {
        
        
        // User's location coordinates
        var userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        console.log('User location:', userLocation);

        // Center the map at the user's location
        map = new google.maps.Map(document.getElementById('map'), {
          center: userLocation,
          zoom: 12
        });

        // Create a marker for the user's location
        new google.maps.Marker({
          position: userLocation,
          map: map,
          title: 'Your Location',
          icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png'
        });

       
        // Use geocoding to get the city name based on the user's location
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: userLocation }, function (results, status) {
          if (status === 'OK' && results[0]) {
            var cityName = results[0].address_components[2].long_name;
            console.log('City Name: ' + cityName);
          } else {
            console.error('Unable to geocode location');
          }
        });

        
        // Search for Dog parks around user's location within 10 miles
        var request = {
          location: userLocation,
          radius: 16093.4,
          keyword: 'Dog Park'
        };

        // Use Google Maps API PlacesService to search for nearby places
        var placesService = new google.maps.places.PlacesService(map);
        placesService.nearbySearch(request, function (results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            
            
            // Loop through to create multiple markers
            for (var i = 0; i < results.length; i++) {
              createMarker(results[i]);
            }
          } else {
            console.error('Error fetching nearby places:', status);
          }
        });
      },
      function (error) {
        console.error('Error getting user location:', error.message);
      }
    );
  }
}

// Function to create a marker for a given place
function createMarker(place) {

  // Create a marker for the places
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name
  });

  // Create an info window for the marker to show more details
  var infowindow = new google.maps.InfoWindow();

  // Add a click listener to the marker to show the info window
  marker.addListener('click', function () {
    
    
    // Set the content of the infowindow
    infowindow.setContent('<div><strong>' + place.name + '</strong></div>');
    
    // Open the infowindow on the map
    infowindow.open(map, marker);
  });
}
