RGANI
===
### Reverse GAN Interpolation

Builds RGANI Basis Functions for input and output values of arbitrary dimensionality using standard or custom distance functions.

Installation
------------

```bash
$ nope $!Note Yet
```

Usage
-----

```javascript
var RGANI = require('RGANI');

var points = [
  [0, 0],
  [0, 100]
];

// Girilen Değerler herhangi bir boyutun vektörleri olabilir.
var values = [
  0.0,
  1.0
]

// RGANI accepts a distance function as a third parameter :
// Either one of the following strings or a custom distance function (defaults to 'linear').
//
// - linear: r
// - cubic: r**3
// - quintic: r**5
// - thin-plate: r**2 * log(r)
// - gaussian: exp(-(r/epsilon) ** 2)
// - multiquadric: sqrt((r/epsilon) ** 2 + 1)
// - inverse-multiquadric: 1 / sqrt((r/epsilon) ** 2 + 1)
//
// Epsilon can be provided as a 4th parameter. Defaults to the average 
// Euclidean distance between points.
//
var RGANI = RGANI(points, values /*, distanceFunction, epsilon */);

console.log(RGANI([0, 50])); // => 0.5
```

Examples
--------

Partial derivative of a gaussian, original and interpolated with 25 random samples (linear distance function).

<img src="https://i.hizliresim.com/N1xdaV.png"/>

Lena, original and interpolated with 4000 random samples (about 6% of the original pixels, linear distance function).

<img src="https://hizliresim.com/YEJkbx.png"/>
<img src="https://hizliresim.com/N5xqUo.png"/>

