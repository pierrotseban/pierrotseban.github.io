document.addEventListener("DOMContentLoaded", () => {
    // Get the current page's name from the body or URL
    const currentPage = document.body.dataset.page || window.location.pathname.split('/').pop().split('.').shift();
  
    // Fetch the navbar HTML
    fetch("/navbar.html")
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to load navbar.");
        }
        return response.text();
      })
      .then(navbarHtml => {
        // Insert the navbar into the container
        document.getElementById("navbar-container").innerHTML = navbarHtml;
  
        // Highlight the active link
        const navbarLinks = document.querySelectorAll("#navbar-container *");
        navbarLinks.forEach(link => {
          console.log(`Checking: ${link.dataset.page} against ${currentPage}`);
          if (link.dataset.page === currentPage) {
            link.classList.add("active");
            console.log(`Active class added to: ${link.href}`);
          }
        });
      })
      .catch(error => console.error(error));
  });