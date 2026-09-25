require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("./database");

const app = express();

const PORT = process.env.PORT || 5000;
const JWT_SECRET =
  process.env.JWT_SECRET || "travel_cloud_secure_secret_2026";

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message:
      "Cloud-Based Travel Itinerary Management System API is running!",
    database: "SQLite",
    project: "TravelCloud",
  });
});

// ======================================================
// JWT AUTHENTICATION MIDDLEWARE
// ======================================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication token required.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Invalid authentication token.",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid or expired token.",
      });
    }

    req.user = user;
    next();
  });
}

// ======================================================
// AUTH - REGISTER
// ======================================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    db.get(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail],
      async (err, existingUser) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Database error.",
          });
        }

        if (existingUser) {
          return res.status(409).json({
            message: "An account with this email already exists.",
          });
        }

        try {
          const hashedPassword = await bcrypt.hash(
            password,
            10
          );

          db.run(
            `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
            `,
            [name.trim(), normalizedEmail, hashedPassword],
            function (insertErr) {
              if (insertErr) {
                console.error(insertErr);

                return res.status(500).json({
                  message: "Unable to create account.",
                });
              }

              const user = {
                id: this.lastID,
                name: name.trim(),
                email: normalizedEmail,
              };

              const token = jwt.sign(
                {
                  id: user.id,
                  email: user.email,
                },
                JWT_SECRET,
                { expiresIn: "7d" }
              );

              res.status(201).json({
                message: "Account created successfully.",
                token,
                user,
              });
            }
          );
        } catch (hashError) {
          console.error(hashError);

          return res.status(500).json({
            message: "Password processing failed.",
          });
        }
      }
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed.",
    });
  }
});

// ======================================================
// AUTH - LOGIN
// ======================================================

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  db.get(
    `
    SELECT *
    FROM users
    WHERE email = ?
    `,
    [normalizedEmail],
    async (err, user) => {
      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Database error.",
        });
      }

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }

      try {
        const passwordMatch = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordMatch) {
          return res.status(401).json({
            message: "Invalid email or password.",
          });
        }

        const safeUser = {
          id: user.id,
          name: user.name,
          email: user.email,
        };

        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        res.json({
          message: "Login successful.",
          token,
          user: safeUser,
        });
      } catch (error) {
        console.error(error);

        res.status(500).json({
          message: "Login failed.",
        });
      }
    }
  );
});

// ======================================================
// AUTH - GET PROFILE
// ======================================================

app.get(
  "/api/auth/profile",
  authenticateToken,
  (req, res) => {
    db.get(
      `
      SELECT id, name, email, created_at
      FROM users
      WHERE id = ?
      `,
      [req.user.id],
      (err, user) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Database error.",
          });
        }

        if (!user) {
          return res.status(404).json({
            message: "User not found.",
          });
        }

        res.json({
          user,
        });
      }
    );
  }
);

// ======================================================
// AUTH - UPDATE PROFILE
// ======================================================

app.put(
  "/api/auth/profile",
  authenticateToken,
  (req, res) => {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Name is required.",
      });
    }

    db.run(
      `
      UPDATE users
      SET name = ?
      WHERE id = ?
      `,
      [name.trim(), req.user.id],
      function (err) {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Unable to update profile.",
          });
        }

        db.get(
          `
          SELECT id, name, email, created_at
          FROM users
          WHERE id = ?
          `,
          [req.user.id],
          (selectErr, user) => {
            if (selectErr) {
              console.error(selectErr);

              return res.status(500).json({
                message: "Unable to load updated profile.",
              });
            }

            res.json({
              message: "Profile updated successfully.",
              user,
            });
          }
        );
      }
    );
  }
);

// ======================================================
// TRIPS - CREATE
// ======================================================

app.post(
  "/api/trips",
  authenticateToken,
  (req, res) => {
    const {
      trip_name,
      destination,
      start_date,
      end_date,
      travelers,
      budget,
      travel_type,
      description,
      status,
    } = req.body;

    if (
      !trip_name ||
      !destination ||
      !start_date ||
      !end_date
    ) {
      return res.status(400).json({
        message:
          "Trip name, destination, start date and end date are required.",
      });
    }

    db.run(
      `
      INSERT INTO trips
      (
        user_id,
        trip_name,
        destination,
        start_date,
        end_date,
        travelers,
        budget,
        travel_type,
        description,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        req.user.id,
        trip_name,
        destination,
        start_date,
        end_date,
        Number(travelers) || 1,
        Number(budget) || 0,
        travel_type || "Leisure",
        description || "",
        status || "Planned",
      ],
      function (err) {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Unable to create trip.",
          });
        }

        db.get(
          `
          SELECT *
          FROM trips
          WHERE id = ?
          `,
          [this.lastID],
          (selectErr, trip) => {
            if (selectErr) {
              console.error(selectErr);

              return res.status(500).json({
                message: "Trip created but could not be loaded.",
              });
            }

            res.status(201).json({
              message: "Trip created successfully.",
              trip,
            });
          }
        );
      }
    );
  }
);

// ======================================================
// TRIPS - GET ALL USER TRIPS
// ======================================================

app.get(
  "/api/trips",
  authenticateToken,
  (req, res) => {
    db.all(
      `
      SELECT *
      FROM trips
      WHERE user_id = ?
      ORDER BY start_date ASC, id DESC
      `,
      [req.user.id],
      (err, trips) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Unable to load trips.",
          });
        }

        res.json(trips);
      }
    );
  }
);

// ======================================================
// TRIPS - GET SINGLE TRIP
// ======================================================

app.get(
  "/api/trips/:id",
  authenticateToken,
  (req, res) => {
    db.get(
      `
      SELECT *
      FROM trips
      WHERE id = ? AND user_id = ?
      `,
      [req.params.id, req.user.id],
      (err, trip) => {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Database error.",
          });
        }

        if (!trip) {
          return res.status(404).json({
            message: "Trip not found.",
          });
        }

        res.json(trip);
      }
    );
  }
);

// ======================================================
// TRIPS - UPDATE
// ======================================================

app.put(
  "/api/trips/:id",
  authenticateToken,
  (req, res) => {
    const {
      trip_name,
      destination,
      start_date,
      end_date,
      travelers,
      budget,
      travel_type,
      description,
      status,
    } = req.body;

    if (
      !trip_name ||
      !destination ||
      !start_date ||
      !end_date
    ) {
      return res.status(400).json({
        message:
          "Trip name, destination, start date and end date are required.",
      });
    }

    db.run(
      `
      UPDATE trips
      SET
        trip_name = ?,
        destination = ?,
        start_date = ?,
        end_date = ?,
        travelers = ?,
        budget = ?,
        travel_type = ?,
        description = ?,
        status = ?
      WHERE id = ? AND user_id = ?
      `,
      [
        trip_name,
        destination,
        start_date,
        end_date,
        Number(travelers) || 1,
        Number(budget) || 0,
        travel_type || "Leisure",
        description || "",
        status || "Planned",
        req.params.id,
        req.user.id,
      ],
      function (err) {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Unable to update trip.",
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            message: "Trip not found.",
          });
        }

        db.get(
          `
          SELECT *
          FROM trips
          WHERE id = ? AND user_id = ?
          `,
          [req.params.id, req.user.id],
          (selectErr, trip) => {
            if (selectErr) {
              console.error(selectErr);

              return res.status(500).json({
                message: "Unable to load updated trip.",
              });
            }

            res.json({
              message: "Trip updated successfully.",
              trip,
            });
          }
        );
      }
    );
  }
);

// ======================================================
// TRIPS - DELETE
// ======================================================

app.delete(
  "/api/trips/:id",
  authenticateToken,
  (req, res) => {
    const tripId = req.params.id;

    db.get(
      `
      SELECT id
      FROM trips
      WHERE id = ? AND user_id = ?
      `,
      [tripId, req.user.id],
      (findErr, trip) => {
        if (findErr) {
          console.error(findErr);

          return res.status(500).json({
            message: "Database error.",
          });
        }

        if (!trip) {
          return res.status(404).json({
            message: "Trip not found.",
          });
        }

        db.serialize(() => {
          db.run(
            `
            DELETE FROM itinerary
            WHERE trip_id = ?
            `,
            [tripId]
          );

          db.run(
            `
            DELETE FROM expenses
            WHERE trip_id = ?
            `,
            [tripId]
          );

          db.run(
            `
            DELETE FROM trips
            WHERE id = ? AND user_id = ?
            `,
            [tripId, req.user.id],
            function (deleteErr) {
              if (deleteErr) {
                console.error(deleteErr);

                return res.status(500).json({
                  message: "Unable to delete trip.",
                });
              }

              res.json({
                message: "Trip deleted successfully.",
              });
            }
          );
        });
      }
    );
  }
);

// ======================================================
// ITINERARY - CREATE
// ======================================================

app.post(
  "/api/itinerary",
  authenticateToken,
  (req, res) => {
    const {
      trip_id,
      day_number,
      activity,
      time,
      location,
      notes,
    } = req.body;

    if (!trip_id || !day_number || !activity) {
      return res.status(400).json({
        message:
          "Trip, day number and activity are required.",
      });
    }

    db.get(
      `
      SELECT id
      FROM trips
      WHERE id = ? AND user_id = ?
      `,
      [trip_id, req.user.id],
      (tripErr, trip) => {
        if (tripErr) {
          console.error(tripErr);

          return res.status(500).json({
            message: "Database error.",
          });
        }

        if (!trip) {
          return res.status(404).json({
            message: "Trip not found.",
          });
        }

        db.run(
          `
          INSERT INTO itinerary
          (
            trip_id,
            day_number,
            activity,
            time,
            location,
            notes
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            trip_id,
            Number(day_number),
            activity,
            time || "",
            location || "",
            notes || "",
          ],
          function (err) {
            if (err) {
              console.error(err);

              return res.status(500).json({
                message: "Unable to add itinerary activity.",
              });
            }

            res.status(201).json({
              message: "Activity added successfully.",
              id: this.lastID,
            });
          }
        );
      }
    );
  }
);

// ======================================================
// ITINERARY - GET BY TRIP
// ======================================================

app.get(
  "/api/itinerary/:tripId",
  authenticateToken,
  (req, res) => {
    db.get(
      `
      SELECT id
      FROM trips
      WHERE id = ? AND user_id = ?
      `,
      [req.params.tripId, req.user.id],
      (tripErr, trip) => {
        if (tripErr) {
          console.error(tripErr);

          return res.status(500).json({
            message: "Database error.",
          });
        }

        if (!trip) {
          return res.status(404).json({
            message: "Trip not found.",
          });
        }

        db.all(
          `
          SELECT *
          FROM itinerary
          WHERE trip_id = ?
          ORDER BY day_number ASC, id ASC
          `,
          [req.params.tripId],
          (err, items) => {
            if (err) {
              console.error(err);

              return res.status(500).json({
                message: "Unable to load itinerary.",
              });
            }

            res.json(items);
          }
        );
      }
    );
  }
);

// ======================================================
// ITINERARY - DELETE
// ======================================================

app.delete(
  "/api/itinerary/:id",
  authenticateToken,
  (req, res) => {
    db.run(
      `
      DELETE FROM itinerary
      WHERE id = ?
      AND trip_id IN (
        SELECT id
        FROM trips
        WHERE user_id = ?
      )
      `,
      [req.params.id, req.user.id],
      function (err) {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Unable to delete itinerary activity.",
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            message: "Itinerary activity not found.",
          });
        }

        res.json({
          message: "Itinerary activity deleted successfully.",
        });
      }
    );
  }
);

// ======================================================
// EXPENSES - CREATE
// ======================================================

app.post(
  "/api/expenses",
  authenticateToken,
  (req, res) => {
    const {
      trip_id,
      category,
      description,
      amount,
      expense_date,
    } = req.body;

    if (!trip_id || !category || !amount) {
      return res.status(400).json({
        message:
          "Trip, category and amount are required.",
      });
    }

    db.get(
      `
      SELECT id
      FROM trips
      WHERE id = ? AND user_id = ?
      `,
      [trip_id, req.user.id],
      (tripErr, trip) => {
        if (tripErr) {
          console.error(tripErr);

          return res.status(500).json({
            message: "Database error.",
          });
        }

        if (!trip) {
          return res.status(404).json({
            message: "Trip not found.",
          });
        }

        db.run(
          `
          INSERT INTO expenses
          (
            trip_id,
            category,
            description,
            amount,
            expense_date
          )
          VALUES (?, ?, ?, ?, ?)
          `,
          [
            trip_id,
            category,
            description || "",
            Number(amount),
            expense_date || "",
          ],
          function (err) {
            if (err) {
              console.error(err);

              return res.status(500).json({
                message: "Unable to add expense.",
              });
            }

            res.status(201).json({
              message: "Expense added successfully.",
              id: this.lastID,
            });
          }
        );
      }
    );
  }
);

// ======================================================
// EXPENSES - GET BY TRIP
// ======================================================

app.get(
  "/api/expenses/:tripId",
  authenticateToken,
  (req, res) => {
    db.get(
      `
      SELECT id
      FROM trips
      WHERE id = ? AND user_id = ?
      `,
      [req.params.tripId, req.user.id],
      (tripErr, trip) => {
        if (tripErr) {
          console.error(tripErr);

          return res.status(500).json({
            message: "Database error.",
          });
        }

        if (!trip) {
          return res.status(404).json({
            message: "Trip not found.",
          });
        }

        db.all(
          `
          SELECT *
          FROM expenses
          WHERE trip_id = ?
          ORDER BY expense_date DESC, id DESC
          `,
          [req.params.tripId],
          (err, expenses) => {
            if (err) {
              console.error(err);

              return res.status(500).json({
                message: "Unable to load expenses.",
              });
            }

            res.json(expenses);
          }
        );
      }
    );
  }
);

// ======================================================
// EXPENSES - DELETE
// ======================================================

app.delete(
  "/api/expenses/:id",
  authenticateToken,
  (req, res) => {
    db.run(
      `
      DELETE FROM expenses
      WHERE id = ?
      AND trip_id IN (
        SELECT id
        FROM trips
        WHERE user_id = ?
      )
      `,
      [req.params.id, req.user.id],
      function (err) {
        if (err) {
          console.error(err);

          return res.status(500).json({
            message: "Unable to delete expense.",
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            message: "Expense not found.",
          });
        }

        res.json({
          message: "Expense deleted successfully.",
        });
      }
    );
  }
);

// ======================================================
// DASHBOARD
// ======================================================

app.get(
  "/api/dashboard",
  authenticateToken,
  (req, res) => {
    const userId = req.user.id;

    db.get(
      `
      SELECT
        COUNT(*) AS totalTrips,
        SUM(
          CASE
            WHEN status = 'Planned'
            AND start_date >= date('now')
            THEN 1
            ELSE 0
          END
        ) AS upcomingTrips,
        COALESCE(SUM(budget), 0) AS totalBudget
      FROM trips
      WHERE user_id = ?
      `,
      [userId],
      (tripErr, tripStats) => {
        if (tripErr) {
          console.error(tripErr);

          return res.status(500).json({
            message: "Unable to load dashboard.",
          });
        }

        db.get(
          `
          SELECT
            COUNT(DISTINCT destination) AS destinations
          FROM trips
          WHERE user_id = ?
          `,
          [userId],
          (destinationErr, destinationStats) => {
            if (destinationErr) {
              console.error(destinationErr);

              return res.status(500).json({
                message: "Unable to load dashboard.",
              });
            }

            db.get(
              `
              SELECT
                COALESCE(SUM(e.amount), 0) AS totalExpenses
              FROM expenses e
              INNER JOIN trips t
                ON e.trip_id = t.id
              WHERE t.user_id = ?
              `,
              [userId],
              (expenseErr, expenseStats) => {
                if (expenseErr) {
                  console.error(expenseErr);

                  return res.status(500).json({
                    message: "Unable to load dashboard.",
                  });
                }

                res.json({
                  totalTrips:
                    Number(tripStats?.totalTrips) || 0,

                  upcomingTrips:
                    Number(tripStats?.upcomingTrips) || 0,

                  destinations:
                    Number(
                      destinationStats?.destinations
                    ) || 0,

                  totalBudget:
                    Number(tripStats?.totalBudget) || 0,

                  totalExpenses:
                    Number(
                      expenseStats?.totalExpenses
                    ) || 0,
                });
              }
            );
          }
        );
      }
    );
  }
);

// ======================================================
// 404 HANDLER
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    status: "error",
    message: "Internal server error.",
  });
});

// ======================================================
// START SERVER
// ======================================================

app.listen(PORT, () => {
  console.log("");
  console.log(
    "=================================================="
  );
  console.log(
    "  TravelCloud Backend Server Started Successfully"
  );
  console.log(
    "=================================================="
  );
  console.log(`  Server: http://localhost:${PORT}`);
  console.log(
    `  API:    http://localhost:${PORT}/api`
  );
  console.log("  Database: SQLite");
  console.log("  Project: Cloud Travel Itinerary");
  console.log(
    "=================================================="
  );
  console.log("");
});