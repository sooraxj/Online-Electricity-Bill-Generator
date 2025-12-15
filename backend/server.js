const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // replace if needed
    database: 'Electricity'
});

db.connect((err) => {
    if (err) throw err;
    console.log("✅ MySQL Connected");
});
// Check uniqueness endpoint
app.get('/api/check-unique/:field/:value', (req, res) => {
  const { field, value } = req.params;
  const allowedFields = ['aadhar_number', 'username', 'phone_number', 'ration_card'];

  if (!allowedFields.includes(field)) {
    return res.status(400).json({ error: 'Invalid field' });
  }

  let table = 'customer';
  if (field === 'username') {
    table = 'login';
  }

  const query = `SELECT 1 FROM ${table} WHERE ${field} = ?`;
  db.query(query, [value], (err, results) => {
    if (err) {
      console.error(`Error checking ${field}:`, err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json({ exists: results.length > 0 });
  });
});

// Existing register route
app.post('/api/register', (req, res) => {
  const { username, password, name, address, place, phone_number, pincode, tariff_type, ration_card, aadhar_number } = req.body;

  // Validate new fields
  if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) {
    return res.status(400).json({ error: 'Invalid pincode format' });
  }
  if (!tariff_type || !['Domestic', 'Commercial', 'Industrial'].includes(tariff_type)) {
    return res.status(400).json({ error: 'Invalid tariff type' });
  }

  const loginQuery = `INSERT INTO login (username, password, role, status) VALUES (?, ?, 'customer', 'inactive')`;
  const customerQuery = `INSERT INTO customer (username, name, address, place, phone_number, pin_code, tariff_type, ration_card, aadhar_number)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(loginQuery, [username, password], (err) => {
    if (err) return res.status(400).json({ error: 'Login already exists or invalid' });

    db.query(customerQuery, [username, name, address, place, phone_number, pincode, tariff_type, ration_card, aadhar_number], (err2) => {
      if (err2) return res.status(400).json({ error: 'Customer insert error', details: err2 });
      res.json({ message: 'Registered. Await admin approval.' });
    });
  });
});

// Admin: Edit customer
app.put('/api/admin/edit-customer/:customer_id', (req, res) => {
    const { customer_id } = req.params;
    const { username, name, phone_number, place, pin_code } = req.body;

    // Validate inputs
    if (!Number.isInteger(parseInt(customer_id))) {
        return res.status(400).json({ error: 'Customer ID must be an integer' });
    }
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    if (!name || name.length < 3) {
        return res.status(400).json({ error: 'Name must be at least 3 characters long' });
    }
    if (!phone_number || !/^[0-9]{10}$/.test(phone_number)) {
        return res.status(400).json({ error: 'Phone number must be a valid 10-digit number' });
    }
    if (!place || place.length < 3) {
        return res.status(400).json({ error: 'Place must be at least 3 characters long' });
    }
    if (!pin_code || !/^[1-9][0-9]{5}$/.test(pin_code)) {
        return res.status(400).json({ error: 'Pin code must be a valid 6-digit number' });
    }

    // Verify customer exists and username matches
    const verifyQuery = `SELECT username FROM customer WHERE customer_id = ?`;
    db.query(verifyQuery, [customer_id], (err, result) => {
        if (err) {
            console.error('Error verifying customer:', err);
            return res.status(500).json({ error: 'Error verifying customer' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        if (result[0].username !== username) {
            return res.status(400).json({ error: 'Username does not match customer ID' });
        }

        const updateQuery = `
            UPDATE customer 
            SET name = ?, phone_number = ?, place = ?, pin_code = ?
            WHERE customer_id = ?
        `;
        db.query(
            updateQuery,
            [name, phone_number, place, pin_code, customer_id],
            (err, result) => {
                if (err) {
                    console.error('Error updating customer:', err);
                    return res.status(500).json({ error: 'Error updating customer' });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Customer not found' });
                }
                res.json({ message: 'Customer updated successfully' });
            }
        );
    });
});

// Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM login WHERE username = ? AND password = ?`;
    db.query(query, [username, password], (err, result) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (result.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
        if (result[0].status === 'inactive') return res.status(403).json({ error: 'Account not approved' });

        const user = result[0];

        if (user.role === 'customer') {
            const customerQuery = `SELECT customer_id, name FROM customer WHERE username = ?`;
            db.query(customerQuery, [username], (err2, result2) => {
                if (err2 || result2.length === 0) {
                    return res.status(500).json({ error: 'Error fetching customer details' });
                }
                const { customer_id, name } = result2[0];
                return res.json({
                    role: user.role,
                    username: user.username,
                    name: name,
                    customer_id: customer_id
                });
            });
        } else if (user.role === 'staff') {
            const staffQuery = `SELECT staff_id, name FROM staff WHERE username = ?`;
            db.query(staffQuery, [username], (err2, result2) => {
                if (err2 || result2.length === 0) {
                    return res.status(500).json({ error: 'Error fetching staff details' });
                }
                const { staff_id, name } = result2[0];
                return res.json({
                    role: user.role,
                    username: user.username,
                    name: name,
                    staff_id: staff_id
                });
            });
        } else {
            return res.json({ role: user.role, username: user.username });
        }
    });
});

// Admin: Fetch all customers
app.get('/api/admin/customers', (req, res) => {
    const query = `
        SELECT c.*, l.status as login_status
        FROM customer c
        JOIN login l ON c.username = l.username
        WHERE l.role = 'customer'
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching customers' });
        res.json(results);
    });
});

// Admin: Approve customer
app.post('/api/admin/approve-customer', (req, res) => {
    const { username } = req.body;
    const query = `UPDATE login SET status = 'active' WHERE username = ? AND role = 'customer'`;
    db.query(query, [username], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error approving customer' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Customer not found' });
        res.json({ message: 'Customer approved successfully' });
    });
});

// Admin: Deactivate customer
app.post('/api/admin/deactivate-customer', (req, res) => {
    const { username } = req.body;
    const query = `UPDATE login SET status = 'inactive' WHERE username = ? AND role = 'customer'`;
    db.query(query, [username], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error deactivating customer' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Customer not found' });
        res.json({ message: 'Customer deactivated successfully' });
    });
});

// Admin: Delete customer
app.delete('/api/admin/delete-customer', (req, res) => {
    const { username } = req.body;
    
    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: 'Error starting transaction' });

        const customerQuery = `DELETE FROM customer WHERE username = ?`;
        db.query(customerQuery, [username], (err1, result1) => {
            if (err1) {
                return db.rollback(() => {
                    res.status(500).json({ error: 'Error deleting customer data' });
                });
            }
            if (result1.affectedRows === 0) {
                return db.rollback(() => {
                    res.status(404).json({ error: 'Customer not found' });
                });
            }

            const loginQuery = `DELETE FROM login WHERE username = ? AND role = 'customer'`;
            db.query(loginQuery, [username], (err2, result2) => {
                if (err2) {
                    return db.rollback(() => {
                        res.status(500).json({ error: 'Error deleting login data' });
                    });
                }

                db.commit((err3) => {
                    if (err3) {
                        return db.rollback(() => {
                            res.status(500).json({ error: 'Error committing transaction' });
                        });
                    }
                    res.json({ message: 'Customer deleted successfully' });
                });
            });
        });
    });
});

// Admin: Assign meter and consumer number
app.post('/api/admin/assign-meter', (req, res) => {
    const { username } = req.body;
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');

    const getLastConsumerQuery = `SELECT consumer_number FROM customer WHERE consumer_number LIKE ? ORDER BY consumer_number DESC LIMIT 1`;
    const consumerPrefix = `BCEL-${currentYear}${currentMonth}`;
    db.query(getLastConsumerQuery, [`${consumerPrefix}%`], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error fetching last consumer number' });

        let newConsumerNumber;
        if (result.length > 0) {
            const lastNumber = parseInt(result[0].consumer_number.slice(-4)) || 0;
            newConsumerNumber = `${consumerPrefix}${String(lastNumber + 1).padStart(4, '0')}`;
        } else {
            newConsumerNumber = `${consumerPrefix}0001`;
        }

        const getLastMeterQuery = `SELECT meter_id FROM customer WHERE meter_id LIKE ? ORDER BY meter_id DESC LIMIT 1`;
        const meterPrefix = `BCEL-${currentYear}`;
        db.query(getLastMeterQuery, [`${meterPrefix}%`], (err2, result2) => {
            if (err2) return res.status(500).json({ error: 'Error fetching last meter ID' });

            let newMeterId;
            if (result2.length > 0) {
                const lastMeterNumber = parseInt(result2[0].meter_id.slice(-3)) || 0;
                newMeterId = `${meterPrefix}${String(lastMeterNumber + 1).padStart(3, '0')}`;
            } else {
                newMeterId = `${meterPrefix}001`;
            }

            const updateQuery = `UPDATE customer SET consumer_number = ?, meter_id = ? WHERE username = ?`;
            db.query(updateQuery, [newConsumerNumber, newMeterId, username], (err3, result3) => {
                if (err3) return res.status(500).json({ error: 'Error assigning meter and consumer number' });
                if (result3.affectedRows === 0) return res.status(404).json({ error: 'Customer not found' });
                res.json({ message: 'Meter and consumer number assigned', consumer_number: newConsumerNumber, meter_id: newMeterId });
            });
        });
    });
});

// Admin: Fetch all staff
app.get('/api/admin/staff', (req, res) => {
    const query = `
        SELECT s.*, l.status as login_status
        FROM staff s
        JOIN login l ON s.username = l.username
        WHERE l.role = 'staff'
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching staff' });
        console.log('Staff data sent:', results);
        res.json(results);
    });
});

// Admin: Add staff
app.post('/api/admin/add-staff', (req, res) => {
    const { username, password, name, contact } = req.body;

    const loginQuery = `INSERT INTO login (username, password, role, status) VALUES (?, ?, 'staff', 'active')`;
    const staffQuery = `INSERT INTO staff (username, name, contact) VALUES (?, ?, ?)`;

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: 'Error starting transaction' });

        db.query(loginQuery, [username, password], (err1) => {
            if (err1) {
                return db.rollback(() => {
                    res.status(400).json({ error: 'Username already exists or invalid' });
                });
            }

            db.query(staffQuery, [username, name, contact], (err2) => {
                if (err2) {
                    return db.rollback(() => {
                        res.status(400).json({ error: 'Error adding staff', details: err2 });
                    });
                }

                db.commit((err3) => {
                    if (err3) {
                        return db.rollback(() => {
                            res.status(500).json({ error: 'Error committing transaction' });
                        });
                    }
                    res.json({ message: 'Staff added successfully' });
                });
            });
        });
    });
});

// Admin: Edit staff
app.put('/api/admin/edit-staff', (req, res) => {
    const { username, name, contact } = req.body;

    const query = `UPDATE staff SET name = ?, contact = ? WHERE username = ?`;
    db.query(query, [name, contact, username], (err, result) => {
        if (err) return res.status(500).json({ error: 'Error updating staff' });
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Staff not found' });
        res.json({ message: 'Staff updated successfully' });
    });
});

// Admin: Delete staff
app.delete('/api/admin/delete-staff', (req, res) => {
    const { username } = req.body;

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: 'Error starting transaction' });

        const staffQuery = `DELETE FROM staff WHERE username = ?`;
        db.query(staffQuery, [username], (err1, result1) => {
            if (err1) {
                return db.rollback(() => {
                    res.status(500).json({ error: 'Error deleting staff data' });
                });
            }
            if (result1.affectedRows === 0) {
                return db.rollback(() => {
                    res.status(404).json({ error: 'Staff not found' });
                });
            }

            const loginQuery = `DELETE FROM login WHERE username = ? AND role = 'staff'`;
            db.query(loginQuery, [username], (err2, result2) => {
                if (err2) {
                    return db.rollback(() => {
                        res.status(500).json({ error: 'Error deleting login data' });
                    });
                }

                db.commit((err3) => {
                    if (err3) {
                        return db.rollback(() => {
                            res.status(500).json({ error: 'Error committing transaction' });
                        });
                    }
                    res.json({ message: 'Staff deleted successfully' });
                });
            });
        });
    });
});

// Admin: Fetch all tariffs
app.get('/api/admin/tariffs', (req, res) => {
    const query = `SELECT tariff_id, tariff_type, unit_from, unit_to, CAST(rate AS DECIMAL(10,2)) AS rate FROM tariffs`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching tariffs:', err);
            return res.status(500).json({ error: 'Error fetching tariffs' });
        }
        console.log('Tariffs sent to frontend:', results);
        res.json(results.map(tariff => ({
            ...tariff,
            rate: Number(tariff.rate)
        })));
    });
});

// Admin: Add tariff
app.post('/api/admin/add-tariff', (req, res) => {
    const { tariff_type, unit_from, unit_to, rate } = req.body;

    if (!['Domestic', 'Commercial', 'Industrial'].includes(tariff_type)) {
        return res.status(400).json({ error: 'Invalid tariff type' });
    }
    if (!Number.isInteger(unit_from) || unit_from < 0) {
        return res.status(400).json({ error: 'Unit From must be a non-negative integer' });
    }
    if (!Number.isInteger(unit_to) || unit_to < unit_from) {
        return res.status(400).json({ error: 'Unit To must be greater than or equal to Unit From' });
    }
    if (typeof rate !== 'number' || rate <= 0) {
        return res.status(400).json({ error: 'Rate must be a positive number' });
    }

    const query = `INSERT INTO tariffs (tariff_type, unit_from, unit_to, rate) VALUES (?, ?, ?, ?)`;
    db.query(query, [tariff_type, unit_from, unit_to, rate], (err, result) => {
        if (err) {
            console.error('Error adding tariff:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Tariff range for this tariff type already exists' });
            }
            return res.status(500).json({ error: 'Error adding tariff', details: err });
        }
        console.log('Tariff added:', { tariff_type, unit_from, unit_to, rate });
        res.json({ message: 'Tariff added successfully' });
    });
});

// Admin: Edit tariff
app.put('/api/admin/edit-tariff', (req, res) => {
    const { tariff_id, tariff_type, unit_from, unit_to, rate } = req.body;

    if (!Number.isInteger(tariff_id)) {
        return res.status(400).json({ error: 'Tariff ID must be an integer' });
    }
    if (!['Domestic', 'Commercial', 'Industrial'].includes(tariff_type)) {
        return res.status(400).json({ error: 'Invalid tariff type' });
    }
    if (!Number.isInteger(unit_from) || unit_from < 0) {
        return res.status(400).json({ error: 'Unit From must be a non-negative integer' });
    }
    if (!Number.isInteger(unit_to) || unit_to < unit_from) {
        return res.status(400).json({ error: 'Unit To must be greater than or equal to Unit From' });
    }
    if (typeof rate !== 'number' || rate <= 0) {
        return res.status(400).json({ error: 'Rate must be a positive number' });
    }

    const query = `UPDATE tariffs SET tariff_type = ?, unit_from = ?, unit_to = ?, rate = ? WHERE tariff_id = ?`;
    db.query(query, [tariff_type, unit_from, unit_to, rate, tariff_id], (err, result) => {
        if (err) {
            console.error('Error updating tariff:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Tariff range for this tariff type already exists' });
            }
            return res.status(500).json({ error: 'Error updating tariff' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Tariff not found' });
        }
        console.log('Tariff updated:', { tariff_id, tariff_type, unit_from, unit_to, rate });
        res.json({ message: 'Tariff updated successfully' });
    });
});

// Admin: Delete tariff
app.delete('/api/admin/delete-tariff', (req, res) => {
    const { tariff_id } = req.body;

    if (!Number.isInteger(tariff_id)) {
        return res.status(400).json({ error: 'Tariff ID must be an integer' });
    }

    const query = `DELETE FROM tariffs WHERE tariff_id = ?`;
    db.query(query, [tariff_id], (err, result) => {
        if (err) {
            console.error('Error deleting tariff:', err);
            return res.status(500).json({ error: 'Error deleting tariff' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Tariff not found' });
        }
        console.log('Tariff deleted:', { tariff_id });
        res.json({ message: 'Tariff deleted successfully' });
    });
});

// Admin: Fetch all extra charges
app.get('/api/admin/extra-charges', (req, res) => {
    const query = `
        SELECT charge_id, tariff_type, 
               CAST(fixed_charge AS DECIMAL(10,2)) AS fixed_charge,
               CAST(meter_rent AS DECIMAL(10,2)) AS meter_rent,
               CAST(electricity_duty AS DECIMAL(10,2)) AS electricity_duty,
               CAST(fuel_charge AS DECIMAL(10,2)) AS fuel_charge
        FROM extra_charges
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching extra charges:', err);
            return res.status(500).json({ error: 'Error fetching extra charges' });
        }
        console.log('Extra charges sent to frontend:', results);
        res.json(results.map(charge => ({
            ...charge,
            fixed_charge: Number(charge.fixed_charge),
            meter_rent: Number(charge.meter_rent),
            electricity_duty: Number(charge.electricity_duty),
            fuel_charge: Number(charge.fuel_charge)
        })));
    });
});

// Admin: Add extra charge
app.post('/api/admin/add-charge', (req, res) => {
    const { tariff_type, fixed_charge, meter_rent, electricity_duty, fuel_charge } = req.body;

    if (!['Domestic', 'Commercial', 'Industrial'].includes(tariff_type)) {
        return res.status(400).json({ error: 'Invalid tariff type' });
    }
    if (typeof fixed_charge !== 'number' || fixed_charge < 0) {
        return res.status(400).json({ error: 'Fixed Charge must be a non-negative number' });
    }
    if (typeof meter_rent !== 'number' || meter_rent < 0) {
        return res.status(400).json({ error: 'Meter Rent must be a non-negative number' });
    }
    if (typeof electricity_duty !== 'number' || electricity_duty < 0) {
        return res.status(400).json({ error: 'Electricity Duty must be a non-negative number' });
    }
    if (typeof fuel_charge !== 'number' || fuel_charge < 0) {
        return res.status(400).json({ error: 'Fuel Charge must be a non-negative number' });
    }

    const query = `
        INSERT INTO extra_charges (tariff_type, fixed_charge, meter_rent, electricity_duty, fuel_charge)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(query, [tariff_type, fixed_charge, meter_rent, electricity_duty, fuel_charge], (err, result) => {
        if (err) {
            console.error('Error adding extra charge:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Tariff type already has extra charges defined' });
            }
            return res.status(500).json({ error: 'Error adding extra charge', details: err });
        }
        console.log('Extra charge added:', { tariff_type, fixed_charge, meter_rent, electricity_duty, fuel_charge });
        res.json({ message: 'Extra charge added successfully' });
    });
});

// Admin: Edit extra charge
app.put('/api/admin/edit-charge', (req, res) => {
    const { charge_id, tariff_type, fixed_charge, meter_rent, electricity_duty, fuel_charge } = req.body;

    if (!Number.isInteger(charge_id)) {
        return res.status(400).json({ error: 'Charge ID must be an integer' });
    }
    if (!['Domestic', 'Commercial', 'Industrial'].includes(tariff_type)) {
        return res.status(400).json({ error: 'Invalid tariff type' });
    }
    if (typeof fixed_charge !== 'number' || fixed_charge < 0) {
        return res.status(400).json({ error: 'Fixed Charge must be a non-negative number' });
    }
    if (typeof meter_rent !== 'number' || meter_rent < 0) {
        return res.status(400).json({ error: 'Meter Rent must be a non-negative number' });
    }
    if (typeof electricity_duty !== 'number' || electricity_duty < 0) {
        return res.status(400).json({ error: 'Electricity Duty must be a non-negative number' });
    }
    if (typeof fuel_charge !== 'number' || fuel_charge < 0) {
        return res.status(400).json({ error: 'Fuel Charge must be a non-negative number' });
    }

    const query = `
        UPDATE extra_charges 
        SET tariff_type = ?, fixed_charge = ?, meter_rent = ?, electricity_duty = ?, fuel_charge = ?
        WHERE charge_id = ?
    `;
    db.query(query, [tariff_type, fixed_charge, meter_rent, electricity_duty, fuel_charge, charge_id], (err, result) => {
        if (err) {
            console.error('Error updating extra charge:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Tariff type already has extra charges defined' });
            }
            return res.status(500).json({ error: 'Error updating extra charge' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Extra charge not found' });
        }
        console.log('Extra charge updated:', { charge_id, tariff_type, fixed_charge, meter_rent, electricity_duty, fuel_charge });
        res.json({ message: 'Extra charge updated successfully' });
    });
});

// Admin: Delete extra charge
app.delete('/api/admin/delete-charge', (req, res) => {
    const { charge_id } = req.body;

    if (!Number.isInteger(charge_id)) {
        return res.status(400).json({ error: 'Charge ID must be an integer' });
    }

    const query = `DELETE FROM extra_charges WHERE charge_id = ?`;
    db.query(query, [charge_id], (err, result) => {
        if (err) {
            console.error('Error deleting extra charge:', err);
            return res.status(500).json({ error: 'Error deleting extra charge' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Extra charge not found' });
        }
        console.log('Extra charge deleted:', { charge_id });
        res.json({ message: 'Extra charge deleted successfully' });
    });
});

// Admin: Fetch customer history including payment details
app.get('/api/admin/customer-history/:customer_id', (req, res) => {
    const { customer_id } = req.params;

    if (!Number.isInteger(Number(customer_id))) {
        return res.status(400).json({ error: 'Customer ID must be an integer' });
    }

    const query = `
        SELECT 
            c.name, c.phone_number, c.consumer_number, c.meter_id, c.tariff_type,
            r.units_consumed, b.bill_id, DATE_FORMAT(b.bill_date, '%Y-%m-%d') AS bill_date,
            DATE_FORMAT(b.due_date, '%Y-%m-%d') AS due_date, b.amount, b.status,
            p.payment_date, p.amount_paid
        FROM customer c
        LEFT JOIN readings r ON c.customer_id = r.customer_id
        LEFT JOIN bills b ON r.reading_id = b.reading_id
        LEFT JOIN payment p ON b.bill_id = p.bill_id
        WHERE c.customer_id = ?
        ORDER BY b.bill_date DESC
    `;
    db.query(query, [customer_id], (err, results) => {
        if (err) {
            console.error('Error fetching customer history:', err);
            return res.status(500).json({ error: 'Error fetching customer history' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(results);
    });
});

// Staff: Add reading and generate bill
app.post('/api/staff/add-reading', (req, res) => {
    const { customer_id, staff_id, units_consumed } = req.body;

    // Validate inputs
    if (!Number.isInteger(customer_id)) {
        return res.status(400).json({ error: 'Customer ID must be an integer' });
    }
    if (!Number.isInteger(staff_id)) {
        return res.status(400).json({ error: 'Staff ID must be an integer' });
    }
    if (!Number.isInteger(units_consumed) || units_consumed < 0) {
        return res.status(400).json({ error: 'Units consumed must be a non-negative integer' });
    }

    // Check if staff exists
    const staffQuery = `SELECT staff_id FROM staff WHERE staff_id = ?`;
    db.query(staffQuery, [staff_id], (err, staffResult) => {
        if (err) {
            console.error('Error checking staff:', err);
            return res.status(500).json({ error: 'Error checking staff' });
        }
        if (staffResult.length === 0) {
            return res.status(404).json({ error: 'Staff not found' });
        }

        // Check if customer exists, has a meter, and get tariff_type
        const customerQuery = `SELECT customer_id, meter_id, tariff_type FROM customer WHERE customer_id = ? AND meter_id IS NOT NULL`;
        db.query(customerQuery, [customer_id], (err1, customerResult) => {
            if (err1) {
                console.error('Error checking customer:', err1);
                return res.status(500).json({ error: 'Error checking customer' });
            }
            if (customerResult.length === 0) {
                return res.status(404).json({ error: 'Customer not found or no meter assigned' });
            }

            const customer = customerResult[0];
            const customerTariffType = customer.tariff_type;
            const reading_date = new Date().toISOString().split('T')[0];

            // Check for existing reading for the same customer and reading_date
            const checkReadingQuery = `SELECT reading_id FROM readings WHERE customer_id = ? AND reading_date = ?`;
            db.query(checkReadingQuery, [customer_id, reading_date], (err2, readingResult) => {
                if (err2) {
                    console.error('Error checking existing reading:', err2);
                    return res.status(500).json({ error: 'Error checking existing reading' });
                }
                if (readingResult.length > 0) {
                    return res.status(400).json({ error: 'Reading already exists for this customer and date' });
                }

                // Fetch tariffs for the customer's tariff_type
                const tariffQuery = `SELECT unit_from, unit_to, rate FROM tariffs WHERE tariff_type = ? ORDER BY unit_from`;
                db.query(tariffQuery, [customerTariffType], (err3, tariffs) => {
                    if (err3) {
                        console.error('Error fetching tariffs:', err3);
                        return res.status(500).json({ error: 'Error fetching tariffs' });
                    }
                    if (tariffs.length === 0) {
                        return res.status(400).json({ error: `No tariffs defined for ${customerTariffType}` });
                    }

                    // Fetch extra charges for the customer's tariff_type
                    const chargesQuery = `SELECT fixed_charge, meter_rent, electricity_duty, fuel_charge FROM extra_charges WHERE tariff_type = ?`;
                    db.query(chargesQuery, [customerTariffType], (err4, chargesResult) => {
                        if (err4) {
                            console.error('Error fetching extra charges:', err4);
                            return res.status(500).json({ error: 'Error fetching extra charges' });
                        }

                        // Calculate bill amount
                        let amount = 0;
                        let remainingUnits = units_consumed;

                        // Calculate tariff-based charges
                        for (const tariff of tariffs) {
                            if (remainingUnits <= 0) break;
                            const unitsInRange = Math.min(
                                remainingUnits,
                                tariff.unit_to === null ? remainingUnits : tariff.unit_to - tariff.unit_from + 1
                            );
                            if (units_consumed >= tariff.unit_from) {
                                amount += unitsInRange * tariff.rate;
                                remainingUnits -= unitsInRange;
                            }
                        }

                        // Add extra charges if available
                        if (chargesResult.length > 0) {
                            const charges = chargesResult[0];
                            amount += Number(charges.fixed_charge) || 0;
                            amount += Number(charges.meter_rent) || 0;
                            amount += Number(charges.electricity_duty) || 0;
                            amount += Number(charges.fuel_charge) || 0;
                        }

                        // Calculate due date (15 days after bill date)
                        const bill_date = new Date();
                        const due_date = new Date(bill_date);
                        due_date.setDate(bill_date.getDate() + 15);
                        const formattedBillDate = bill_date.toISOString().split('T')[0];
                        const formattedDueDate = due_date.toISOString().split('T')[0];

                        // Insert reading
                        db.beginTransaction((err5) => {
                            if (err5) {
                                console.error('Error starting transaction:', err5);
                                return res.status(500).json({ error: 'Error starting transaction' });
                            }

                            const readingQuery = `
                                INSERT INTO readings (customer_id, staff_id, units_consumed, reading_date)
                                VALUES (?, ?, ?, ?)
                            `;
                            db.query(readingQuery, [customer_id, staff_id, units_consumed, reading_date], (err6, readingResult) => {
                                if (err6) {
                                    console.error('Error adding reading:', err6);
                                    return db.rollback(() => {
                                        res.status(500).json({ error: 'Error adding reading' });
                                    });
                                }

                                const reading_id = readingResult.insertId;

                                // Insert bill
                                const billQuery = `
                                    INSERT INTO bills (reading_id, amount, bill_date, due_date, status)
                                    VALUES (?, ?, ?, ?, 'unpaid')
                                `;
                                db.query(billQuery, [reading_id, amount.toFixed(2), formattedBillDate, formattedDueDate], (err7, billResult) => {
                                    if (err7) {
                                        console.error('Error adding bill:', err7);
                                        return db.rollback(() => {
                                            res.status(500).json({ error: 'Error adding bill' });
                                        });
                                    }

                                    db.commit((err8) => {
                                        if (err8) {
                                            console.error('Error committing transaction:', err8);
                                            return db.rollback(() => {
                                                res.status(500).json({ error: 'Error committing transaction' });
                                            });
                                        }
                                        console.log('Reading and bill added:', { reading_id, bill_id: billResult.insertId, amount });
                                        res.json({
                                            message: 'Reading and bill added successfully',
                                            bill_id: billResult.insertId,
                                            amount: amount.toFixed(2)
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Staff: Edit reading and update bill
app.put('/api/staff/edit-reading', (req, res) => {
    const { reading_id, customer_id, staff_id, units_consumed } = req.body;

    // Validate inputs
    if (!Number.isInteger(reading_id)) {
        return res.status(400).json({ error: 'Reading ID must be an integer' });
    }
    if (!Number.isInteger(customer_id)) {
        return res.status(400).json({ error: 'Customer ID must be an integer' });
    }
    if (!Number.isInteger(staff_id)) {
        return res.status(400).json({ error: 'Staff ID must be an integer' });
    }
    if (!Number.isInteger(units_consumed) || units_consumed < 0) {
        return res.status(400).json({ error: 'Units consumed must be a non-negative integer' });
    }

    // Check if staff exists
    const staffQuery = `SELECT staff_id FROM staff WHERE staff_id = ?`;
    db.query(staffQuery, [staff_id], (err, staffResult) => {
        if (err) {
            console.error('Error checking staff:', err);
            return res.status(500).json({ error: 'Error checking staff' });
        }
        if (staffResult.length === 0) {
            return res.status(404).json({ error: 'Staff not found' });
        }

        // Check if customer exists, has a meter, and get tariff_type
        const customerQuery = `SELECT customer_id, meter_id, tariff_type FROM customer WHERE customer_id = ? AND meter_id IS NOT NULL`;
        db.query(customerQuery, [customer_id], (err1, customerResult) => {
            if (err1) {
                console.error('Error checking customer:', err1);
                return res.status(500).json({ error: 'Error checking customer' });
            }
            if (customerResult.length === 0) {
                return res.status(404).json({ error: 'Customer not found or no meter assigned' });
            }

            // Check if reading exists and bill is unpaid
            const readingQuery = `
                SELECT r.reading_id, b.bill_id, b.status
                FROM readings r
                JOIN bills b ON r.reading_id = b.reading_id
                WHERE r.reading_id = ? AND r.customer_id = ?
            `;
            db.query(readingQuery, [reading_id, customer_id], (err2, readingResult) => {
                if (err2) {
                    console.error('Error checking reading:', err2);
                    return res.status(500).json({ error: 'Error checking reading' });
                }
                if (readingResult.length === 0) {
                    return res.status(404).json({ error: 'Reading not found' });
                }
                if (readingResult[0].status === 'paid') {
                    return res.status(400).json({ error: 'Cannot edit paid bills' });
                }

                const bill_id = readingResult[0].bill_id;
                const customer = customerResult[0];
                const customerTariffType = customer.tariff_type;

                // Fetch tariffs for the customer's tariff_type
                const tariffQuery = `SELECT unit_from, unit_to, rate FROM tariffs WHERE tariff_type = ? ORDER BY unit_from`;
                db.query(tariffQuery, [customerTariffType], (err3, tariffs) => {
                    if (err3) {
                        console.error('Error fetching tariffs:', err3);
                        return res.status(500).json({ error: 'Error fetching tariffs' });
                    }
                    if (tariffs.length === 0) {
                        return res.status(400).json({ error: `No tariffs defined for ${customerTariffType}` });
                    }

                    // Fetch extra charges for the customer's tariff_type
                    const chargesQuery = `SELECT fixed_charge, meter_rent, electricity_duty, fuel_charge FROM extra_charges WHERE tariff_type = ?`;
                    db.query(chargesQuery, [customerTariffType], (err4, chargesResult) => {
                        if (err4) {
                            console.error('Error fetching extra charges:', err4);
                            return res.status(500).json({ error: 'Error fetching extra charges' });
                        }

                        // Calculate bill amount
                        let amount = 0;
                        let remainingUnits = units_consumed;

                        // Calculate tariff-based charges
                        for (const tariff of tariffs) {
                            if (remainingUnits <= 0) break;
                            const unitsInRange = Math.min(
                                remainingUnits,
                                tariff.unit_to === null ? remainingUnits : tariff.unit_to - tariff.unit_from + 1
                            );
                            if (units_consumed >= tariff.unit_from) {
                                amount += unitsInRange * tariff.rate;
                                remainingUnits -= unitsInRange;
                            }
                        }

                        // Add extra charges if available
                        if (chargesResult.length > 0) {
                            const charges = chargesResult[0];
                            amount += Number(charges.fixed_charge) || 0;
                            amount += Number(charges.meter_rent) || 0;
                            amount += Number(charges.electricity_duty) || 0;
                            amount += Number(charges.fuel_charge) || 0;
                        }

                        // Update reading and bill in a transaction
                        db.beginTransaction((err5) => {
                            if (err5) {
                                console.error('Error starting transaction:', err5);
                                return res.status(500).json({ error: 'Error starting transaction' });
                            }

                            // Update reading
                            const updateReadingQuery = `
                                UPDATE readings 
                                SET units_consumed = ?, staff_id = ?
                                WHERE reading_id = ? AND customer_id = ?
                            `;
                            db.query(updateReadingQuery, [units_consumed, staff_id, reading_id, customer_id], (err6, readingResult) => {
                                if (err6) {
                                    console.error('Error updating reading:', err6);
                                    return db.rollback(() => {
                                        res.status(500).json({ error: 'Error updating reading' });
                                    });
                                }
                                if (readingResult.affectedRows === 0) {
                                    return db.rollback(() => {
                                        res.status(404).json({ error: 'Reading not found' });
                                    });
                                }

                                // Update bill amount
                                const updateBillQuery = `
                                    UPDATE bills 
                                    SET amount = ?
                                    WHERE bill_id = ? AND reading_id = ?
                                `;
                                db.query(updateBillQuery, [amount.toFixed(2), bill_id, reading_id], (err7, billResult) => {
                                    if (err7) {
                                        console.error('Error updating bill:', err7);
                                        return db.rollback(() => {
                                            res.status(500).json({ error: 'Error updating bill' });
                                        });
                                    }
                                    if (billResult.affectedRows === 0) {
                                        return db.rollback(() => {
                                            res.status(404).json({ error: 'Bill not found' });
                                        });
                                    }

                                    db.commit((err8) => {
                                        if (err8) {
                                            console.error('Error committing transaction:', err8);
                                            return db.rollback(() => {
                                                res.status(500).json({ error: 'Error committing transaction' });
                                            });
                                        }
                                        console.log('Reading and bill updated:', { reading_id, bill_id, amount });
                                        res.json({
                                            message: 'Reading and bill updated successfully',
                                            bill_id: bill_id,
                                            amount: amount.toFixed(2)
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// Staff: Fetch customer details with billing history
app.get('/api/staff/customer-details/:customer_id', (req, res) => {
    const { customer_id } = req.params;

    if (!Number.isInteger(parseInt(customer_id))) {
        return res.status(400).json({ error: 'Customer ID must be an integer' });
    }

    const query = `
        SELECT 
            c.customer_id, c.name, c.phone_number, c.tariff_type, 
            c.consumer_number, c.meter_id,
            r.reading_id, r.units_consumed, r.reading_date,
            b.bill_id, b.amount, b.bill_date, b.due_date, b.status
        FROM customer c
        LEFT JOIN readings r ON c.customer_id = r.customer_id
        LEFT JOIN bills b ON r.reading_id = b.reading_id
        WHERE c.customer_id = ?
        ORDER BY b.bill_date DESC
    `;
    db.query(query, [customer_id], (err, results) => {
        if (err) {
            console.error('Error fetching customer details:', err);
            return res.status(500).json({ error: 'Error fetching customer details' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(results);
    });
});

// Staff: Fetch staff details by staff_id
app.get('/api/staff/:staff_id', (req, res) => {
    const { staff_id } = req.params;

    if (!Number.isInteger(Number(staff_id))) {
        return res.status(400).json({ error: 'Staff ID must be an integer' });
    }

    const query = `
        SELECT s.staff_id, s.username, s.name, s.contact, l.status as login_status
        FROM staff s
        JOIN login l ON s.username = l.username
        WHERE s.staff_id = ? AND l.role = 'staff'
    `;
    db.query(query, [staff_id], (err, results) => {
        if (err) {
            console.error('Error fetching staff details:', err);
            return res.status(500).json({ error: 'Error fetching staff details' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        res.json(results[0]);
    });
});

// Customer: Fetch bills
app.get('/api/customer/bills/:customer_id', (req, res) => {
    const { customer_id } = req.params;

    if (!Number.isInteger(parseInt(customer_id))) {
        return res.status(400).json({ error: 'Customer ID must be an integer' });
    }

    const query = `
        SELECT 
            b.bill_id, b.reading_id, b.amount, b.bill_date, b.due_date, b.status,
            r.units_consumed, r.reading_date,
            c.tariff_type
        FROM bills b
        JOIN readings r ON b.reading_id = r.reading_id
        JOIN customer c ON r.customer_id = c.customer_id
        WHERE r.customer_id = ?
        ORDER BY b.bill_date DESC
    `;
    db.query(query, [customer_id], (err, results) => {
        if (err) {
            console.error('Error fetching bills:', err);
            return res.status(500).json({ error: 'Error fetching bills' });
        }
        res.json(results);
    });
});

// Customer: Pay bill
app.post('/api/customer/pay-bill', (req, res) => {
    const { bill_id, customer_id } = req.body;

    if (!Number.isInteger(bill_id) || !Number.isInteger(customer_id)) {
        return res.status(400).json({ error: 'Bill ID and Customer ID must be integers' });
    }

    // Verify bill BCELongs to customer and is unpaid
    const verifyQuery = `
        SELECT b.bill_id
        FROM bills b
        JOIN readings r ON b.reading_id = r.reading_id
        WHERE b.bill_id = ? AND r.customer_id = ? AND b.status = 'unpaid'
    `;
    db.query(verifyQuery, [bill_id, customer_id], (err, result) => {
        if (err) {
            console.error('Error verifying bill:', err);
            return res.status(500).json({ error: 'Error verifying bill' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Bill not found or already paid' });
        }

        // Update bill status
        const updateQuery = `UPDATE bills SET status = 'paid' WHERE bill_id = ?`;
        db.query(updateQuery, [bill_id], (err2, result2) => {
            if (err2) {
                console.error('Error updating bill status:', err2);
                return res.status(500).json({ error: 'Error updating bill status' });
            }
            if (result2.affectedRows === 0) {
                return res.status(404).json({ error: 'Bill not found' });
            }
            res.json({ message: 'Bill paid successfully' });
        });
    });
});

// Customer: Fetch plan details
app.get('/api/customer/plan/:customer_id', (req, res) => {
    const { customer_id } = req.params;

    if (!Number.isInteger(parseInt(customer_id))) {
        return res.status(400).json({ error: 'Customer ID must be an integer' });
    }

    const customerQuery = `
        SELECT 
            c.customer_id, c.username, c.name, c.address, c.phone_number, 
            c.ration_card, c.aadhar_number, c.consumer_number, c.meter_id, c.tariff_type
        FROM customer c
        WHERE c.customer_id = ?
    `;
    
    const extraChargesQuery = `
        SELECT 
            fixed_charge, meter_rent, electricity_duty, fuel_charge
        FROM extra_charges
        WHERE tariff_type = ?
    `;

    db.query(customerQuery, [customer_id], (err, customerResults) => {
        if (err) {
            console.error('Error fetching customer details:', err);
            return res.status(500).json({ error: 'Error fetching customer details' });
        }
        if (customerResults.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const customer = customerResults[0];

        db.query(extraChargesQuery, [customer.tariff_type], (err2, chargesResults) => {
            if (err2) {
                console.error('Error fetching extra charges:', err2);
                return res.status(500).json({ error: 'Error fetching extra charges' });
            }

            const extraCharges = chargesResults.length > 0 ? {
                fixed_charge: Number(chargesResults[0].fixed_charge),
                meter_rent: Number(chargesResults[0].meter_rent),
                electricity_duty: Number(chargesResults[0].electricity_duty),
                fuel_charge: Number(chargesResults[0].fuel_charge)
            } : null;

            res.json({
                customer,
                extraCharges
            });
        });
    });
});

// Public: Fetch all tariffs
app.get('/api/tariffs', (req, res) => {
    const query = `SELECT tariff_id, tariff_type, unit_from, unit_to, CAST(rate AS DECIMAL(10,2)) AS rate FROM tariffs`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching tariffs:', err);
            return res.status(500).json({ error: 'Error fetching tariffs' });
        }
        res.json(results.map(tariff => ({
            ...tariff,
            rate: Number(tariff.rate)
        })));
    });
});

// Public: Fetch all extra charges
app.get('/api/extra-charges', (req, res) => {
    const query = `
        SELECT charge_id, tariff_type, 
               CAST(fixed_charge AS DECIMAL(10,2)) AS fixed_charge,
               CAST(meter_rent AS DECIMAL(10,2)) AS meter_rent,
               CAST(electricity_duty AS DECIMAL(10,2)) AS electricity_duty,
               CAST(fuel_charge AS DECIMAL(10,2)) AS fuel_charge
        FROM extra_charges
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching extra charges:', err);
            return res.status(500).json({ error: 'Error fetching extra charges' });
        }
        res.json(results.map(charge => ({
            ...charge,
            fixed_charge: Number(charge.fixed_charge),
            meter_rent: Number(charge.meter_rent),
            electricity_duty: Number(charge.electricity_duty),
            fuel_charge: Number(charge.fuel_charge)
        })));
    });
});

// Admin: Fetch all fine slabs
app.get('/api/admin/fines', (req, res) => {
    const query = `SELECT slab_id, days_from, days_to, CAST(fine_amount AS DECIMAL(10,2)) AS fine_amount FROM fine_slabs`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching fines:', err);
            return res.status(500).json({ error: 'Error fetching fines' });
        }
        console.log('Fines sent to frontend:', results);
        res.json(results.map(fine => ({
            ...fine,
            fine_amount: Number(fine.fine_amount)
        })));
    });
});

// Admin: Add fine slab
app.post('/api/admin/add-fine', (req, res) => {
    const { days_from, days_to, fine_amount } = req.body;

    if (!Number.isInteger(days_from) || days_from < 0) {
        return res.status(400).json({ error: 'Days From must be a non-negative integer' });
    }
    if (!Number.isInteger(days_to) || days_to < days_from) {
        return res.status(400).json({ error: 'Days To must be greater than or equal to Days From' });
    }
    if (typeof fine_amount !== 'number' || fine_amount < 0) {
        return res.status(400).json({ error: 'Fine Amount must be a non-negative number' });
    }

    const query = `INSERT INTO fine_slabs (days_from, days_to, fine_amount) VALUES (?, ?, ?)`;
    db.query(query, [days_from, days_to, fine_amount], (err, result) => {
        if (err) {
            console.error('Error adding fine:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Fine slab range already exists' });
            }
            return res.status(500).json({ error: 'Error adding fine', details: err });
        }
        console.log('Fine added:', { days_from, days_to, fine_amount });
        res.json({ message: 'Fine added successfully' });
    });
});

// Admin: Edit fine slab
app.put('/api/admin/edit-fine', (req, res) => {
    const { slab_id, days_from, days_to, fine_amount } = req.body;

    if (!Number.isInteger(slab_id)) {
        return res.status(400).json({ error: 'Slab ID must be an integer' });
    }
    if (!Number.isInteger(days_from) || days_from < 0) {
        return res.status(400).json({ error: 'Days From must be a non-negative integer' });
    }
    if (!Number.isInteger(days_to) || days_to < days_from) {
        return res.status(400).json({ error: 'Days To must be greater than or equal to Days From' });
    }
    if (typeof fine_amount !== 'number' || fine_amount < 0) {
        return res.status(400).json({ error: 'Fine Amount must be a non-negative number' });
    }

    const query = `UPDATE fine_slabs SET days_from = ?, days_to = ?, fine_amount = ? WHERE slab_id = ?`;
    db.query(query, [days_from, days_to, fine_amount, slab_id], (err, result) => {
        if (err) {
            console.error('Error updating fine:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Fine slab range already exists' });
            }
            return res.status(500).json({ error: 'Error updating fine' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Fine slab not found' });
        }
        console.log('Fine updated:', { slab_id, days_from, days_to, fine_amount });
        res.json({ message: 'Fine updated successfully' });
    });
});

// Admin: Delete fine slab
app.delete('/api/admin/delete-fine', (req, res) => {
    const { slab_id } = req.body;

    if (!Number.isInteger(slab_id)) {
        return res.status(400).json({ error: 'Slab ID must be an integer' });
    }

    const query = `DELETE FROM fine_slabs WHERE slab_id = ?`;
    db.query(query, [slab_id], (err, result) => {
        if (err) {
            console.error('Error deleting fine:', err);
            return res.status(500).json({ error: 'Error deleting fine' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Fine slab not found' });
        }
        console.log('Fine deleted:', { slab_id });
        res.json({ message: 'Fine deleted successfully' });
    });
});

// 
// 
// 



// Customer: Fetch bill for specific year and month
app.get('/api/customer/bill/:customer_id/:year/:month', (req, res) => {
    const { customer_id, year, month } = req.params;
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0]; // Last day of the month

    if (!Number.isInteger(parseInt(customer_id)) || !Number.isInteger(parseInt(year)) || !Number.isInteger(parseInt(month))) {
        console.error(`Invalid parameters: customer_id=${customer_id}, year=${year}, month=${month}`);
        return res.status(400).json({ error: 'Customer ID, Year, and Month must be integers' });
    }

    const query = `
        SELECT 
            c.customer_id, c.name, c.phone_number, c.consumer_number, c.meter_id, c.tariff_type,
            r.reading_id, r.units_consumed, r.reading_date,
            b.bill_id, b.bill_number, b.amount, b.bill_date, b.due_date, b.status,
            ec.fixed_charge, ec.meter_rent, ec.electricity_duty, ec.fuel_charge
        FROM customer c
        LEFT JOIN readings r ON c.customer_id = r.customer_id
        LEFT JOIN bills b ON r.reading_id = b.reading_id
        LEFT JOIN extra_charges ec ON c.tariff_type = ec.tariff_type
        WHERE c.customer_id = ? 
        AND b.bill_date >= ?
        AND b.bill_date <= ?
        ORDER BY b.bill_date DESC
        LIMIT 1
    `;

    db.query(query, [customer_id, startDate, endDate], (err, results) => {
        if (err) {
            console.error('Error executing bill query:', err);
            return res.status(500).json({ error: 'Error fetching bill', details: err.message });
        }

        if (results.length === 0) {
            console.log(`No bill found for customer_id: ${customer_id} in ${year}-${month}`);
            return res.json(null);
        }

        const billData = results[0];
        console.log('Bill data retrieved:', billData);

        // Generate bill_number if missing
        if (!billData.bill_number) {
            generateBillNumber(new Date(billData.bill_date), (err, newBillNumber) => {
                if (err) {
                    console.error('Error generating bill number:', err);
                    return res.status(500).json({ error: 'Failed to generate bill number' });
                }
                const updateBillNumberQuery = `UPDATE bills SET bill_number = ? WHERE bill_id = ?`;
                db.query(updateBillNumberQuery, [newBillNumber, billData.bill_id], (err) => {
                    if (err) {
                        console.error('Error updating bill number:', err);
                        return res.status(500).json({ error: 'Failed to update bill number' });
                    }
                    proceedWithResponse(newBillNumber);
                });
            });
        } else {
            proceedWithResponse(billData.bill_number);
        }

        function proceedWithResponse(billNumber) {
            const fineQuery = `SELECT days_from, days_to, fine_amount FROM fine_slabs`;
            db.query(fineQuery, (err2, fineResults) => {
                if (err2) {
                    console.error('Error executing fine query:', err2);
                    return res.status(500).json({ error: 'Error fetching fine slabs', details: err2.message });
                }

                let fine = null;
                const currentDate = new Date().toISOString().split('T')[0];
                if (billData.status === 'unpaid' && new Date(currentDate) > new Date(billData.due_date)) {
                    const daysLate = Math.ceil((new Date(currentDate) - new Date(billData.due_date)) / (1000 * 60 * 60 * 24));
                    fine = fineResults.find(slab => daysLate >= slab.days_from && (daysLate <= slab.days_to || slab.days_to === null));
                    if (fine) {
                        fine = { days_late: daysLate, fine_amount: Number(fine.fine_amount) };
                        console.log(`Fine applied: ${fine.fine_amount} for ${daysLate} days late`);
                    } else {
                        console.log(`No applicable fine slab for ${daysLate} days late`);
                    }
                } else {
                    console.log('No fine applied: Bill is paid or not past due');
                }

                res.json({
                    customer: {
                        customer_id: billData.customer_id,
                        name: billData.name,
                        phone_number: billData.phone_number,
                        consumer_number: billData.consumer_number,
                        meter_id: billData.meter_id,
                        tariff_type: billData.tariff_type
                    },
                    bill_details: {
                        bill_id: billData.bill_id,
                        bill_number: billNumber,
                        reading_id: billData.reading_id,
                        units_consumed: billData.units_consumed,
                        reading_date: billData.reading_date,
                        bill_date: billData.bill_date,
                        due_date: billData.due_date,
                        amount: Number(billData.amount),
                        status: billData.status
                    },
                    extra_charges: {
                        fixed_charge: Number(billData.fixed_charge) || 0,
                        meter_rent: Number(billData.meter_rent) || 0,
                        electricity_duty: Number(billData.electricity_duty) || 0,
                        fuel_charge: Number(billData.fuel_charge) || 0
                    },
                    fine: fine || null
                });
            });
        }
    });
});


// Customer: Fetch profile details
app.get('/api/customer/fetch-profile/:customer_id', (req, res) => {
    const { customer_id } = req.params;

    if (!Number.isInteger(parseInt(customer_id))) {
        return res.status(400).json({ error: 'Customer ID must be an integer' });
    }

    const query = `
        SELECT *
        FROM customer 
        WHERE customer_id = ?
    `;

    db.query(query, [customer_id], (err, results) => {
        if (err) {
            console.error('Error fetching profile:', err);
            return res.status(500).json({ error: 'Error fetching profile' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(results[0]);
    });
});

// Customer: Update profile
app.put('/api/customer/update-profile/:customer_id', (req, res) => {
  const { customer_id } = req.params;
  const { name, address, phone_number, place, pin_code } = req.body;

  // Validate inputs
  if (!Number.isInteger(parseInt(customer_id))) {
    return res.status(400).json({ error: 'Customer ID must be an integer' });
  }
  if (!name || name.length < 3) {
    return res.status(400).json({ error: 'Name must be at least 3 characters long' });
  }
  if (!address || address.length < 5) {
    return res.status(400).json({ error: 'Address must be at least 5 characters long' });
  }
  if (!phone_number || !/^[0-9]{10}$/.test(phone_number)) {
    return res.status(400).json({ error: 'Phone number must be a valid 10-digit number' });
  }
  if (!place || place.length < 3) {
    return res.status(400).json({ error: 'Place must be at least 3 characters long' });
  }
  if (!pin_code || !/^[1-9][0-9]{5}$/.test(pin_code)) {
    return res.status(400).json({ error: 'Pin code must be a valid 6-digit number' });
  }

  const query = `
    UPDATE customer 
    SET name = ?, address = ?, phone_number = ?, place = ?, pin_code = ?
    WHERE customer_id = ?
  `;
  db.query(
    query,
    [name, address, phone_number, place, pin_code, customer_id],
    (err, result) => {
      if (err) {
        console.error('Error updating profile:', err);
        return res.status(500).json({ error: 'Error updating profile' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json({ message: 'Profile updated successfully' });
    }
  );
});



// Admin: Fetch dashboard data
app.get('/api/admin/dashboard', (req, res) => {
    const queries = {
        totalCustomers: `SELECT COUNT(*) AS count FROM customer`,
        activeCustomers: `SELECT COUNT(*) AS count FROM customer c JOIN login l ON c.username = l.username WHERE l.status = 'active' AND l.role = 'customer'`,
        totalStaff: `SELECT COUNT(*) AS count FROM staff`,
        totalIncome: `SELECT COALESCE(SUM(b.amount), 0) AS total FROM bills b WHERE b.status = 'paid'`,
        recentBills: `
            SELECT b.bill_id, b.amount, b.bill_date, b.status, c.name AS customer_name
            FROM bills b
            JOIN readings r ON b.reading_id = r.reading_id
            JOIN customer c ON r.customer_id = c.customer_id
            ORDER BY b.bill_date DESC
            LIMIT 5
        `,
        monthlyIncome: `
            SELECT YEAR(b.bill_date) AS year, MONTH(b.bill_date) AS month, COALESCE(SUM(b.amount), 0) AS total_amount
            FROM bills b
            WHERE b.status = 'paid'
            GROUP BY YEAR(b.bill_date), MONTH(b.bill_date)
            ORDER BY year DESC, month DESC
            LIMIT 6
        `,
        customerGrowth: `
            SELECT tariff_type, COUNT(*) AS count
            FROM customer
            GROUP BY tariff_type
        `
    };

    const results = {};

    const executeQuery = (key, query) => {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    console.error(`Error fetching ${key}:`, err);
                    return reject(err);
                }
                results[key] = key === 'recentBills' || key === 'monthlyIncome' || key === 'customerGrowth'
                    ? result
                    : result[0].count || result[0].total || 0;
                resolve();
            });
        });
    };

    Promise.all(Object.entries(queries).map(([key, query]) => executeQuery(key, query)))
        .then(() => {
            res.json({
                totalCustomers: Number(results.totalCustomers),
                activeCustomers: Number(results.activeCustomers),
                totalStaff: Number(results.totalStaff),
                totalIncome: Number(results.totalIncome),
                recentBills: results.recentBills.map(bill => ({
                    bill_id: bill.bill_id,
                    customer_name: bill.customer_name,
                    amount: Number(bill.amount),
                    bill_date: bill.bill_date,
                    status: bill.status
                })),
                monthlyIncome: results.monthlyIncome.map(item => ({
                    year: item.year,
                    month: String(item.month).padStart(2, '0'),
                    total_amount: Number(item.total_amount)
                })),
                customerGrowth: results.customerGrowth.map(item => ({
                    tariff_type: item.tariff_type,
                    count: Number(item.count)
                }))
            });
        })
        .catch(err => {
            res.status(500).json({ error: 'Error fetching dashboard data' });
        });
});




const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs

// Helper function to generate bill_number in format BCEL-YYMMXXX
const generateBillNumber = (billDate, callback) => {
  const year = billDate.getFullYear().toString().slice(-2); // Last two digits of year (e.g., '25' for 2025)
  const month = String(billDate.getMonth() + 1).padStart(2, '0'); // Two-digit month (e.g., '07')
  const prefix = `BCEL-${year}${month}`; // e.g., BCEL-2507

  // Query to find the highest XXX for the current year and month
  const query = `SELECT bill_number FROM bills WHERE bill_number LIKE ? ORDER BY bill_number DESC LIMIT 1`;
  db.query(query, [`${prefix}%`], (err, results) => {
    if (err) {
      console.error('Error fetching bill number:', err);
      return callback(err);
    }

    let nextNumber = '001'; // Default if no bills exist for this year/month
    if (results.length > 0) {
      const lastBillNumber = results[0].bill_number; // e.g., BCEL-2507001
      const lastNumber = parseInt(lastBillNumber.slice(-3), 10); // Extract XXX
      nextNumber = String(lastNumber + 1).padStart(3, '0'); // Increment and pad (e.g., 002)
    }

    const billNumber = `${prefix}${nextNumber}`; // e.g., BCEL-2507002
    callback(null, billNumber);
  });
};

// Endpoint to create a new bill with bill_number
app.post('/api/bills/create', (req, res) => {
  const { reading_id, amount, bill_date, due_date } = req.body;

  if (!reading_id || !amount || !bill_date || !due_date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  generateBillNumber(new Date(bill_date), (err, billNumber) => {
    if (err) {
      console.error('Error generating bill number:', err);
      return res.status(500).json({ error: 'Failed to generate bill number' });
    }

    const insertBillQuery = `
      INSERT INTO bills (reading_id, bill_number, amount, bill_date, due_date, status)
      VALUES (?, ?, ?, ?, ?, 'unpaid')
    `;
    db.query(insertBillQuery, [reading_id, billNumber, amount, bill_date, due_date], (err, result) => {
      if (err) {
        console.error('Error inserting bill:', err);
        return res.status(500).json({ error: 'Failed to create bill' });
      }
      res.json({ bill_id: result.insertId, bill_number: billNumber });
    });
  });
});

// Endpoint to verify and record payment
app.post('/api/customer/verify-payment', (req, res) => {
  const { payment_id, bill_id, customer_id, amount, fine } = req.body;

  if (!payment_id || !bill_id || !customer_id || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if bill exists and is unpaid
  const checkBillQuery = `SELECT bill_number, status FROM bills WHERE bill_id = ? AND status = 'unpaid'`;
  db.query(checkBillQuery, [bill_id], (err, billResults) => {
    if (err) {
      console.error('Error checking bill:', err);
      return res.status(500).json({ error: 'Server error' });
    }

    if (billResults.length === 0) {
      return res.status(400).json({ error: 'Bill not found or already paid' });
    }

    const billNumber = billResults[0].bill_number;
    // Optionally generate bill_number if missing (fallback)
    if (!billNumber) {
      generateBillNumber(new Date(), (err, newBillNumber) => {
        if (err) {
          console.error('Error generating bill number:', err);
          return res.status(500).json({ error: 'Failed to generate bill number' });
        }
        const updateBillNumberQuery = `UPDATE bills SET bill_number = ? WHERE bill_id = ?`;
        db.query(updateBillNumberQuery, [newBillNumber, bill_id], (err) => {
          if (err) {
            console.error('Error updating bill number:', err);
            return res.status(500).json({ error: 'Failed to update bill number' });
          }
          proceedWithPayment(newBillNumber);
        });
      });
    } else {
      proceedWithPayment(billNumber);
    }

    // Helper function to proceed with payment processing
    function proceedWithPayment(billNumber) {
      // Check if payment already exists for this bill
      const checkPaymentQuery = `SELECT * FROM payment WHERE bill_id = ?`;
      db.query(checkPaymentQuery, [bill_id], (err, paymentResults) => {
        if (err) {
          console.error('Error checking payment:', err);
          return res.status(500).json({ error: 'Server error' });
        }

        if (paymentResults.length > 0) {
          return res.status(400).json({ error: 'Payment already recorded for this bill' });
        }

        // Placeholder for actual UPI status API call
        // Example: const upiStatus = await checkUPIStatus(payment_id);
        const isPaymentSuccessful = true; // Simulated success

        if (isPaymentSuccessful) {
          const insertPaymentQuery = `
            INSERT INTO payment (bill_id, customer_id, bill_amount, fine, amount_paid, payment_date)
            VALUES (?, ?, ?, ?, ?, NOW())
          `;
          const amountToBePaid = parseFloat(amount) + parseFloat(fine || 0);

          db.query(insertPaymentQuery, [bill_id, customer_id, amount, fine || 0, amountToBePaid], (err) => {
            if (err) {
              console.error('Error inserting payment:', err);
              return res.status(500).json({ error: 'Failed to record payment' });
            }

            const updateBillQuery = `UPDATE bills SET status = 'paid' WHERE bill_id = ?`;
            db.query(updateBillQuery, [bill_id], (err) => {
              if (err) {
                console.error('Error updating bill:', err);
                return res.status(500).json({ error: 'Failed to update bill status' });
              }
              res.json({ success: true, message: 'Payment verified and bill updated', bill_number: billNumber });
            });
          });
        } else {
          res.status(400).json({ error: 'Payment not completed' });
        }
      });
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});