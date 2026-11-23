(function () {
  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");

  function label(theme) {
    return theme === "dark" ? "Light" : "Dark";
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    if (toggle) {
      toggle.textContent = label(theme);
      toggle.setAttribute("aria-label", "Switch to " + label(theme).toLowerCase() + " theme");
    }
  }

  apply(root.getAttribute("data-theme") || "light");

  if (toggle) {
    toggle.addEventListener("click", function () {
      apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }

  var filters = document.querySelectorAll("[data-filter]");
  var entries = document.querySelectorAll("[data-cat]");
  var count = document.querySelector("[data-count]");

  function show(name) {
    var visible = 0;
    entries.forEach(function (entry) {
      var match = name === "all" || entry.getAttribute("data-cat") === name;
      entry.hidden = !match;
      if (match) visible += 1;
    });
    if (count) {
      count.textContent = visible + (visible === 1 ? " project" : " projects");
    }
    filters.forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-filter") === name ? "true" : "false");
    });
  }

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      show(button.getAttribute("data-filter"));
    });
  });

  var jumps = document.querySelector(".jumps");
  if (!jumps) return;

  var links = Array.prototype.slice.call(jumps.querySelectorAll("a[href^='#']"));
  var ids = links.map(function (link) {
    return link.getAttribute("href").slice(1);
  });

  function select(id) {
    if (ids.indexOf(id) === -1) id = "none";
    root.setAttribute("data-role", id);
    links.forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  function placeJumps() {
    var header = document.querySelector(".site-header");
    var offset = (header ? header.offsetHeight : 0) + 8;
    var top = jumps.getBoundingClientRect().top;
    if (top > offset + 2) {
      window.scrollTo({ top: window.scrollY + top - offset, behavior: "smooth" });
    }
  }

  function open(id) {
    history.pushState(null, "", "#" + id);
    select(id);
    placeJumps();
  }

  jumps.addEventListener("click", function (event) {
    var link = event.target.closest("a");
    if (!link || links.indexOf(link) === -1) return;
    event.preventDefault();
    open(link.getAttribute("href").slice(1));
  });

  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href^='#']");
    if (!link || jumps.contains(link)) return;
    var id = link.getAttribute("href").slice(1);
    if (ids.indexOf(id) === -1) return;
    event.preventDefault();
    open(id);
  });

  window.addEventListener("popstate", function () {
    select(location.hash.slice(1));
  });

  select(location.hash.slice(1));
})();
