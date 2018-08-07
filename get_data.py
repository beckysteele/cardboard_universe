# Licensed under a 3-clause BSD style license - see LICENSE.rst

import numpy as np

from astropy.table import Table, unique
from astroquery.nasa_exoplanet_archive import NasaExoplanetArchive


exo = NasaExoplanetArchive.get_confirmed_planets_table(all_columns=True)

# We don't need the planets for this project that don't have a Gaia parallax,
# nor the ones without a radius.

to_remove_idx = np.where(np.logical_or(exo['st_dist'] == 0, exo['pl_radj'] == 0))[0]

exo.remove_rows(to_remove_idx)


# We currently can't yet unique a Table that has mixins, but we don't need the
# mixins here anyway, so copy what we need to a new table

exo_hosts = unique(Table(exo['pl_hostname', 'ra', 'dec', 'st_dist', 'st_teff']))

exoplanets = Table(exo['pl_hostname', 'pl_name', 'pl_orbper',
                       'pl_radj', 'pl_orbsmax', 'pl_orbeccen'])

# Saving the jsons, currently as an ugly hack

exo_hosts.to_pandas().to_json('data/exoplanet_hosts.json')
exoplanets.to_pandas().to_json('data/exoplanets.json')
