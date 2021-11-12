const package = require('../package.json');
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd;
}
if (mm < 10) {
    mm = '0' + mm;
}
var today = dd + '/' + mm + '/' + yyyy;

exports.banner = `@license :${package.name} - V${package.version} - ${today}
https://github.com/maticnetwork/maticjs-plasma
Copyright (c) ${yyyy} @polygon; Licensed ${package.license}`;
