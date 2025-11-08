import { supabase } from "../config/supabase.js";
import { showLoading, removeLoading } from "../lib/loading.js";
import { showAlert } from "../lib/pop-up.js";

// DOM Elements
const searchInput = document.getElementById("search-input");
const categoryTabs = document.querySelectorAll(".tab-btn");
const faqItems = document.querySelectorAll(".faq-item");
const openModalBtn = document.getElementById("open-support-form");
const closeModalBtn = document.getElementById("close-modal");
const modal = document.getElementById("support-modal");
const supportForm = document.getElementById("support-form");

// FAQ Accordion
faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    // Close all items
    faqItems.forEach((faq) => faq.classList.remove("active"));

    // Open clicked item if it wasn't active
    if (!isActive) {
      item.classList.add("active");
    }
  });
});

// Search Functionality
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question h3").textContent.toLowerCase();
    const answer = item.querySelector(".faq-answer").textContent.toLowerCase();

    if (question.includes(searchTerm) || answer.includes(searchTerm)) {
      item.classList.remove("hidden");
    } else {
      item.classList.add("hidden");
    }
  });
});

// Category Filter
categoryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Update active tab
    categoryTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const category = tab.getAttribute("data-category");

    // Filter FAQ items
    faqItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category");

      if (category === "all" || itemCategory === category) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });

    // Clear search when changing category
    searchInput.value = "";
  });
});

// Modal Controls
openModalBtn.addEventListener("click", () => {
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Support Form Submission
supportForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    full_name: document.getElementById("support-name").value,
    student_id: document.getElementById("support-student-id").value,
    email: document.getElementById("support-email").value,
    issue_type: document.getElementById("support-issue-type").value,
    message: document.getElementById("support-message").value,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  console.log("Submitting support ticket:", formData);

  showLoading("Submitting your request...");

  try {
    const { data, error } = await supabase
      .from("support_tickets")
      .insert([formData])
      .select();

    console.log("Support ticket result:", data, error);

    if (error) throw error;

    removeLoading();
    showAlert(
      "Request Submitted!",
      "Thank you for contacting us. Our support team will respond within 24 hours.",
      "success"
    );

    // Close modal and reset form
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    supportForm.reset();
  } catch (error) {
    console.error("Error submitting support ticket:", error);
    removeLoading();
    showAlert(
      "Submission Error",
      "There was an error submitting your request. Please try again or email us directly.",
      "error"
    );
  }
});

// Auto-fill Student ID if logged in
window.addEventListener("load", async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Get student info
      const { data: student } = await supabase
        .from("students")
        .select("student_id, first_name, last_name, email")
        .eq("id", user.id)
        .single();

      if (student) {
        document.getElementById("support-student-id").value = student.student_id;
        document.getElementById("support-name").value =
          `${student.first_name} ${student.last_name}`;
        document.getElementById("support-email").value = student.email;
      }
    }
  } catch (error) {
    console.log("User not logged in or error fetching data");
  }
});
