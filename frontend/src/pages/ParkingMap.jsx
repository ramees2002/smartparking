import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

const ParkingMap = () => {

  const [slots, setSlots] = useState([]);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      const res = await axios.get(
        "https://smartparking-1eu5.onrender.com/admin/slots"
      );

      setSlots(res.data.slots || res.data);

    } catch (error) {
      console.log(error);
    }
  };

  const availableSlots =
    slots.filter(
      slot => slot.status === "available"
    ).length;

  const bookedSlots =
    slots.filter(
      slot => slot.status === "booked"
    ).length;

  const parkingLocation = [
    10.5276,
    76.2144
  ];

  return (
    <div style={{ padding: "20px" }}>

      <h1>Parking Location</h1>

      <MapContainer
        center={parkingLocation}
        zoom={15}
        style={{
          height: "500px",
          width: "100%"
        }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={parkingLocation}>
          <Popup>

            <h3>Smart Parking Area</h3>

            <p>
              Available Slots: {availableSlots}
            </p>

            <p>
              Booked Slots: {bookedSlots}
            </p>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=10.5276,76.2144"
              target="_blank"
              rel="noreferrer"
            >
              Get Directions
            </a>

          </Popup>
        </Marker>

      </MapContainer>

    </div>
  );
};

export default ParkingMap;