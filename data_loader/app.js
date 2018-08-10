/*************************************************************************************
This section opens, parses, and stores the data in exoplanets.json as exoplanet_data
**************************************************************************************/

var ajax = new XMLHttpRequest();

ajax.open("GET","data_loader/exoplanets.json",false);
ajax.send();

var exoplanet_data = JSON.parse(ajax.responseText);
var exoplanet_count = Object.keys(exoplanet_data.pl_name).length;

// Uncomment the line below and insert it into a loop to see how you'd turn falsey values to 0's
// var planet_eccentricity = exoplanet_data.pl_orbeccen[i] || 0;

// Uncomment the line below to see how to access objects in the var exoplanet_data
// console.log(exoplanet_data.pl_hostname[0]);

/************************************************************************************************
This section opens, parses, and stores the data in exoplanet_hosts.json as exoplanet_host_data
*************************************************************************************************/

ajax = new XMLHttpRequest();

ajax.open("GET","data_loader/exoplanet_hosts.json",false);
ajax.send();

var exoplanet_host_data = JSON.parse(ajax.responseText);
var exoplanet_host_count = Object.keys(exoplanet_host_data.pl_hostname).length;

// Uncomment the line below to see how to access objects in the var exoplanet_host_data
console.log(exoplanet_host_data.pl_hostname[0]);

/************************************************************************************************
This section opens, parses, and converts the data in temperatures.json into an array of
rgb() values accessible by passing in degrees Kelvin
*************************************************************************************************/

ajax = new XMLHttpRequest();

ajax.open("GET","data_loader/temperatures.json",false);
ajax.send();

var host_star_rgb = JSON.parse(ajax.responseText);
var temps_count = Object.keys(host_star_rgb.kelvin_value).length;

// Loop through the host_star_rbg list, construct r,g,b, values into str format, and push those
// into an array accessible by passing in the degrees Kelvin value
var kelvin_color = [];
for(var i = 0; i < temps_count; i++) {
    var red_color = host_star_rgb.kelvin_value[i].R;
    var green_color = host_star_rgb.kelvin_value[i].G;
    var blue_color = host_star_rgb.kelvin_value[i].B;
    var str_constructor = "rgb(" + red_color + ", " + green_color + ", " + blue_color + ")";
    kelvin_color.push(str_constructor);
}

// Uncomment to see how to access the rgb() value of 10000 degrees Kelvin in the array kelvin_color
console.log(kelvin_color[10000]);
