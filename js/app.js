let employees;
let filteredEmployees = []; // Global variable for filtered employees
const urlAPI = `https://randomuser.me/api/?results=12&nat=US&inc=picture,name,email,location,phone,dob`;

const displayEmployees = (data) => {
    const employeeSection = document.querySelector('.grid-area');
    employeeSection.innerHTML = '';

    const contentHolder = document.createDocumentFragment();

    data.forEach((currEmp, i) => {
        const div = document.createElement('div');
        div.className = 'card';
        div.dataset.index = i;

        div.innerHTML = `
            <div class="picture">
                <img src="${currEmp.picture.large}" alt="profile picture" />
            </div>
            <div class="about1">
                <h2>${currEmp.name.first} ${currEmp.name.last}</h2>
                <p>${currEmp.email}</p>
                <p>${currEmp.location.city}</p>
            </div>
        `;
        contentHolder.appendChild(div);
    });

    employeeSection.appendChild(contentHolder);
};

const getEmployeeData = async (url) => {
    try {
        const response = await fetch(url);
        const { results } = await response.json();
        console.log(results); 
        return results;
    } catch (error) {
        console.log('The API has a problem:', error);
    }
};

const startApp = async () => {
    employees = await getEmployeeData(urlAPI);
    filteredEmployees = employees;
    displayEmployees(employees);
};

const toggleModal = () => {
    document.querySelector('.modal').classList.toggle('hidden');
};

const createCloseButton = () => {
    const closeButton = document.createElement('span');
    closeButton.className = 'close';
    closeButton.innerHTML = '&times;';
    closeButton.onclick = toggleModal;

    return closeButton;
};

const setModalData = (data, index) => {
    const states = [
        'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 
        'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
        'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
        'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI',
        'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];

    const modalCardContainer = document.querySelector('.modal .card-container .card');
    modalCardContainer.innerHTML = `
        <div class="picture">
            <img src="${data.picture.large}" alt="profile picture" />
        </div>
        <div class="about1">
            <h2>${data.name.first} ${data.name.last}</h2>
            <p>${data.email}</p>
            <p>${data.location.city}</p>
        </div>
        <div class="about2">
            <p>${data.phone}</p>
            <p>${data.location.street.number} ${data.location.street.name},${data.location.city} ,${data.location.state},${data.location.postcode}</p>
            <p>Birthday: ${new Date(data.dob.date).toLocaleDateString()}</p>
        </div>
    `;
    modalCardContainer.dataset.index = index;
    if (!modalCardContainer.querySelector('.close')) {
        modalCardContainer.appendChild(createCloseButton());
    }
    createNavigationButtons();
};

const createNavigationButtons = () => {
    const modalContainer = document.querySelector('.modal .card-container');
    const existingNav = modalContainer.querySelector('.navigation');
    if (existingNav) existingNav.remove();

    const navigationDiv = document.createElement('div');
    navigationDiv.className = 'navigation';
    ['prev', 'next'].forEach((direction) => {
        const button = document.createElement('button');
        button.className = direction;
        button.innerHTML = `<p>${direction === 'prev' ? '<' : '>'}</p>`;
        button.onclick = (e) => {
            e.stopPropagation();
            changeEmployee(direction);
        };
        navigationDiv.appendChild(button);
    });

    modalContainer.appendChild(navigationDiv);
};

const changeEmployee = (direction) => {
    const currentIndex = +document.querySelector('.modal .card-container .card').dataset.index;

    const activeCards = filteredEmployees.map((_, i) => i);

    const newIndex = direction === 'prev' 
        ? (currentIndex === activeCards[0] ? activeCards[activeCards.length - 1] : activeCards[activeCards.indexOf(currentIndex) - 1])
        : (currentIndex === activeCards[activeCards.length - 1] ? activeCards[0] : activeCards[activeCards.indexOf(currentIndex) + 1]);

    if (newIndex >= 0 && newIndex < filteredEmployees.length) {
        setModalData(filteredEmployees[newIndex], newIndex);
    }
};

const showModal = (e) => {
    if (e.target.closest('.card')) {
        const index = e.target.closest('.card').dataset.index;
        setModalData(filteredEmployees[index], index);
        toggleModal();
    }
};

const filterCards = ({ target: { value } }) => {
    if (value.trim() === '') {
        filteredEmployees = employees;
    } else {
        filteredEmployees = employees.filter(emp => 
            `${emp.name.first} ${emp.name.last}`.toLowerCase().includes(value.toLowerCase())
        );
    }
    displayEmployees(filteredEmployees);
};

document.getElementById('search').addEventListener('keyup', filterCards);
document.querySelector('.grid-area').addEventListener('click', showModal);

startApp();
