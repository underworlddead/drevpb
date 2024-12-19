document.addEventListener("DOMContentLoaded", () => {
  const explorerItems = document.querySelectorAll(".explorer li");
  const tabsContainer = document.querySelector(".tabs");
  const contentArea = document.querySelector(".content-area");
  const explorer = document.querySelector(".explorer");
  const mainContent = document.querySelector(".main-content");
  
  // Add resize functionality
  let isResizing = false;
  let startX;
  let startWidth;

  explorer.addEventListener("mousedown", (e) => {
    // Only trigger on the resize handle (right 4px of explorer)
    if (e.offsetX > explorer.offsetWidth - 4) {
      isResizing = true;
      startX = e.pageX;
      startWidth = explorer.offsetWidth;
      console.log("Started resizing");
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (!isResizing) return;
    
    const width = startWidth + (e.pageX - startX);
    // Limit min and max width
    if (width > 150 && width < 600) {
      explorer.style.width = `${width}px`;
      mainContent.style.width = `calc(100% - ${width}px)`;
      console.log("Resizing to:", width);
    }
  });

  document.addEventListener("mouseup", () => {
    isResizing = false;
    console.log("Stopped resizing");
  });

  console.log("DOM Loaded");
  console.log("Explorer items found:", explorerItems.length);

  // Track open tabs
  const openTabs = new Map();

  function addTab(projectId, title) {
      console.log("Adding tab:", projectId, title);
      // If the tab already exists, activate it
      if (openTabs.has(projectId)) {
          activateTab(projectId);
          return;
      }

      // Create a new tab element
      const tab = document.createElement("div");
      tab.classList.add("tab");
      tab.dataset.project = projectId;
      tab.innerHTML = `${title} <span class="close-tab">&times;</span>`;
      tabsContainer.appendChild(tab);

      // Add to open tabs
      openTabs.set(projectId, tab);

      // Activate the tab
      activateTab(projectId);

      // Close tab on click of the close button
      tab.querySelector(".close-tab").addEventListener("click", (e) => {
          e.stopPropagation();
          removeTab(projectId);
      });

      // Activate the tab on click
      tab.addEventListener("click", () => activateTab(projectId));
  }

  function activateTab(projectId) {
      console.log("Activating tab:", projectId);
      // Deactivate all tabs
      tabsContainer.querySelectorAll(".tab").forEach((tab) => {
          tab.classList.remove("active");
      });
      
      // Activate the selected tab
      const tab = openTabs.get(projectId);
      if (tab) {
          tab.classList.add("active");
      }

      // Load content for the selected tab
      fetchContent(projectId);
  }

  function removeTab(projectId) {
      const tab = openTabs.get(projectId);
      if (tab) {
          // Remove tab from DOM
          tab.remove();

          // Remove tab from open tabs
          openTabs.delete(projectId);

          // If the closed tab was active, activate the last tab
          if (tab.classList.contains("active") && openTabs.size > 0) {
              const lastTab = Array.from(openTabs.values()).pop();
              activateTab(lastTab.dataset.project);
          }

          // If no tabs are open, clear the content area
          if (openTabs.size === 0) {
              contentArea.innerHTML = "<h2>No Tabs Open</h2>";
          }
      }
  }

  function fetchContent(projectId) {
      console.log("Fetching content for:", projectId);
      fetch(`/api/projects/${projectId}`)
          .then((response) => {
              console.log("Response status:", response.status);
              return response.text();
          })
          .then((data) => {
              console.log("Content received:", data.substring(0, 50) + "...");
              contentArea.innerHTML = data;
          })
          .catch((err) => {
              console.error("Error fetching content:", err);
              contentArea.innerHTML = `<p>Failed to load content for ${projectId}</p>`;
          });
  }

  // Initialize the Explorer click functionality
  explorerItems.forEach((item) => {
      const projectId = item.dataset.project;
      const title = item.textContent;
      
      item.addEventListener("click", () => {
          console.log("Explorer item clicked:", projectId);
          addTab(projectId, title);
      });
  });

  // Clear any existing tabs
  tabsContainer.innerHTML = '';
  
  // Open the Welcome tab by default
  console.log("Opening default welcome tab");
  addTab("welcome", "Welcome Page");

  // Add click handlers to existing close buttons
  document.querySelectorAll('.close-tab').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const tab = e.target.closest('.tab');
      if (tab) {
        removeTab(tab.dataset.project);
      }
    });
  });

  // Add these event listeners when the Flutter project is active
  document.querySelector('.minimize').addEventListener('click', () => {
    document.querySelector('.flutter-emulator').classList.toggle('minimized');
  });

  document.querySelector('.maximize').addEventListener('click', () => {
    document.querySelector('.flutter-emulator').classList.toggle('maximized');
  });
});