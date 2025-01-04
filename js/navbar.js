document.addEventListener("DOMContentLoaded", () => {
  // Get the current page's name from the body or URL
  const currentPage = document.body.dataset.page || window.location.pathname.split('/').pop().split('.').shift();

  if (!currentPage) {
    console.error("Missing 'data-page' attribute on <body>!");
    return;
  }

  // Check if the navbar is already in local storage
  const cachedNavbar = localStorage.getItem("navbar");

  if (cachedNavbar) {
    // Use cached navbar to avoid fetch delay
    document.getElementById("navbar-container").innerHTML = cachedNavbar;
    highlightActiveLink(currentPage);
  } else {  
    // Fetch the navbar HTML
    fetch("/navbar.html")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to load navbar.");
        }
        return response.text();
      })
      .then(navbarHtml => {
        // Cache the navbar in local storage
        localStorage.setItem("navbar", navbarHtml);

        // Insert the navbar into the container
        document.getElementById("navbar-container").innerHTML = navbarHtml;
        
        // Highlight the active link
        highlightActiveLink(currentPage);
      })
      .catch(error => console.error(error));
  }
});

function highlightActiveLink(currentPage) {
  // Highlight the active link
  const navbarElements = document.querySelectorAll("#navbar *");
  navbarElements.forEach(link => {
    console.log(`Checking: ${link.dataset.page} against ${currentPage}`);
    if (link.dataset.page === currentPage) {
      link.classList.add("active");
      console.log(`Active class added to: ${link.href}`);
    }
  });
}