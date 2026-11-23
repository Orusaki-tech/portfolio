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
})();
