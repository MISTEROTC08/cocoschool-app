-- Structure de la base de données CoCoSchool

-- Table des utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des rôles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- 'parent', 'student', 'teacher', 'student_driver'
    description TEXT
);

-- Table des familles
CREATE TABLE families (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    parent_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des membres de famille
CREATE TABLE family_members (
    family_id INTEGER REFERENCES families(id),
    user_id INTEGER REFERENCES users(id),
    role VARCHAR(50), -- 'parent', 'child'
    PRIMARY KEY (family_id, user_id)
);

-- Table des trajets
CREATE TABLE rides (
    id SERIAL PRIMARY KEY,
    driver_id INTEGER REFERENCES users(id),
    departure_time TIMESTAMP,
    status VARCHAR(50), -- 'scheduled', 'in_progress', 'completed', 'cancelled'
    max_passengers INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des points de rendez-vous
CREATE TABLE meeting_points (
    id SERIAL PRIMARY KEY,
    ride_id INTEGER REFERENCES rides(id),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    address TEXT,
    arrival_time TIMESTAMP
);

-- Table des réservations
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    ride_id INTEGER REFERENCES rides(id),
    passenger_id INTEGER REFERENCES users(id),
    status VARCHAR(50), -- 'pending', 'confirmed', 'cancelled'
    meeting_point_id INTEGER REFERENCES meeting_points(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des paiements
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    amount DECIMAL(10,2),
    status VARCHAR(50), -- 'pending', 'completed', 'failed', 'refunded'
    stripe_payment_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des urgences
CREATE TABLE emergencies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    ride_id INTEGER REFERENCES rides(id),
    type VARCHAR(50), -- 'sos', 'delay', 'accident', 'other'
    description TEXT,
    status VARCHAR(50), -- 'pending', 'handled', 'resolved'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des évaluations
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    ride_id INTEGER REFERENCES rides(id),
    from_user_id INTEGER REFERENCES users(id),
    to_user_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);