// Call the main function
init();

function init() {
    loadExoplanetData(function(response) {
        // Parse exoplanet data
        var exoplanet_data = JSON.parse(response);

        // Figure out how many there are
        var exoplanet_count = Object.keys(exoplanet_data.pl_name).length;

        // Loop through them and assign corresponding variables
        for(var i = 0; i < exoplanet_count; i++){
            var planet_name = exoplanet_data.pl_name[i];
            var planet_host_name = exoplanet_data.pl_hostname[i];
            var planet_orbper = exoplanet_data.pl_orbper[i];
            var planet_rad = exoplanet_data.pl_radj[i];
            var planet_orbsmax = exoplanet_data.pl_orbsmax[i];

            // Convert any "falsey" values (undefined, null, etc) to 0 if detected
            var planet_eccentricity = exoplanet_data.pl_orbeccen[i] || 0;
            
            // Uncomment the line below if you want to see an example use of these vars
            // console.log("Planet name: " + planet_name + ", Host star name: " + planet_host_name + ", Orbital period: " + planet_orbper + ", Radius: " + planet_rad + ", Orbital maximum: " + planet_orbsmax);
        }
    });

    loadHostStarData(function(response){
        // Parse Host Star data
        var host_star_data = JSON.parse(response);

        // Figure out how many there are
        var host_star_count = Object.keys(host_star_data.pl_hostname).length;

        // Loop through them and assign corresponding variables
        for(var i = 0; i < host_star_count; i++) {
            var host_star_name = host_star_data.pl_hostname[i];
            var host_star_ra = host_star_data.ra[i];
            var host_star_dec = host_star_data.dec[i];
            var host_star_dist = host_star_data.st_dist[i];
            var host_star_teff = host_star_data.st_teff[i];
            
            // Uncomment the line below if you want to see an example use of these vars
            // console.log("Host star name: " + host_star_name + ", ra: " + host_star_ra + ", dec: " + host_star_dec + ", distance (pc): " + host_star_dist + ", effective temperature (K): " + host_star_teff);
        }
        });

        loadHostStarTemps(function(response){
            // Parse temperature data
            var host_star_rgb = JSON.parse(response);
           
            // Figure out how many there are
            var temps_count = Object.keys(host_star_rgb.kelvin_value).length;

            // Loop through them and assign corresponding variables
            var kelvin_color = [];
            for(var i = 0; i < temps_count; i++) {
                var red_color = host_star_rgb.kelvin_value[i].R;
                var green_color = host_star_rgb.kelvin_value[i].G;
                var blue_color = host_star_rgb.kelvin_value[i].B;
                var str_constructor = "rgb(" + red_color + ", " + green_color + ", " + blue_color + ")";
                kelvin_color.push(str_constructor);
            }
            // Uncomment this line to see how you would pass a Kelvin value and get its rgb color back from the kelvin_color array
            // console.log(kelvin_color[11000]);
            });    
   }


function loadExoplanetData(callback) {   

    // This loads the JSON file by making an HTTP request by opening the file and sending the response back to the calling function
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'exoplanets.json', true); // exoplanet_hosts.json must exist at the same level as app.js in this example
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 function loadHostStarData(callback) {   

    // This loads the JSON file by making an HTTP request by opening the file and sending the response back to the calling function
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'exoplanet_hosts.json', true); // exoplanet_hosts.json must exist at the same level as app.js in this example
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 function loadHostStarTemps(callback) {   

    // This loads the JSON file by making an HTTP request by opening the file and sending the response back to the calling function
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', 'temperatures.json', true); // exoplanet_hosts.json must exist at the same level as app.js in this example
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }