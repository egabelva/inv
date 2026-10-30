/* ==========================================================
   Website Presentasi Invention — SMA Gunung Madu
   - skala kanvas 1920 × 1080
   - navigasi slide (panah, tombol, Home/End, hash URL)
   - layar penuh (F), tema terang/gelap, matikan animasi
   - latar motif daun, biji kopi, dan sulur (acak tetap per slide)
   - grafik batang SVG dari data Tabel 6–8 laporan
   ========================================================== */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var html = document.documentElement;
  var stage = document.getElementById("stage");
  var slides = [].slice.call(document.querySelectorAll(".slide"));
  var TOTAL = slides.length;
  var cur = -1;

  var btnPrev = document.getElementById("btn-prev");
  var btnNext = document.getElementById("btn-next");
  var btnFull = document.getElementById("btn-full");
  var btnTheme = document.getElementById("btn-theme");
  var btnAnim = document.getElementById("btn-anim");
  var pgCur = document.getElementById("pg-cur");
  var pgTot = document.getElementById("pg-tot");
  var edgeEl = document.getElementById("edge");

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function save(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* abaikan */ } }

  /* ---------- Skala kanvas ---------- */
  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = "translate(-50%, -50%) scale(" + s + ")";
  }

  /* ---------- Pembangkit acak (tetap per slide) ---------- */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function el(name, attrs) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) { if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]); }
    return e;
  }
  function smooth(pts) {
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += " C" + c1x.toFixed(1) + " " + c1y.toFixed(1) + " " + c2x.toFixed(1) + " " + c2y.toFixed(1) +
           " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d;
  }

  /* Sulur merambat di tepi layar */
  function addVine(svg, r, baseX, startY, dir, length) {
    var g = el("g", { "class": "vine-wrap" });
    var step = 64;
    var n = Math.max(4, Math.floor(length / step));
    var amp = 14 + r() * 16, freq = 0.7 + r() * 0.6, ph = r() * 6.28;
    var pts = [];
    for (var i = 0; i <= n; i++) {
      pts.push([baseX + Math.sin(i * freq + ph) * amp + (r() - 0.5) * 8, startY + dir * i * step]);
    }
    g.appendChild(el("path", { "class": "vine", d: smooth(pts), pathLength: "1" }));
    for (var j = 1; j <= n; j++) {
      var a = pts[j - 1], b = pts[j];
      var ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
      var side = j % 2 ? 1 : -1;
      var size = 40 + r() * 26;
      var rot = ang + side * (38 + r() * 24);
      var wrap = el("g", { transform: "translate(" + b[0].toFixed(1) + " " + b[1].toFixed(1) + ") rotate(" + rot.toFixed(1) + ")" });
      var u = el("use", {
        href: "#leaf", "class": "vine-leaf",
        x: (-size * 0.04).toFixed(1), y: (-size / 2).toFixed(1), width: size.toFixed(1), height: size.toFixed(1),
        style: "--ld:" + (0.25 + 1.5 * Math.pow(j / n, 0.8)).toFixed(2) + "s"
      });
      wrap.appendChild(u);
      g.appendChild(wrap);
    }
    svg.appendChild(g);
  }

  function buildBackground(slide, idx) {
    var r = rng(idx * 7919 + 101);
    var svg = el("svg", { "class": "bg", viewBox: "0 0 1920 1080", preserveAspectRatio: "none", "aria-hidden": "true", focusable: "false" });

    /* sebaran daun dan biji kopi di tepi (buram tipis, tidak menimpa teks) */
    var motif = el("g", { "class": "motif" });
    var count = 16 + Math.floor(r() * 7);
    for (var i = 0; i < count; i++) {
      var roll = r(), x, y;
      if (roll < 0.4)      { x = 22 + r() * 96;      y = 30 + r() * 1020; }
      else if (roll < 0.8) { x = 1802 + r() * 96;    y = 30 + r() * 1020; }
      else                 { x = 220 + r() * 1480;   y = 14 + r() * 50; }
      var size = 26 + r() * 32;
      var type = r() < 0.52 ? "leaf" : "bean";
      var use = el("use", {
        href: "#" + type, x: (-size / 2).toFixed(1), y: (-size / 2).toFixed(1), width: size.toFixed(1), height: size.toFixed(1),
        transform: "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + (r() * 360).toFixed(0) + ")",
        "class": (type === "leaf" ? "leaf-use" : "bean-use") + " motif-item",
        style: "--md:" + (r() * 0.35).toFixed(2) + "s"
      });
      motif.appendChild(use);
    }
    svg.appendChild(motif);

    /* sulur: sisi dan arah berbeda per slide */
    var cfg = idx % 4;
    var len1 = 420 + r() * 380;
    if (cfg === 0) addVine(svg, r, 62, 1096, -1, len1);
    if (cfg === 1) addVine(svg, r, 1858, 1096, -1, len1);
    if (cfg === 2) addVine(svg, r, 1858, -16, 1, len1);
    if (cfg === 3) addVine(svg, r, 62, -16, 1, len1);
    if (idx % 2 === 0) {
      var len2 = 240 + r() * 220;
      if (cfg === 0) addVine(svg, r, 1858, -16, 1, len2);
      if (cfg === 1) addVine(svg, r, 62, -16, 1, len2);
      if (cfg === 2) addVine(svg, r, 62, 1096, -1, len2);
      if (cfg === 3) addVine(svg, r, 1858, 1096, -1, len2);
    }
    slide.insertBefore(svg, slide.firstChild);
  }

  function buildFooter(slide) {
    var f = document.createElement("div");
    f.className = "foot";
    f.innerHTML =
      '<span class="logo-tile"><img src="assets/img/logo-sma-gunung-madu.jpg" alt="Logo SMA Gunung Madu"></span>' +
      "<span>Sidang Invention · SMA Gunung Madu</span>";
    slide.appendChild(f);
  }

  /* ---------- Grafik batang (Gambar 7) ---------- */
  function buildChart() {
    var host = document.getElementById("chart");
    if (!host) return;
    var cats = ["Aroma", "Warna", "Rasa"];
    var series = [
      { n: "24 jam", v: [3.4, 3.44, 3.44] },
      { n: "48 jam", v: [3.12, 3.52, 3.48] },
      { n: "72 jam", v: [3.4, 3.2, 3.52] }
    ];
    function fmt(v) { return String(v.toFixed(2)).replace(".", ","); }
    var W = 740, H = 600, x0 = 72, x1 = 730, yTop = 96, yBase = 500;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", preserveAspectRatio: "xMidYMid meet",
      "aria-label": "Grafik batang rata-rata nilai aroma, warna, dan rasa pada fermentasi 24, 48, dan 72 jam" });
    function Y(v) { return yBase - (v / 5) * (yBase - yTop); }

    for (var t = 0; t <= 5; t++) {
      svg.appendChild(el("line", { "class": t === 0 ? "axis" : "grid", x1: x0, x2: x1, y1: Y(t), y2: Y(t) }));
      var lab = el("text", { x: x0 - 12, y: Y(t) + 7, "text-anchor": "end" });
      lab.textContent = String(t);
      svg.appendChild(lab);
    }
    var yt = el("text", { x: 18, y: (yTop + yBase) / 2, "text-anchor": "middle", transform: "rotate(-90 18 " + ((yTop + yBase) / 2) + ")" });
    yt.textContent = "Rata-rata nilai (skala 1–5)";
    yt.setAttribute("style", "font-size:19px");
    svg.appendChild(yt);

    var gw = (x1 - x0) / cats.length, bw = 58, gap = 10;
    var total = bw * 3 + gap * 2;
    cats.forEach(function (c, gi) {
      var gx = x0 + gi * gw + (gw - total) / 2;
      series.forEach(function (s, si) {
        var v = s.v[gi], bx = gx + si * (bw + gap), by = Y(v);
        var d = (0.35 + gi * 0.28 + si * 0.14).toFixed(2);
        svg.appendChild(el("rect", { "class": "bar s" + si, x: bx, y: by, width: bw, height: yBase - by, rx: 3, style: "--bd:" + d + "s" }));
        var tv = el("text", { "class": "bar-val", x: bx + bw / 2, y: by - 10, "text-anchor": "middle", style: "--vd:" + (parseFloat(d) + 0.85).toFixed(2) + "s" });
        tv.textContent = fmt(v);
        svg.appendChild(tv);
      });
      var ct = el("text", { "class": "cat", x: x0 + gi * gw + gw / 2, y: yBase + 50, "text-anchor": "middle" });
      ct.textContent = c;
      svg.appendChild(ct);
    });

    /* legenda: lama fermentasi */
    var lx = x0;
    series.forEach(function (s, si) {
      svg.appendChild(el("rect", { "class": "s" + si, x: lx, y: 26, width: 28, height: 28, rx: 3 }));
      var lt = el("text", { "class": "lg", x: lx + 38, y: 50 });
      lt.textContent = s.n;
      svg.appendChild(lt);
      lx += 200;
    });
    host.appendChild(svg);
  }

  /* ---------- Indeks urutan gerak per slide ---------- */
  function assignOrder(slide) {
    var n = 0;
    [].forEach.call(slide.querySelectorAll(".g, .gf, .reveal, .draw-x, .draw-y"), function (e) {
      if (e.closest(".head") || e.closest(".foot")) return; /* judul dan footer tidak beranimasi */
      if (!e.style.getPropertyValue("--i")) e.style.setProperty("--i", n);
      n++;
    });
  }

  /* ---------- Navigasi ---------- */
  var edgeTimer = null;
  function showEdge(msg) {
    edgeEl.textContent = msg;
    edgeEl.classList.add("show");
    clearTimeout(edgeTimer);
    edgeTimer = setTimeout(function () { edgeEl.classList.remove("show"); }, 1300);
  }

  function go(i) {
    i = Math.max(0, Math.min(TOTAL - 1, i));
    if (i === cur) return;
    var prev = cur;
    cur = i;
    slides.forEach(function (s, k) {
      if (k === i) {
        s.classList.remove("is-leaving", "is-active");
        void s.offsetWidth; /* ulang animasi masuk */
        s.classList.add("is-active");
        s.removeAttribute("inert");
        s.setAttribute("aria-hidden", "false");
      } else {
        if (k === prev) {
          s.classList.remove("is-active");
          s.classList.add("is-leaving");
          (function (node) { setTimeout(function () { if (!node.classList.contains("is-active")) node.classList.remove("is-leaving"); }, 520); })(s);
        } else {
          s.classList.remove("is-active", "is-leaving");
        }
        s.setAttribute("inert", "");
        s.setAttribute("aria-hidden", "true");
      }
    });
    pgCur.textContent = pad(i + 1);
    btnPrev.disabled = i === 0;
    btnNext.disabled = i === TOTAL - 1;
    try { history.replaceState(null, "", "#/" + (i + 1)); } catch (e) { /* abaikan */ }
    document.title = (i + 1) + "/" + TOTAL + " · " + slides[i].getAttribute("aria-label").replace(/^Slide \d+:\s*/, "") + " · Sidang Invention";
  }
  function next() { if (cur >= TOTAL - 1) { showEdge("Slide terakhir"); return; } go(cur + 1); }
  function prev() { if (cur <= 0) { showEdge("Slide pertama"); return; } go(cur - 1); }

  btnNext.addEventListener("click", next);
  btnPrev.addEventListener("click", prev);

  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    switch (e.key) {
      case "ArrowRight": case "PageDown": e.preventDefault(); next(); break;
      case "ArrowLeft": case "PageUp": e.preventDefault(); prev(); break;
      case "Home": e.preventDefault(); go(0); break;
      case "End": e.preventDefault(); go(TOTAL - 1); break;
      case "f": case "F": toggleFull(); break;
      default: break;
    }
  });

  window.addEventListener("hashchange", function () {
    var m = /^#\/?(\d+)/.exec(location.hash);
    if (m) go(parseInt(m[1], 10) - 1);
  });

  /* ---------- Layar penuh ---------- */
  var fsOK = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
  function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement; }
  function toggleFull() {
    if (!fsOK) return;
    var p;
    if (fsElement()) {
      p = (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else {
      var root = document.documentElement;
      p = (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
    }
    if (p && p.catch) p.catch(function () { /* ditolak browser: abaikan */ });
  }
  function syncFull() {
    var on = !!fsElement();
    btnFull.setAttribute("aria-pressed", on ? "true" : "false");
    btnFull.setAttribute("aria-label", on ? "Keluar dari layar penuh" : "Layar penuh");
    fit();
  }
  if (!fsOK) btnFull.hidden = true;
  btnFull.addEventListener("click", toggleFull);
  document.addEventListener("fullscreenchange", syncFull);
  document.addEventListener("webkitfullscreenchange", syncFull);

  /* ---------- Tema ---------- */
  function syncTheme() {
    var dark = html.getAttribute("data-theme") !== "light";
    btnTheme.setAttribute("aria-label", dark ? "Ganti ke tema terang" : "Ganti ke tema gelap");
    btnTheme.setAttribute("aria-pressed", dark ? "false" : "true");
  }
  btnTheme.addEventListener("click", function () {
    var next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
    save("inv-theme", next);
    syncTheme();
  });

  /* ---------- Animasi ---------- */
  function syncAnim() {
    var off = html.classList.contains("no-anim");
    btnAnim.setAttribute("aria-label", off ? "Nyalakan animasi" : "Matikan animasi");
    btnAnim.setAttribute("aria-pressed", off ? "true" : "false");
  }
  btnAnim.addEventListener("click", function () {
    var off = html.classList.toggle("no-anim");
    if (off) { html.classList.remove("force-anim"); save("inv-anim", "off"); }
    else { html.classList.add("force-anim"); save("inv-anim", "on"); }
    syncAnim();
    if (!off && cur >= 0) { var c = cur; cur = -1; go(c); } /* putar ulang slide aktif */
  });

  /* ---------- Inisialisasi ---------- */
  slides.forEach(function (s, i) {
    s.setAttribute("aria-label", "Slide " + (i + 1) + ": " + s.getAttribute("aria-label").replace(/^Slide \d+:\s*/, ""));
    buildBackground(s, i + 1);
    if (s.hasAttribute("data-foot")) buildFooter(s);
    assignOrder(s);
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("inert", "");
  });
  buildChart();
  pgTot.textContent = pad(TOTAL);
  fit();
  window.addEventListener("resize", fit);
  syncTheme();
  syncAnim();
  syncFull();
  var m = /^#\/?(\d+)/.exec(location.hash);
  go(m ? parseInt(m[1], 10) - 1 : 0);
})();
