# Licensed under a 3-clause BSD style license - see LICENSE.rst

import numpy as np

import astropy.units as u
from astropy.table import Column, Table, unique, vstack
from astroquery.nasa_exoplanet_archive import NasaExoplanetArchive


exo = NasaExoplanetArchive.get_confirmed_planets_table(all_columns=True)

# We don't need the planets for this project that don't have a distance,
# know radius or orbital period

planet_filter = np.logical_or.reduce((exo['st_dist'] == 0, exo['pl_radj'] == 0,
                                      exo['pl_orbper'] == 0))
to_remove_idx = np.where(planet_filter)[0]

exo.remove_rows(to_remove_idx)

# We currently can't yet unique a Table that has mixins, but we don't need the
# mixins here anyway, so copy what we need to a new table

hosts = unique(Table(exo['pl_hostname', 'ra', 'dec', 'st_dist', 'st_teff']))

exoplanets = Table(exo['pl_hostname', 'pl_name', 'pl_orbper',
                       'pl_radj', 'pl_orbsmax', 'pl_orbeccen'])

# Add the Solar System manually

hosts.add_row(['Sun', 0, 0, 0, 5777])

# Solar System data source: https://nssdc.gsfc.nasa.gov/planetary/factsheet/
# Order of the rows:
# planet name, diameter(km), aphelion(km), orbital period(days), orbital eccentricity

raw_solar_system = Table.read("""
MERCURY 	 VENUS 	 EARTH 	 MOON 	 MARS 	 JUPITER 	 SATURN 	 URANUS 	 NEPTUNE
4879	12104	12756	3475	6792	142984	120536	51118	49528
69.8	108.9	152.1	0.406	249.2	816.6	1514.5	3003.6	4545.7
88.0	224.7	365.2	27.3	687.0	4331	10747	30589	59800
0.205	0.007	0.017	0.055	0.094	0.049	0.057	0.046	0.011
""", format='ascii')

solar_system = Table()
solar_system['pl_orbper'] = Column([*raw_solar_system[2]])
solar_system['pl_orbeccen'] = Column([*raw_solar_system[3]])
solar_system['pl_radi'] = Column([*raw_solar_system[0]]) / 2 * u.km.to(u.R_jup)
solar_system['pl_name'] = Column([*raw_solar_system.colnames])
solar_system['pl_orbsmax'] = Column([*raw_solar_system[1]])
solar_system['pl_hostname'] = 'Sun'

planets = vstack([exoplanets, solar_system])

# Saving the jsons, currently as an ugly hack

hosts.to_pandas().to_json('data/exoplanet_hosts.json')
planets.to_pandas().to_json('data/exoplanets.json')
