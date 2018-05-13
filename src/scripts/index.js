import '../css/index.css';
import '../scss/index.scss';
import $ from './lib/jquery-1.11.3.min';

document.write(process.env.NODE_ENV);
var a = 111;
var b = 222;
var xxx = function xxx(c, d) {
  return c * d;
};
console.log(xxx(a, b));
