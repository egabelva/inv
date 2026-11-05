/* Karakter animasi pojok kanan atas: tiap slide memainkan gerakan berbeda.
   Dipanggil oleh js/app.js setiap pindah slide: window.charaPose(indeksSlide). */
(function () {
  "use strict";
  var el = document.getElementById("chara");
  var POSES = 10;
  window.charaPose = function (i) {
    if (!el) return;
    for (var k = 0; k < POSES; k++) el.classList.remove("p" + k);
    void el.offsetWidth; /* mulai ulang animasi */
    el.classList.add("p" + (i % POSES));
    /* slide 1–2 punya elemen yang dekat pojok kanan atas: karakter dikecilkan agar tidak menimpa */
    el.classList.toggle("is-small", i < 2);
  };
})();
