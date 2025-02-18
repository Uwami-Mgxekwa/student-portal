document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    updateLastUpdatedTime();
});

function renderCalendar() {
    const calendarContainer = document.getElementById('calendar');
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    calendarContainer.innerHTML = '';

    daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.style.fontWeight = 'bold';
        calendarContainer.appendChild(dayElement);
    });

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.textContent = '';
        calendarContainer.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        if (day === today.getDate()) {
            dayDiv.style.backgroundColor = '#8884d8';
            dayDiv.style.color = 'white';
            dayDiv.style.borderRadius = '4px';
        }
        calendarContainer.appendChild(dayDiv);
    }
}

function updateLastUpdatedTime() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
        const now = new Date();
        const formattedDate = now.toLocaleString();
        lastUpdatedElement.textContent = formattedDate;
    }
    setTimeout(updateLastUpdatedTime, 60000);
}
