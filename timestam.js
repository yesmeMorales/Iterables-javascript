function* timestampGenerator() {
  //console.log(Date.now());
  //podemos pausar con yield
  var ts = Date.now();
  console.log("original ts: ", ts);
  var additionalTime = yield;
  console.log("additionalTime: ", additionalTime);

  //yield;
  console.log(additionalTime);
  if (additionalTime) {
    ts = ts + additionalTime;
  }
  console.log("update ts: ", ts);
}

const it = timestampGenerator();
//it.next();

//La funcion es iterable con el for si se le quita el * ya no
// for (const val of it) {
//   console.log(val);
// }

it.next();
it.next(1000 * 60);
