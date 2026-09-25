import React, { useEffect, useMemo, useState } from "react";
import API from "./services/api";

const EMPTY_TRIP = {
  trip_name: "",
  destination: "",
  start_date: "",
  end_date: "",
  travelers: 1,
  budget: "",
  travel_type: "Leisure",
  description: "",
  status: "Planned",
};

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function Empty({ text, action, actionText = "Create Trip" }) {
  return (
    <div className="empty">
      <i className="bi bi-airplane"></i>
      <h3>{text}</h3>
      {action && (
        <button className="primary" onClick={action}>
          {actionText}
        </button>
      )}
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState(
    localStorage.getItem("travelcloud_token")
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("travelcloud_user") || "null")
  );

  const [page, setPage] = useState("dashboard");
  const [authMode, setAuthMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const [auth, setAuth] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [dashboard, setDashboard] = useState({
    totalTrips: 0,
    upcomingTrips: 0,
    destinations: 0,
    totalBudget: 0,
    totalExpenses: 0,
  });

  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");

  const [tripForm, setTripForm] = useState(EMPTY_TRIP);
  const [editingId, setEditingId] = useState(null);

  const [selectedTrip, setSelectedTrip] = useState(null);

  const [itinerary, setItinerary] = useState([]);

  const [itemForm, setItemForm] = useState({
    day_number: 1,
    activity: "",
    time: "",
    location: "",
    notes: "",
  });

  const [expenses, setExpenses] = useState([]);

  const [expenseForm, setExpenseForm] = useState({
    category: "Transport",
    description: "",
    amount: "",
    expense_date: "",
  });

  const [profileName, setProfileName] = useState("");

  const notify = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const loadData = async () => {
    try {
      const [dashboardResponse, tripsResponse] =
        await Promise.all([
          API.get("/dashboard"),
          API.get("/trips"),
        ]);

      setDashboard(dashboardResponse.data);
      setTrips(tripsResponse.data);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
      setProfileName(user?.name || "");
    }
  }, [token]);

  /* =========================
     AUTHENTICATION
  ========================= */

  const handleAuth = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const endpoint =
        authMode === "login"
          ? "/auth/login"
          : "/auth/register";

      const payload =
        authMode === "login"
          ? {
              email: auth.email,
              password: auth.password,
            }
          : auth;

      const response = await API.post(endpoint, payload);

      localStorage.setItem(
        "travelcloud_token",
        response.data.token
      );

      localStorage.setItem(
        "travelcloud_user",
        JSON.stringify(response.data.user)
      );

      setToken(response.data.token);
      setUser(response.data.user);

      setAuth({
        name: "",
        email: "",
        password: "",
      });

      notify(response.data.message);
    } catch (error) {
      notify(
        error.response?.data?.message ||
          "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("travelcloud_token");
    localStorage.removeItem("travelcloud_user");

    setToken(null);
    setUser(null);
    setTrips([]);
    setDashboard({});
  };

  /* =========================
     TRIPS
  ========================= */

  const saveTrip = async (event) => {
    event.preventDefault();

    if (
      tripForm.end_date &&
      tripForm.start_date &&
      tripForm.end_date < tripForm.start_date
    ) {
      notify("End date cannot be before start date.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...tripForm,
        travelers: Number(tripForm.travelers),
        budget: Number(tripForm.budget || 0),
      };

      if (editingId) {
        await API.put(`/trips/${editingId}`, payload);
        notify("Trip updated successfully.");
      } else {
        await API.post("/trips", payload);
        notify("Trip created successfully.");
      }

      setTripForm(EMPTY_TRIP);
      setEditingId(null);

      await loadData();

      setPage("trips");
    } catch (error) {
      notify(
        error.response?.data?.message ||
          "Unable to save trip."
      );
    } finally {
      setLoading(false);
    }
  };

  const editTrip = (trip) => {
    setTripForm({
      trip_name: trip.trip_name,
      destination: trip.destination,
      start_date: trip.start_date,
      end_date: trip.end_date,
      travelers: trip.travelers,
      budget: trip.budget,
      travel_type: trip.travel_type,
      description: trip.description || "",
      status: trip.status,
    });

    setEditingId(trip.id);
    setPage("create");
  };

  const deleteTrip = async (id) => {
    if (
      !window.confirm(
        "Delete this trip and its itinerary and expenses?"
      )
    ) {
      return;
    }

    try {
      await API.delete(`/trips/${id}`);

      notify("Trip deleted successfully.");

      await loadData();
    } catch (error) {
      notify("Unable to delete trip.");
    }
  };

  /* =========================
     ITINERARY
  ========================= */

  const openItinerary = async (trip) => {
    setSelectedTrip(trip);

    try {
      const response = await API.get(
        `/itinerary/${trip.id}`
      );

      setItinerary(response.data);
      setPage("itinerary");
    } catch (error) {
      notify("Unable to load itinerary.");
    }
  };

  const addItinerary = async (event) => {
    event.preventDefault();

    try {
      await API.post("/itinerary", {
        trip_id: selectedTrip.id,
        ...itemForm,
        day_number: Number(itemForm.day_number),
      });

      const response = await API.get(
        `/itinerary/${selectedTrip.id}`
      );

      setItinerary(response.data);

      setItemForm({
        day_number: 1,
        activity: "",
        time: "",
        location: "",
        notes: "",
      });

      notify("Activity added successfully.");
    } catch (error) {
      notify(
        error.response?.data?.message ||
          "Unable to add activity."
      );
    }
  };

  const deleteItinerary = async (id) => {
    try {
      await API.delete(`/itinerary/${id}`);

      setItinerary(
        itinerary.filter((item) => item.id !== id)
      );

      notify("Activity deleted.");
    } catch {
      notify("Unable to delete activity.");
    }
  };

  /* =========================
     EXPENSES
  ========================= */

  const openExpenses = async (trip) => {
    setSelectedTrip(trip);

    try {
      const response = await API.get(
        `/expenses/${trip.id}`
      );

      setExpenses(response.data);
      setPage("expenses");
    } catch {
      notify("Unable to load expenses.");
    }
  };

  const addExpense = async (event) => {
    event.preventDefault();

    try {
      await API.post("/expenses", {
        trip_id: selectedTrip.id,
        ...expenseForm,
        amount: Number(expenseForm.amount),
      });

      const response = await API.get(
        `/expenses/${selectedTrip.id}`
      );

      setExpenses(response.data);

      setExpenseForm({
        category: "Transport",
        description: "",
        amount: "",
        expense_date: "",
      });

      await loadData();

      notify("Expense added successfully.");
    } catch (error) {
      notify(
        error.response?.data?.message ||
          "Unable to add expense."
      );
    }
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);

      setExpenses(
        expenses.filter((expense) => expense.id !== id)
      );

      await loadData();

      notify("Expense deleted.");
    } catch {
      notify("Unable to delete expense.");
    }
  };

  /* =========================
     PROFILE
  ========================= */

  const updateProfile = async (event) => {
    event.preventDefault();

    try {
      const response = await API.put("/auth/profile", {
        name: profileName,
      });

      setUser(response.data.user);

      localStorage.setItem(
        "travelcloud_user",
        JSON.stringify(response.data.user)
      );

      notify("Profile updated successfully.");
    } catch {
      notify("Unable to update profile.");
    }
  };

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) =>
      `${trip.trip_name} ${trip.destination} ${trip.travel_type}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [trips, search]);

  /* =========================
     LOGIN PAGE
  ========================= */

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-hero">
          <div className="brand">
            <div className="logo-icon">
              <i className="bi bi-airplane-engines-fill"></i>
            </div>

            <div>
              <b>TravelCloud</b>
              <small>Itinerary Management System</small>
            </div>
          </div>

          <div className="hero-copy">
            <h1>
              Plan smarter.
              <br />
              <span>Travel better.</span>
            </h1>

            <p>
              Manage trips, itineraries, destinations and
              expenses from one centralized cloud platform.
            </p>

            <div className="hero-points">
              <div>
                <i className="bi bi-check-circle-fill"></i>
                Smart trip management
              </div>

              <div>
                <i className="bi bi-check-circle-fill"></i>
                Day-wise itinerary planning
              </div>

              <div>
                <i className="bi bi-check-circle-fill"></i>
                Travel expense tracking
              </div>

              <div>
                <i className="bi bi-check-circle-fill"></i>
                Secure JWT authentication
              </div>
            </div>
          </div>
        </div>

        <div className="auth-box">
          <div className="auth-card">
            <div className="mobile-logo">
              <i className="bi bi-airplane-engines-fill"></i>
              <b>TravelCloud</b>
            </div>

            <h2>
              {authMode === "login"
                ? "Welcome back!"
                : "Create your account"}
            </h2>

            <p>
              {authMode === "login"
                ? "Sign in to manage your journeys."
                : "Start planning your next journey."}
            </p>

            <form onSubmit={handleAuth}>
              {authMode === "register" && (
                <label>
                  Full Name
                  <input
                    value={auth.name}
                    onChange={(e) =>
                      setAuth({
                        ...auth,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter your name"
                    required
                  />
                </label>
              )}

              <label>
                Email
                <input
                  type="email"
                  value={auth.email}
                  onChange={(e) =>
                    setAuth({
                      ...auth,
                      email: e.target.value,
                    })
                  }
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={auth.password}
                  onChange={(e) =>
                    setAuth({
                      ...auth,
                      password: e.target.value,
                    })
                  }
                  placeholder="Minimum 6 characters"
                  required
                />
              </label>

              <button
                className="primary full"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : authMode === "login"
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </form>

            <div className="switch">
              {authMode === "login"
                ? "New to TravelCloud?"
                : "Already registered?"}

              <button
                onClick={() =>
                  setAuthMode(
                    authMode === "login"
                      ? "register"
                      : "login"
                  )
                }
              >
                {authMode === "login"
                  ? "Create account"
                  : "Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     APPLICATION
  ========================= */

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="side-brand">
          <div className="logo-icon">
            <i className="bi bi-airplane-engines-fill"></i>
          </div>

          <div>
            <b>TravelCloud</b>
            <small>Itinerary Manager</small>
          </div>
        </div>

        <div className="nav-label">
          WORKSPACE
        </div>

        {[
          ["dashboard", "bi-grid-1x2-fill", "Dashboard"],
          ["trips", "bi-briefcase-fill", "My Trips"],
          ["create", "bi-plus-circle-fill", "Create Trip"],
          ["itinerary", "bi-calendar3", "Itinerary"],
          ["expenses", "bi-wallet2", "Expenses"],
          ["destinations", "bi-geo-alt-fill", "Destinations"],
        ].map(([p, icon, label]) => (
          <button
            key={p}
            className={`nav ${
              page === p ? "active" : ""
            }`}
            onClick={() => setPage(p)}
          >
            <i className={`bi ${icon}`}></i>
            {label}
          </button>
        ))}

        <div className="side-bottom">
          <button
            className={`nav ${
              page === "profile" ? "active" : ""
            }`}
            onClick={() => setPage("profile")}
          >
            <i className="bi bi-person-circle"></i>
            Profile
          </button>

          <div className="side-user">
            <div className="avatar">
              {(user?.name || "U")[0].toUpperCase()}
            </div>

            <div>
              <b>{user?.name}</b>
              <small>{user?.email}</small>
            </div>
          </div>

          <button className="logout" onClick={logout}>
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>
              {
                {
                  dashboard: "Dashboard",
                  trips: "My Trips",
                  create: editingId
                    ? "Edit Trip"
                    : "Create Trip",
                  itinerary: "Itinerary",
                  expenses: "Expenses",
                  destinations: "Destinations",
                  profile: "Profile",
                }[page]
              }
            </h1>

            <p>
              Cloud-based travel planning workspace
            </p>
          </div>

          <div className="top-user">
            <span className="bell">
              <i className="bi bi-bell"></i>
            </span>

            <div className="avatar">
              {(user?.name || "U")[0].toUpperCase()}
            </div>
          </div>
        </header>

        {toast && (
          <div className="toast-msg">
            <i className="bi bi-check-circle-fill"></i>
            {toast}
          </div>
        )}

        {/* DASHBOARD */}

        {page === "dashboard" && (
          <section>
            <div className="welcome">
              <div>
                <span>WELCOME BACK</span>

                <h2>
                  Hello, {user?.name} 👋
                </h2>

                <p>
                  Here's your travel activity at a
                  glance.
                </p>
              </div>

              <i className="bi bi-globe2"></i>
            </div>

            <div className="stats">
              <div className="stat">
                <div className="stat-icon blue">
                  <i className="bi bi-briefcase-fill"></i>
                </div>

                <div>
                  <span>Total Trips</span>
                  <strong>
                    {dashboard.totalTrips || 0}
                  </strong>
                </div>
              </div>

              <div className="stat">
                <div className="stat-icon orange">
                  <i className="bi bi-calendar-event-fill"></i>
                </div>

                <div>
                  <span>Upcoming Trips</span>
                  <strong>
                    {dashboard.upcomingTrips || 0}
                  </strong>
                </div>
              </div>

              <div className="stat">
                <div className="stat-icon green">
                  <i className="bi bi-geo-alt-fill"></i>
                </div>

                <div>
                  <span>Destinations</span>
                  <strong>
                    {dashboard.destinations || 0}
                  </strong>
                </div>
              </div>

              <div className="stat">
                <div className="stat-icon purple">
                  <i className="bi bi-wallet2"></i>
                </div>

                <div>
                  <span>Total Budget</span>
                  <strong>
                    {money(dashboard.totalBudget)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="section-head">
              <div>
                <h2>Recent Trips</h2>
                <p>Your latest travel plans</p>
              </div>

              <button
                className="secondary"
                onClick={() => setPage("trips")}
              >
                View All
              </button>
            </div>

            <div className="cards">
              {trips.slice(0, 3).map((trip) => (
                <div
                  className="trip-card"
                  key={trip.id}
                >
                  <div className="trip-cover">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>

                  <div className="trip-body">
                    <span className="badge">
                      {trip.status}
                    </span>

                    <h3>{trip.trip_name}</h3>

                    <p>
                      <i className="bi bi-geo-alt"></i>
                      {trip.destination}
                    </p>

                    <p>
                      <i className="bi bi-calendar3"></i>
                      {trip.start_date} →{" "}
                      {trip.end_date}
                    </p>

                    <div className="trip-foot">
                      <b>{money(trip.budget)}</b>

                      <span>
                        {trip.travelers} traveler
                        {trip.travelers > 1
                          ? "s"
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!trips.length && (
              <Empty
                text="No trips yet. Create your first journey."
                action={() => setPage("create")}
              />
            )}

            <div className="section-head">
              <div>
                <h2>Quick Actions</h2>
                <p>Jump into your travel tools</p>
              </div>
            </div>

            <div className="quick">
              <button onClick={() => setPage("create")}>
                <i className="bi bi-plus-circle"></i>
                <b>Create Trip</b>
                <span>Plan a new journey</span>
              </button>

              <button
                onClick={() => setPage("trips")}
              >
                <i className="bi bi-briefcase"></i>
                <b>My Trips</b>
                <span>Manage your journeys</span>
              </button>

              <button
                onClick={() => setPage("expenses")}
              >
                <i className="bi bi-wallet2"></i>
                <b>Expenses</b>
                <span>Track spending</span>
              </button>

              <button
                onClick={() =>
                  setPage("destinations")
                }
              >
                <i className="bi bi-geo-alt"></i>
                <b>Destinations</b>
                <span>Explore places</span>
              </button>
            </div>
          </section>
        )}

        {/* TRIPS */}

        {page === "trips" && (
          <section>
            <div className="section-head">
              <div>
                <h2>My Trips</h2>
                <p>
                  Manage every journey in one place.
                </p>
              </div>

              <button
                className="primary"
                onClick={() => {
                  setTripForm(EMPTY_TRIP);
                  setEditingId(null);
                  setPage("create");
                }}
              >
                <i className="bi bi-plus-lg"></i>{" "}
                New Trip
              </button>
            </div>

            <div className="toolbar">
              <div className="search">
                <i className="bi bi-search"></i>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search trips or destinations..."
                />
              </div>

              <span>
                {filteredTrips.length} trip(s)
              </span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Trip</th>
                    <th>Destination</th>
                    <th>Dates</th>
                    <th>Travelers</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTrips.map((trip) => (
                    <tr key={trip.id}>
                      <td>
                        <b>{trip.trip_name}</b>
                        <small>
                          {trip.travel_type}
                        </small>
                      </td>

                      <td>{trip.destination}</td>

                      <td>
                        {trip.start_date}
                        <small>
                          to {trip.end_date}
                        </small>
                      </td>

                      <td>{trip.travelers}</td>

                      <td>{money(trip.budget)}</td>

                      <td>
                        <span className="badge">
                          {trip.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="icon-btn"
                          title="Itinerary"
                          onClick={() =>
                            openItinerary(trip)
                          }
                        >
                          <i className="bi bi-calendar3"></i>
                        </button>

                        <button
                          className="icon-btn"
                          title="Expenses"
                          onClick={() =>
                            openExpenses(trip)
                          }
                        >
                          <i className="bi bi-wallet2"></i>
                        </button>

                        <button
                          className="icon-btn"
                          title="Edit"
                          onClick={() =>
                            editTrip(trip)
                          }
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          className="icon-btn danger"
                          title="Delete"
                          onClick={() =>
                            deleteTrip(trip.id)
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!filteredTrips.length && (
              <Empty
                text="No matching trips found."
                action={() => setPage("create")}
              />
            )}
          </section>
        )}

        {/* CREATE / EDIT */}

        {page === "create" && (
          <section>
            <div className="form-card">
              <div className="section-head">
                <div>
                  <h2>
                    {editingId
                      ? "Edit Trip"
                      : "Create New Trip"}
                  </h2>

                  <p>
                    Enter your complete journey
                    details.
                  </p>
                </div>
              </div>

              <form onSubmit={saveTrip}>
                <div className="form-grid">
                  <label>
                    Trip Name *
                    <input
                      value={tripForm.trip_name}
                      onChange={(e) =>
                        setTripForm({
                          ...tripForm,
                          trip_name: e.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    Destination *
                    <input
                      value={tripForm.destination}
                      onChange={(e) =>
                        setTripForm({
                          ...tripForm,
                          destination: e.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    Start Date *
                    <input
                      type="date"
                      value={tripForm.start_date}
                      onChange={(e) =>
                        setTripForm({
                          ...tripForm,
                          start_date: e.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    End Date *
                    <input
                      type="date"
                      value={tripForm.end_date}
                      onChange={(e) =>
                        setTripForm({
                          ...tripForm,
                          end_date: e.target.value,
                        })
                      }
                      required
                    />
                  </label>

                  <label>
                    Travelers
                    <input
                      type="number"
                      min="1"
                      value={tripForm.travelers}
                      onChange={(e) =>
                        setTripForm({
                          ...tripForm,
                          travelers: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Budget ₹
                    <input
                      type="number"
                      min="0"
                      value={tripForm.budget}
                      onChange={(e) =>
                        setTripForm({
                          ...tripForm,
                          budget: e.target.value,
                        })
                      }
                    />
                  </label>

                  <label>
                    Travel Type
                    <select
                      value={tripForm.travel_type}
                      onChange={(e) =>
                        setTripForm({
                          ...tripForm,
                          travel_type:
                            e.target.value,
                        })
                      }
                    >
                      <option>Leisure</option>
                      <option>Business</option>
                      <option>Adventure</option>
                      <option>Family</option>
                      <option>Solo</option>
                    </select>
                  </label>

                  <label>
                    Status
                    <select
                      value={tripForm.status}
                      onChange={(e) =>
                        setTripForm({
                          ...tripForm,
                          status: e.target.value,
                        })
                      }
                    >
                      <option>Planned</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </label>

                  <label className="full">
                    Description
                    <textarea
                      rows="5"
                      value={tripForm.description}
                      onChange={(e) =>
                        setTripForm({
                          ...tripForm,
                          description:
                            e.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                <div className="actions">
                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      setPage("trips")
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="primary"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingId
                      ? "Update Trip"
                      : "Save Trip"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* ITINERARY */}

        {page === "itinerary" && (
          <section>
            <div className="section-head">
              <div>
                <h2>Day-wise Itinerary</h2>

                <p>
                  {selectedTrip
                    ? selectedTrip.trip_name
                    : "Select a trip"}
                </p>
              </div>

              <button
                className="secondary"
                onClick={() => setPage("trips")}
              >
                Choose Trip
              </button>
            </div>

            {selectedTrip ? (
              <>
                <div className="inline-form">
                  <form onSubmit={addItinerary}>
                    <input
                      type="number"
                      min="1"
                      placeholder="Day"
                      value={
                        itemForm.day_number
                      }
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          day_number:
                            e.target.value,
                        })
                      }
                    />

                    <input
                      placeholder="Activity"
                      value={
                        itemForm.activity
                      }
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          activity:
                            e.target.value,
                        })
                      }
                      required
                    />

                    <input
                      placeholder="Time"
                      value={itemForm.time}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          time: e.target.value,
                        })
                      }
                    />

                    <input
                      placeholder="Location"
                      value={
                        itemForm.location
                      }
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          location:
                            e.target.value,
                        })
                      }
                    />

                    <button className="primary">
                      Add Activity
                    </button>
                  </form>
                </div>

                <div className="timeline">
                  {itinerary.map((item) => (
                    <div
                      className="timeline-item"
                      key={item.id}
                    >
                      <div className="day">
                        DAY {item.day_number}
                      </div>

                      <div>
                        <h3>
                          {item.activity}
                        </h3>

                        <p>
                          {item.time && (
                            <>
                              <i className="bi bi-clock"></i>{" "}
                              {item.time}
                            </>
                          )}

                          {item.location && (
                            <>
                              {" "}
                              <i className="bi bi-geo-alt"></i>{" "}
                              {item.location}
                            </>
                          )}
                        </p>

                        {item.notes && (
                          <small>
                            {item.notes}
                          </small>
                        )}
                      </div>

                      <button
                        className="icon-btn danger"
                        onClick={() =>
                          deleteItinerary(
                            item.id
                          )
                        }
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>

                {!itinerary.length && (
                  <Empty text="No activities yet. Add your first activity above." />
                )}
              </>
            ) : (
              <Empty
                text="Open a trip from My Trips to manage its itinerary."
                action={() =>
                  setPage("trips")
                }
                actionText="Open My Trips"
              />
            )}
          </section>
        )}

        {/* EXPENSES */}

        {page === "expenses" && (
          <section>
            <div className="section-head">
              <div>
                <h2>Travel Expenses</h2>

                <p>
                  {selectedTrip
                    ? selectedTrip.trip_name
                    : "Select a trip"}
                </p>
              </div>

              <button
                className="secondary"
                onClick={() => setPage("trips")}
              >
                Choose Trip
              </button>
            </div>

            {selectedTrip ? (
              <>
                <div className="expense-total">
                  <span>
                    Total recorded expenses
                  </span>

                  <strong>
                    {money(
                      expenses.reduce(
                        (sum, expense) =>
                          sum +
                          Number(
                            expense.amount
                          ),
                        0
                      )
                    )}
                  </strong>
                </div>

                <div className="inline-form">
                  <form onSubmit={addExpense}>
                    <select
                      value={
                        expenseForm.category
                      }
                      onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          category:
                            e.target.value,
                        })
                      }
                    >
                      <option>
                        Transport
                      </option>

                      <option>
                        Accommodation
                      </option>

                      <option>Food</option>

                      <option>
                        Activities
                      </option>

                      <option>
                        Shopping
                      </option>

                      <option>Other</option>
                    </select>

                    <input
                      placeholder="Description"
                      value={
                        expenseForm.description
                      }
                      onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          description:
                            e.target.value,
                        })
                      }
                    />

                    <input
                      type="number"
                      min="1"
                      placeholder="Amount ₹"
                      value={
                        expenseForm.amount
                      }
                      onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          amount:
                            e.target.value,
                        })
                      }
                      required
                    />

                    <input
                      type="date"
                      value={
                        expenseForm.expense_date
                      }
                      onChange={(e) =>
                        setExpenseForm({
                          ...expenseForm,
                          expense_date:
                            e.target.value,
                        })
                      }
                    />

                    <button className="primary">
                      Add Expense
                    </button>
                  </form>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {expenses.map(
                        (expense) => (
                          <tr
                            key={expense.id}
                          >
                            <td>
                              <b>
                                {
                                  expense.category
                                }
                              </b>
                            </td>

                            <td>
                              {
                                expense.description ||
                                "-"
                              }
                            </td>

                            <td>
                              {
                                expense.expense_date ||
                                "-"
                              }
                            </td>

                            <td>
                              {money(
                                expense.amount
                              )}
                            </td>

                            <td>
                              <button
                                className="icon-btn danger"
                                onClick={() =>
                                  deleteExpense(
                                    expense.id
                                  )
                                }
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {!expenses.length && (
                  <Empty text="No expenses recorded for this trip." />
                )}
              </>
            ) : (
              <Empty
                text="Open a trip from My Trips to manage expenses."
                action={() =>
                  setPage("trips")
                }
                actionText="Open My Trips"
              />
            )}
          </section>
        )}

        {/* DESTINATIONS */}

        {page === "destinations" && (
          <section>
            <div className="section-head">
              <div>
                <h2>Destinations</h2>

                <p>
                  Destinations from your trips.
                </p>
              </div>
            </div>

            <div className="destination-grid">
              {[
                ...new Map(
                  trips.map((trip) => [
                    trip.destination,
                    trip,
                  ])
                ).values(),
              ].map((trip) => (
                <div
                  className="destination"
                  key={trip.destination}
                >
                  <div className="dest-icon">
                    <i className="bi bi-geo-alt-fill"></i>
                  </div>

                  <h3>
                    {trip.destination}
                  </h3>

                  <p>{trip.trip_name}</p>

                  <button
                    className="secondary"
                    onClick={() =>
                      openItinerary(trip)
                    }
                  >
                    View Itinerary
                  </button>
                </div>
              ))}
            </div>

            {!trips.length && (
              <Empty
                text="Create a trip to see destinations here."
                action={() =>
                  setPage("create")
                }
              />
            )}
          </section>
        )}

        {/* PROFILE */}

        {page === "profile" && (
          <section>
            <div className="profile-card">
              <div className="profile-avatar">
                {(user?.name || "U")[0].toUpperCase()}
              </div>

              <h2>Profile Settings</h2>

              <p>
                Update your TravelCloud profile.
              </p>

              <form onSubmit={updateProfile}>
                <label>
                  Full Name

                  <input
                    value={profileName}
                    onChange={(e) =>
                      setProfileName(
                        e.target.value
                      )
                    }
                    required
                  />
                </label>

                <label>
                  Email

                  <input
                    value={user?.email || ""}
                    disabled
                  />
                </label>

                <button className="primary">
                  Save Changes
                </button>
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}