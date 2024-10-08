let registeredUsers = JSON.parse(localStorage.getItem('users')) || [];
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
console.log("JavaScript file loaded"); // Debugging line

// Display registration form
document.getElementById('registerBtn').addEventListener('click', () => {
    closeAllForms(); // Close other forms if open
    document.getElementById('registerForm').style.display = 'block';
});

// Display login form
document.getElementById('loginBtn').addEventListener('click', () => {
    closeAllForms(); // Close other forms if open
    document.getElementById('loginForm').style.display = 'block';
});

// Display services form
document.getElementById('selectServicesBtn').addEventListener('click', () => {
    closeAllForms(); // Close other forms if open
    document.getElementById('selectServicesForm').style.display = 'block';
});

// Display used services
document.getElementById('usedServicesBtn').addEventListener('click', () => {
    showUsedServices();
});

// Handle service type selection and update options/amount accordingly
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
document.getElementById('registrationForm').addEventListener('submit', function (e) {
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
document.getElementById('loginFormId').addEventListener('submit', function (e) {
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
document.getElementById('selectServicesForm').addEventListener('button', function(e) {
    e.preventDefault();  // Prevent the page from refreshing on form submission
    console.log("Form submitted"); // Debugging line
    const serviceType = document.getElementById('serviceType').value;

    // Check if the serviceType is selected, if not, show error
    if (!serviceType) {
        showAcknowledgement('Please select a service type.', 'red');
        return;
    }

    const serviceDetail = serviceType === 'House Cleaning'
        ? document.getElementById('houseCleaningType').value
        : document.getElementById('vehicleRepairType').value;

    const vendor = document.getElementById('vendor').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const slot = document.getElementById('slot').value;

    // Ensure that all required fields are filled
    if (!vendor || !date || !slot) {
        showAcknowledgement('Please fill out all the required fields.', 'red');
        return;
    }

    const serviceId = Math.floor(100000 + Math.random() * 900000);  // Unique service ID

    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));  // Get the logged-in user

    if (!loggedInUser) {
        showAcknowledgement('Please log in before booking a service.', 'red');
        return;
    }

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
    showAcknowledgement('Booking confirmed!', 'green');
    closeForm('selectServicesForm');
});

// Show Used Services
function showUsedServices() {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));  // Get the logged-in user
    const usedServicesTableBody = document.getElementById('usedServicesTable').querySelector('tbody');
    usedServicesTableBody.innerHTML = '';  // Clear previous entries

    if (!loggedInUser) {
        showAcknowledgement('Please log in to view used services.', 'red');
        return;
    }

    const userBookings = bookings.filter(booking => booking.userId === loggedInUser.userId);
    
    if (userBookings.length === 0) {
        showAcknowledgement('No services used yet.', 'yellow');
        return;
    }

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
        usedServicesTableBody.appendChild(row);
    });

    closeAllForms();
    document.getElementById('usedServices').style.display = 'block';
}

// Close all forms
function closeAllForms() {
    document.querySelectorAll('.form-popup').forEach(form => form.style.display = 'none');
}

// Close individual form
function closeForm(formId) {
    document.getElementById(formId).style.display = 'none';
}

// Show acknowledgement message
function showAcknowledgement(message, color) {
    const ackPopup = document.getElementById('ackPopup');
    const ackMsg = document.getElementById('ackMsg');
    ackMsg.innerHTML = message;
    ackPopup.style.backgroundColor = color === 'green' ? '#d4edda' : color === 'red' ? '#f8d7da' : '#fff3cd';
    ackPopup.style.display = 'block';
    setTimeout(() => {
        ackPopup.style.display = 'none';
    }, 5000);  // Popup disappears after 5 seconds
}

// Close acknowledgement popup
function closeAck() {
    document.getElementById('ackPopup').style.display = 'none';
}
