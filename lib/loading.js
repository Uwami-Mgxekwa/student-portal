// Full-screen loading overlay
export const showLoading = (message = "Loading...") => {
  // Remove existing loader if any
  removeLoading();
  
  const docBody = document.querySelector("body");
  const loadingWrapper = document.createElement("div");
  const spinner = document.createElement("div");
  const loadingMessage = document.createElement("h1");

  loadingWrapper.setAttribute("id", "loading-wrapper");
  loadingMessage.innerText = message;
  spinner.classList.add("loader");

  loadingWrapper.appendChild(spinner);
  loadingWrapper.appendChild(loadingMessage);
  loadingWrapper.classList.add("loading-wrapper");
  docBody.appendChild(loadingWrapper);
  
  // Fade in animation
  setTimeout(() => {
    loadingWrapper.style.opacity = "1";
  }, 10);
};

export const removeLoading = () => {
  const loadingWrapper = document.getElementById("loading-wrapper");
  if (loadingWrapper) {
    // Fade out animation
    loadingWrapper.style.opacity = "0";
    setTimeout(() => {
      if (loadingWrapper.parentNode) {
        loadingWrapper.parentNode.removeChild(loadingWrapper);
      }
    }, 300);
  }
};

// Inline loading spinner (for buttons, cards, etc.)
export const createInlineLoader = (size = "medium") => {
  const spinner = document.createElement("div");
  spinner.className = `inline-loader inline-loader-${size}`;
  spinner.innerHTML = '<div class="spinner"></div>';
  return spinner;
};

// Show loading in a specific element
export const showElementLoading = (elementId, message = "Loading...") => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.innerHTML = `
    <div class="element-loading">
      <div class="loader"></div>
      <p>${message}</p>
    </div>
  `;
};

// Skeleton loader for cards/lists
export const createSkeletonLoader = (type = "card", count = 3) => {
  const container = document.createElement("div");
  container.className = "skeleton-container";
  
  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement("div");
    skeleton.className = `skeleton skeleton-${type}`;
    
    if (type === "card") {
      skeleton.innerHTML = `
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-line skeleton-line-title"></div>
          <div class="skeleton-line skeleton-line-text"></div>
          <div class="skeleton-line skeleton-line-text short"></div>
        </div>
      `;
    } else if (type === "list") {
      skeleton.innerHTML = `
        <div class="skeleton-line skeleton-line-text"></div>
      `;
    } else if (type === "table") {
      skeleton.innerHTML = `
        <div class="skeleton-line skeleton-line-text"></div>
        <div class="skeleton-line skeleton-line-text"></div>
        <div class="skeleton-line skeleton-line-text"></div>
      `;
    }
    
    container.appendChild(skeleton);
  }
  
  return container;
};

// Button loading state
export const setButtonLoading = (button, loading = true, originalText = null) => {
  if (loading) {
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `
      <div class="inline-loader inline-loader-small">
        <div class="spinner"></div>
      </div>
      <span>Loading...</span>
    `;
    button.classList.add("btn-loading");
  } else {
    button.disabled = false;
    button.innerHTML = originalText || button.dataset.originalText || "Submit";
    button.classList.remove("btn-loading");
  }
};

export const setLoading = (state) => {
  return state;
};
