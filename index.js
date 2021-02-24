var numeric = require('numeric');

/*
.deepai
.fastai
.DAIN
.cain
.pytorch
.stack
.ffmpeg
.minterpolation=mc=mode
.R-GAN-I
*/



// Interpolation Types for RGANI
var distanceFunctions = {
  'linear': distanceLinear,
  'cubic':  distanceCubic,
  'quintic': distanceQuintic,
  'thin-plate': distanceThinPlate,
  'gaussian': distanceGaussian,
  'inverse-multiquadric': distanceInverseMultiquadric,
  'multiquadric': distanceMultiquadric
};




function RGANI(points, values, distanceFunction, epsilon) {

  var distance = distanceFunctions.linear;

  if(distanceFunction) {
    distance = typeof distanceFunction !== 'string'
      ? distanceFunction
      : distanceFunctions[distanceFunction];
  }



  // Kullanıcı Kimliğini Ayırmak kısa bir fonksiyon.
  var M = numeric.identity(points.length);



  // Önce 2 nokta arası (RGB) matrisini hesaplayın.
  // Değer sağlanamadıysa devam için izin komutu.
  for(var j=0; j<points.length; j++) {
    for(var i=0; i<points.length; i++) {
      M[j][i] = norm(points[i], points[j]);
    }
  }





  // Noktalar arasındaki ortalama mesafeyi hesaplayın. (Tercih?)
  if(epsilon === undefined) {
    epsilon = numeric.sum(M) / (Math.pow(points.length, 2) - points.length);
  }



  // Fonksiyonu mesafa aralığına göre düzenleyin.
  for(var j=0; j<points.length; j++) {
    for(var i=0; i<points.length; i++) {
      M[j][i] = distance(M[j][i], epsilon);
    }
  }



  // Hedef değerlerin sanal boyutlarını hesaplar.
  var sample = values[0];
  var D = typeof sample === 'number'
    ? 1
    : sample.length;




  // Vektör değerini oluşturur.
  if(D === 1) {
    values = values.map(function(value) {
      return [value];
    });
  }




  // Girilen değerleri fonksiyona göre yeniden düzenler.
  var tmp = new Array(D);
  for(var i=0; i<D; i++) {
    tmp[i] = values.map(function(value) {
      return value[i];
    });
  }
  values = tmp;




  // Temel, başlangıç fonksiyonların ağırlıkları (RGB - YUV - SRGB) hesaplayın.
  // Tüm seçilen komutlar için linear ınterpolaion sistemi
  var w = new Array(D);
  var LU = numeric.LU(M);
  for(var i=0; i<D; i++) {
    w[i] = numeric.LUsolve(LU, values[i]);
  }





  // Interp değerini rastgele noktada toplar. 
  function interpolant(p) {

    var distances = new Array(points.length);
    for(var i=0; i<points.length; i++) {
      distances[i] = distance(norm(p, points[i]), epsilon);
    }





    var sums = new Array(D);
    for(var i=0; i<D; i++) {
      sums[i] = numeric.sum(numeric.mul(distances, w[i]));
    }

    return sums;
  }

  return interpolant;
}






function norm(pa, pb) {
  return numeric.norm2(numeric.sub(pb, pa));
}

function distanceLinear(r) {
  return r;
}

function distanceCubic(r) {
  return Math.pow(r, 3);
}

function distanceQuintic(r) {
  return Math.pow(r, 5);
}

function distanceThinPlate(r) {
  if(r === 0) return 0;
  return Math.pow(r, 2) * Math.log(r);
}

function distanceGaussian(r, epsilon) {
  return Math.exp(- Math.pow(r / epsilon, 2));
}

function distanceInverseMultiquadric(r, epsilon) {
  return 1.0 / Math.sqrt(Math.pow(r / epsilon, 2) + 1);
}

function distanceMultiquadric(r, epsilon) {
  return Math.sqrt(Math.pow(r / epsilon, 2) + 1);
}

module.exports = RGANI;
