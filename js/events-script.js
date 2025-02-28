document.addEventListener("DOMContentLoaded", function () {
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const closeSidebarBtn = document.getElementById("close-sidebar");

  function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  hamburgerIcon.addEventListener("click", openSidebar);
  overlay.addEventListener("click", closeSidebar);
  closeSidebarBtn.addEventListener("click", closeSidebar);

  const menuItems = document.querySelectorAll(".menu-items a");
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.querySelector("img").style.filter = "brightness(1.1)";
    });

    card.addEventListener("mouseleave", function () {
      this.querySelector("img").style.filter = "brightness(1)";
    });
  });

  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      if (emailInput.value) {
        const successMsg = document.createElement("p");
        successMsg.textContent = "Thank you for subscribing!";
        successMsg.style.color = "white";
        successMsg.style.marginTop = "10px";

        const existingMsg = this.parentNode.querySelector("p:last-child");
        if (existingMsg && existingMsg !== this.previousElementSibling) {
          existingMsg.remove();
        }

        this.parentNode.appendChild(successMsg);
        emailInput.value = "";

        setTimeout(() => {
          successMsg.remove();
        }, 3000);
      }
    });
  }

  const currentYear = new Date().getFullYear();
  const copyrightElement = document.querySelector(".footer-bottom p");
  if (copyrightElement) {
    copyrightElement.textContent = copyrightElement.textContent.replace(
      "2025",
      currentYear,
    );
  }
});

