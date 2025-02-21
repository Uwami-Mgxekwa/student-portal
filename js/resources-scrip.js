document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-panel`).classList.add('active');
        });
    });
    
    const searchInput = document.getElementById('resource-search');
    const searchButton = document.getElementById('search-btn');
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const resourceCards = document.querySelectorAll('.resource-card');
        
        resourceCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    const categoryFilter = document.getElementById('resource-category');
    categoryFilter.addEventListener('change', filterResources);
    
    const departmentFilter = document.getElementById('resource-department');
    departmentFilter.addEventListener('change', filterResources);
    
    function filterResources() {
        const categoryValue = categoryFilter.value;
        const departmentValue = departmentFilter.value;
        
        tabPanels.forEach(panel => panel.classList.add('active'));
        
        if (categoryValue !== 'all') {
            document.querySelector(`.tab-btn[data-tab="${categoryValue}"]`).click();
        }
        
        const resourceCards = document.querySelectorAll('.resource-card');
        resourceCards.forEach(card => {
            const cardDepartment = card.getAttribute('data-department') || 'all';
            
            if (departmentValue === 'all' || cardDepartment === departmentValue) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
function adjustTimelineDates() {
    const timelineSection = document.querySelector('.timeline');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const windowWidth = window.innerWidth;
    
    if (windowWidth <= 768) {
        timelineSection.style.paddingLeft = '3rem';
        
        timelineItems.forEach(item => {
            const dateElement = item.querySelector('.timeline-date');
            dateElement.style.position = 'static';
            dateElement.style.width = 'auto';
            dateElement.style.textAlign = 'left';
            dateElement.style.marginBottom = '0.5rem';
            dateElement.style.fontWeight = 'bold';
        });
    } else {
        timelineSection.style.paddingLeft = '8rem';
        
        timelineItems.forEach(item => {
            const dateElement = item.querySelector('.timeline-date');
            dateElement.style.position = 'absolute';
            dateElement.style.left = '-6rem';
            dateElement.style.width = '5rem';
            dateElement.style.textAlign = 'right';
            dateElement.style.marginBottom = '0';
        });
    }
}

window.addEventListener('DOMContentLoaded', adjustTimelineDates);

window.addEventListener('resize', adjustTimelineDates);
    
    adjustTimelineDates();

    window.addEventListener('resize', adjustTimelineDates);

    function loadTabContent(tabId) {
        const panel = document.getElementById(`${tabId}-panel`);
        
        if (panel.querySelector('.resource-message')) {
            setTimeout(() => {
                panel.innerHTML = `
                    <div class="resource-cards">
                        <div class="resource-card">
                            <div class="resource-details">
                                <div class="resource-icon ${tabId === 'policies' ? 'policy-icon' : 'form-icon'}"></div>
                                <div>
                                    <h4>${tabId.charAt(0).toUpperCase() + tabId.slice(1)} Resource 1</h4>
                                    <p>Description for ${tabId} resource 1</p>
                                    <span class="resource-meta">PDF • 0.5 MB • Updated Feb 12, 2025</span>
                                </div>
                            </div>
                            <a href="#" class="btn resource-btn">Download</a>
                        </div>
                        <div class="resource-card">
                            <div class="resource-details">
                                <div class="resource-icon ${tabId === 'policies' ? 'policy-icon' : 'form-icon'}"></div>
                                <div>
                                    <h4>${tabId.charAt(0).toUpperCase() + tabId.slice(1)} Resource 2</h4>
                                    <p>Description for ${tabId} resource 2</p>
                                    <span class="resource-meta">PDF • 0.7 MB • Updated Jan 25, 2025</span>
                                </div>
                            </div>
                            <a href="#" class="btn resource-btn">Download</a>
                        </div>
                    </div>
                `;
            }, 1000);
        }
    }
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            loadTabContent(tabId);
        });
    });
});