import React, { useState, useEffect } from "react";
import "./App.css";

const roomsData = [
  { id: 1, name: "Single Room", price: 1000 },
  { id: 2, name: "Double Room", price: 2000 },
  { id: 3, name: "Deluxe Room", price: 3000 },
];

function App() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [name, setName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookings"));
    if (saved) setBookings(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  const calculateDays = () => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = (outDate - inDate) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  const totalPrice =
    selectedRoom && calculateDays()
      ? selectedRoom.price * calculateDays()
      : 0;

  const handleBooking = () => {
    if (!name || !selectedRoom || !checkIn || !checkOut) {
      alert("Fill all details");
      return;
    }

    const newBooking = {
      id: Date.now(),
      name,
      room: selectedRoom.name,
      guests,
      checkIn,
      checkOut,
      totalPrice,
    };

    setBookings([...bookings, newBooking]);

    setName("");
    setSelectedRoom(null);
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
  };

  const cancelBooking = (id) => {
    setBookings(bookings.filter((b) => b.id !== id));
  };

  return (
    <div>
      <nav className="navbar">
        <h2>🏨 Hotel Booking</h2>
      </nav>

      <div className="container">
        <h2>Available Rooms</h2>

        <div className="rooms">
          {roomsData.map((room) => (
            <div
              key={room.id}
              className={`card ${
                selectedRoom?.id === room.id ? "selected" : ""
              }`}
              onClick={() => setSelectedRoom(room)}
            >
              <h3>{room.name}</h3>
              <p>₹{room.price} / night</p>
            </div>
          ))}
        </div>

        {/* Booking Form */}
        <div className="booking-box">
          <h2>Book Room</h2>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <br />

          <label>Check-In:</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />

          <label>Check-Out:</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />

          <br />

          <label>Guests:</label>
          <input
            type="number"
            min="1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />

          <h3>Total Price: ₹{totalPrice}</h3>

          <button onClick={handleBooking}>Book Now</button>
        </div>

        {/* Booking History */}
        <h2>Booking History</h2>

        <div className="history">
          {bookings.length === 0 ? (
            <p>No bookings yet</p>
          ) : (
            bookings.map((b) => (
              <div className="history-card" key={b.id}>
                <p><b>{b.name}</b></p>
                <p>{b.room}</p>
                <p>{b.checkIn} → {b.checkOut}</p>
                <p>Guests: {b.guests}</p>
                <p>Total: ₹{b.totalPrice}</p>
                <button onClick={() => cancelBooking(b.id)}>
                  Cancel
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
