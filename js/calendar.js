class Calendar {
    static #instance = null;
    static getInstance() {
        if(this.#instance == null) {
            this.#instance = new Calendar();
        }
        return this.#instance;
    }

    constructor() {
        this.currentDate = new Date();
        this.displayDate = new Date();
        this.init();
    }

    init() {
        this.renderCalendar();
        this.addEventListeners();
    }

    addEventListeners() {
        const prevButton = document.querySelector('.calendar-prev');
        const nextButton = document.querySelector('.calendar-next');

        prevButton.addEventListener('click', () => {
            this.displayDate.setMonth(this.displayDate.getMonth() - 1);
            this.renderCalendar();
        });

        nextButton.addEventListener('click', () => {
            this.displayDate.setMonth(this.displayDate.getMonth() + 1);
            this.renderCalendar();
        });
    }

    renderCalendar() {
        const monthYear = document.querySelector('.calendar-month-year');
        const calendarTable = document.querySelector('.calendar-table tbody');
        calendarTable.innerHTML = '';

        const firstDayOfMonth = new Date(this.displayDate.getFullYear(), this.displayDate.getMonth(), 1);
        const lastDayOfMonth = new Date(this.displayDate.getFullYear(), this.displayDate.getMonth() + 1, 0);

        let currentDay = new Date(firstDayOfMonth);

        monthYear.innerHTML = `
            <span class="calendar-month">${this.getMonthName(this.displayDate.getMonth())}</span>
            <span class="calendar-year">${this.displayDate.getFullYear()}</span>
        `;

        while (currentDay <= lastDayOfMonth) {
            const weekRow = document.createElement('tr');

            for (let i = 0; i < 7; i++) {
                const dayCell = document.createElement('td');
                dayCell.classList.add("calendar-day");

                if ((i === currentDay.getDay()) && (currentDay <= lastDayOfMonth)) {
                    dayCell.textContent = currentDay.getDate();
                    currentDay.setDate(currentDay.getDate() + 1);
                }
                dayCell.addEventListener("click", () => {
                    const year = this.displayDate.getFullYear();
                    const month = this.displayDate.getMonth() + 1;
                    const day = parseInt(dayCell.textContent);
                    const dateString = `${year}.${month}.${day}`;
                    window.location.href = `./index.html?date=${dateString}`;
                });
                weekRow.appendChild(dayCell);
            }

            calendarTable.appendChild(weekRow);
        }
    }

    getMonthName(month) {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        return monthNames[month];
    }
}

window.onload = () => {
    Calendar.getInstance();
}