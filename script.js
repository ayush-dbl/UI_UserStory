let registeredUsers = JSON.parse(localStorage.getItem('users')) || [];
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

document.getElementById('registerBtn').addEventListener('click', () => {
    document.getElementById('registerForm').style.display = 'block';
});

document.getElementById('loginBtn').addEventListener('click', () => {
    document.getElementById('loginForm').style.display = 'block';
});

document.getElementById('selectServicesBtn').addEventListener('click', () => {
    document.getElementById('selectServicesForm').style.display = 'block';
});

document.getElementById('usedServicesBtn').addEventListener('click', () => {
    showUsedServices();
});

document.getElementById('serviceType').addEventListener('change', function () {
    if (this.value === 'House Cleaning') {
        document.getElementById('houseCleaningOptions').style.display = 'block';
        document.getElementById('vehicleRepairOptions').style.display = 'none';
        document.getElementById('amount').value = '2000';
    } else if (this.value === 'Vehicle Repair') {
        document.getElementById('vehicleRepairOptions').style.display = 'block';
        document.getElementById('houseCleaningOptions').style.display = 'none';
        document.getElementById('amount').value = '1500';
    }
});

// Registration Form Submission
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const address = document.getElementById('address').value;
    const contact = document.getElementById('contact').value;
    
    const userId = Math.floor(100000 + Math.random() * 900000);
    
    const newUser = { userId, username, email, password, address, contact };
    
    registeredUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(registeredUsers));

    showAcknowledgement(`User Registration successful! <br> User ID: ${userId} <br> User Name: ${username} <br> Email: ${email}`, 'green');
    closeForm('registerForm');
});

// Login Form Submission
document.getElementById('loginFormId').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = registeredUsers.find(u => u.username === username && u.password === password);
    
    if (user) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        showAcknowledgement('Login successful!', 'green');
        document.getElementById('homeButtons').style.display = 'none';
        document.getElementById('loggedInUserButtons').style.display = 'block';
        closeForm('loginForm');
    } else {
        showAcknowledgement('Invalid credentials!', 'red');
    }
});

// Booking Confirmation
document.getElementById('selectServicesForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const serviceType = document.getElementById('serviceType').value;
    const serviceDetail = serviceType === 'House Cleaning' 
        ? document.getElementById('houseCleaningType').value 
        : document.getElementById('vehicleRepairType').value;
    
    const vendor = document.getElementById('vendor').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const slot = document.getElementById('slot').value;
    
    const serviceId = Math.floor(100000 + Math.random() * 900000);
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    
    const newBooking = {
        userId: loggedInUser.userId,
        username: loggedInUser.username,
        serviceId,
        date,
        slot,
        serviceType: `${serviceType} - ${serviceDetail}`,
        vendor,
        status: 'Booked'
    };
    
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    showAcknowledgement(`Service Booked Successfully! <br> Service ID: ${serviceId} <br> Vendor: ${vendor} <br> Date/Time Slot: ${date}, ${slot}`, 'green');
    closeForm('selectServicesForm');
});

// Show Used Services Table
function showUsedServices() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const userBookings = bookings.filter(booking => booking.userId === loggedInUser.userId);
    
    const tbody = document.querySelector('#usedServicesTable tbody');
    tbody.innerHTML = '';
    
    userBookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.userId}</td>
            <td>${booking.username}</td>
            <td>${booking.serviceId}</td>
            <td>${booking.date}</td>
            <td>${booking.slot}</td>
            <td>${booking.serviceType}</td>
            <td>${booking.status}</td>
        `;
        tbody.appendChild(row);
    });
    
    document.getElementById('usedServices').style.display = 'block';
}

// Utility Functions
function showAcknowledgement(message, color) {
    document.getElementById('ackMsg').innerHTML = message;
    document.getElementById('ackMsg').style.color = color;
    document.getElementById('ackPopup').style.display = 'block';
}

function closeAck() {
    document.getElementById('ackPopup').style.display = 'none';
}

function closeForm(formId) {
    document.getElementById(formId).style.display = 'none';
}
