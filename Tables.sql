-- 1. LOGIN TABLE (username = email, validate in app)
CREATE TABLE login (
    username VARCHAR(100) PRIMARY KEY, -- Validate email format in app (regex)
    password VARCHAR(255) NOT NULL CHECK (CHAR_LENGTH(password) >= 4), -- min 8 chars
    status ENUM('active', 'inactive') DEFAULT 'active',
    role ENUM('customer', 'admin', 'staff') NOT NULL
);

    -- 2. CUSTOMER TABLE
    CREATE TABLE customer (
        customer_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL,
        name VARCHAR(100) NOT NULL CHECK (CHAR_LENGTH(name) >= 3),
        address TEXT NOT NULL CHECK (CHAR_LENGTH(address) >= 5),
        phone_number VARCHAR(15) NOT NULL CHECK (phone_number REGEXP '^[0-9]{10}$'),
        place VARCHAR(100) NOT NULL CHECK (CHAR_LENGTH(place) >= 3),
        pin_code VARCHAR(6) NOT NULL CHECK (pin_code REGEXP '^[1-9][0-9]{5}$'),
        ration_card VARCHAR(20) UNIQUE,
        aadhar_number CHAR(12) UNIQUE CHECK (aadhar_number REGEXP '^[0-9]{12}$'),
        consumer_number VARCHAR(30) UNIQUE,
        meter_id VARCHAR(30) UNIQUE,
        tariff_type ENUM('Domestic', 'Commercial', 'Industrial') NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        FOREIGN KEY (username) REFERENCES login(username) ON DELETE CASCADE
    );


-- 3. STAFF TABLE
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL CHECK (CHAR_LENGTH(name) >= 3), -- name must be ≥ 3 chars
    contact VARCHAR(10) NOT NULL,
    CHECK (
        CHAR_LENGTH(contact) = 10 AND contact REGEXP '^[0-9]+$' -- only 10-digit numbers
    ),
    FOREIGN KEY (username) REFERENCES login(username) ON DELETE CASCADE
);

-- 4. READINGS TABLE
CREATE TABLE readings (
    reading_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    staff_id INT,
    units_consumed INT NOT NULL CHECK (units_consumed >= 0),
    reading_date DATE NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE SET NULL
);


CREATE TABLE tariffs (
    tariff_id INT AUTO_INCREMENT PRIMARY KEY,
    tariff_type ENUM('Domestic', 'Commercial', 'Industrial') NOT NULL,
    unit_from INT NOT NULL CHECK (unit_from >= 0),
    unit_to INT NOT NULL CHECK (unit_to >= unit_from),
    rate DECIMAL(10,2) NOT NULL CHECK (rate > 0)
);


CREATE TABLE extra_charges (
    charge_id INT AUTO_INCREMENT PRIMARY KEY,
    tariff_type ENUM('Domestic', 'Commercial', 'Industrial') NOT NULL UNIQUE,
    fixed_charge DECIMAL(10,2) DEFAULT 0,
    meter_rent DECIMAL(10,2) DEFAULT 0,
    electricity_duty DECIMAL(10,2) DEFAULT 0,
    fuel_charge DECIMAL(10,2) DEFAULT 0
);


CREATE TABLE bills (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    reading_id INT NOT NULL,
    bill_number VARCHAR(20) UNIQUE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    bill_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status ENUM('paid', 'unpaid') DEFAULT 'unpaid',
    FOREIGN KEY (reading_id) REFERENCES readings(reading_id) ON DELETE CASCADE
);


CREATE TABLE fine_slabs (
    slab_id INT AUTO_INCREMENT PRIMARY KEY,
    days_from INT NOT NULL CHECK (days_from >= 0),
    days_to INT NOT NULL CHECK (days_to >= days_from),
    fine_amount DECIMAL(10,2) NOT NULL CHECK (fine_amount >= 0)
);

-- 7. PAYMENT TABLE
CREATE TABLE payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    bill_id INT NOT NULL,
    customer_id INT NOT NULL,
    bill_amount DECIMAL(10,2) NOT NULL CHECK (bill_amount >= 0),
    fine DECIMAL(10,2) DEFAULT 0 CHECK (fine >= 0),
    amount_to_be_paid DECIMAL(10,2) AS (bill_amount + fine) STORED,
    amount_paid DECIMAL(10,2) NOT NULL CHECK (amount_paid >= 0),
    payment_date DATE NOT NULL,
    FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE CASCADE
);






-- Domestic Slabs (based on BESCOM rates)
INSERT INTO tariffs (tariff_type, unit_from, unit_to, rate) VALUES
('Domestic', 0, 50, 4.00),
('Domestic', 51, 100, 5.45),
('Domestic', 101, 200, 7.00),
('Domestic', 201, 9999, 8.15);  -- For units above 200

-- Commercial Slabs
INSERT INTO tariffs (tariff_type, unit_from, unit_to, rate) VALUES
('Commercial', 0, 50, 6.50),
('Commercial', 51, 100, 7.50),
('Commercial', 101, 200, 8.90),
('Commercial', 201, 9999, 9.50);  -- For units above 200

-- Industrial Slabs
INSERT INTO tariffs (tariff_type, unit_from, unit_to, rate) VALUES
('Industrial', 0, 100, 5.50),
('Industrial', 101, 300, 6.75),
('Industrial', 301, 500, 7.90),
('Industrial', 501, 9999, 8.50);  -- For units above 500
