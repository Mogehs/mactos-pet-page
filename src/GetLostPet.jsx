import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GetLostPet = () => {
  const { id } = useParams();
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [finderPhone, setFinderPhone] = useState("");
  const [finderLocation, setFinderLocation] = useState("");
  const [finderLatitude, setFinderLatitude] = useState("");
  const [finderLongitude, setFinderLongitude] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);

  // Function to get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFinderLatitude(position.coords.latitude.toString());
          setFinderLongitude(position.coords.longitude.toString());
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your location. Please enter it manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Function to handle WhatsApp contact
  const handleWhatsAppContact = () => {
    if (!petData) return;

    // Check if finder details are provided
    if (!finderPhone.trim()) {
      alert("Please enter your phone number before contacting the owner.");
      return;
    }

    // Extract all available data from the API response
    const ownerFirstName = petData?.user?.firstname || "";
    const ownerLastName = petData?.user?.lastname || "";
    const petName = petData?.pet_name || "your pet";
    const ownerPhone = petData?.user?.phone || "";
    const petType = petData?.pet || "";
    const petBreed = petData?.pet_race || "";
    const petColor = petData?.pet_color || "";
    const petSize = petData?.pet_size || "";
    const petGender = petData?.pet_gender || "";
    const microchipNumber = petData?.pet_microchip_number || "";
    const ownerAddress = petData?.user?.address || "";
    const description = petData?.pet_description || "";
    const preferredLocation = petData?.preferred_location || "";

    // Create comprehensive WhatsApp message with all available data
    let message = `¡Hola ${ownerFirstName} ${ownerLastName}! ${finderPhone} He encontrado a tu mascota ${petName}.`;

    // Add pet details
    if (petType) message += `\n\n🐾 Tipo: ${petType}`;
    if (petBreed) message += `\n🐕 Raza: ${petBreed}`;
    if (petColor) message += `\n🎨 Color: ${petColor}`;
    if (petSize) message += `\n📏 Tamaño: ${petSize}`;
    if (petGender) message += `\n⚧ Género: ${petGender}`;
    if (microchipNumber) message += `\n🔗 Microchip: ${microchipNumber}`;

    // Add description if available
    if (description) message += `\n\n📝 Descripción: ${description}`;

    // Add finder's location information
    if (finderLatitude && finderLongitude) {
      message += `\n\n📍 Mi ubicación actual es: https://maps.google.com/?q=${finderLatitude},${finderLongitude}`;
    } else if (finderLocation.trim()) {
      message += `\n\n📍 Mi ubicación actual: ${finderLocation}`;
    }

    // Add finder's contact information
    message += `\n\n📞 Mi teléfono: ${finderPhone}`;

    // Add owner information
    if (ownerAddress) message += `\n🏠 Dirección del dueño: ${ownerAddress}`;
    if (preferredLocation)
      message += `\n📍 Ubicación preferida del dueño: ${preferredLocation}`;

    message += `\n\n¡Por favor contáctame lo antes posible para coordinar la devolución de tu mascota!`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL with owner's phone number
    const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodedMessage}`;

    // Open WhatsApp and close current window
    window.open(whatsappUrl, "_blank");

    // Close the current tab/window after a brief delay to ensure WhatsApp opens
    setTimeout(() => {
      window.close();
    }, 100);
  };

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Replace this URL with your actual API endpoint
        const response = await axios.post(
          `https://mascotas-backend.onrender.com/api/pet/${id}`
        );

        setPetData(response.data.pet);
      } catch (err) {
        setError(err.message || "Failed to fetch pet data");
        console.error("Error fetching pet data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPetData();
    }
  }, [id]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <div className="max-w-md w-full flex flex-col items-center text-center">
          {/* Animated paw icon or loader */}
          <div className="relative mb-6">
            <div className="h-20 w-20 rounded-full border-4 border-[#D9DFE6] animate-ping" />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-14 h-14 text-[#3B9577] animate-bounce"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5.5 9C6.88 9 8 7.88 8 6.5S6.88 4 5.5 4 3 5.12 3 6.5 4.12 9 5.5 9zm13 0c1.38 0 2.5-1.12 2.5-2.5S19.88 4 18.5 4 16 5.12 16 6.5 17.12 9 18.5 9zM12 14c2.5 0 4.5-2 4.5-4.5S14.5 5 12 5 7.5 7 7.5 9.5 9.5 14 12 14zm-4.5 1c-.83 0-1.5.67-1.5 1.5S6.67 18 7.5 18 9 17.33 9 16.5 8.33 15 7.5 15zm9 0c-.83 0-1.5.67-1.5 1.5S15.67 18 16.5 18 18 17.33 18 16.5 17.33 15 16.5 15z" />
              </svg>
            </div>
          </div>

          {/* Text */}
          <h2 className="text-2xl font-semibold text-[#606873] mb-2">
            Hang tight!
          </h2>
          <p className="text-[#808B9A] mb-1">
            We're fetching your pet's details...
          </p>
          <p className="text-sm text-[#D9DFE6]">This won’t take long 🐾</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="max-w-2xl mx-auto pt-20">
          <div
            className="rounded-2xl shadow-xl p-8 border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#D9DFE6" }}
          >
            <div className="text-center">
              <div
                className="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4"
                style={{ backgroundColor: "#D9DFE6" }}
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: "#d62d20" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "#d62d20" }}
              >
                Oops! Something went wrong
              </h2>
              <p className="mb-6" style={{ color: "#808B9A" }}>
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
                style={{ backgroundColor: "#d62d20", color: "#FFFFFF" }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#b32619")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#d62d20")}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: "#FAFAFA" }}>
      {/* Floating WhatsApp Button */}
      {petData?.user?.phone && (
        <button
          onClick={() => setShowContactForm(true)}
          className="fixed top-6 right-6 z-50 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 animate-pulse"
          style={{ backgroundColor: "#3B9577" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2d7a63")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3B9577")}
          title={`Contact ${petData?.user?.firstname} ${petData?.user?.lastname} on WhatsApp`}
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
        </button>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-xl bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-2xl shadow-2xl p-6 w-full max-w-md"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <h3
              className="text-2xl font-bold mb-6 text-center"
              style={{ color: "#39434F" }}
            >
              Your Contact Information
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#606873" }}
                >
                  Your Phone Number *
                </label>
                <input
                  type="tel"
                  value={finderPhone}
                  onChange={(e) => setFinderPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                  style={{
                    borderColor: "#D9DFE6",
                    backgroundColor: "#FFFFFF",
                    color: "#39434F",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B9577";
                    e.target.style.boxShadow =
                      "0 0 0 2px rgba(59, 149, 119, 0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D9DFE6";
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#606873" }}
                >
                  Your Current Location
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={finderLocation}
                    onChange={(e) => setFinderLocation(e.target.value)}
                    placeholder="Enter your location or address"
                    className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent"
                    style={{
                      borderColor: "#D9DFE6",
                      backgroundColor: "#FFFFFF",
                      color: "#39434F",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3B9577";
                      e.target.style.boxShadow =
                        "0 0 0 2px rgba(59, 149, 119, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#D9DFE6";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    onClick={getCurrentLocation}
                    className="px-4 py-3 text-white rounded-lg transition-colors"
                    style={{ backgroundColor: "#3B9577" }}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#2d7a63")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "#3B9577")
                    }
                    title="Get current location"
                  >
                    📍
                  </button>
                </div>
                <p className="text-xs mt-1" style={{ color: "#808B9A" }}>
                  Click 📍 to auto-detect your location
                </p>
              </div>

              {finderLatitude && finderLongitude && (
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#ECEFF2" }}
                >
                  <p className="text-sm" style={{ color: "#3B9577" }}>
                    ✓ Location detected: {finderLatitude}, {finderLongitude}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowContactForm(false)}
                className="flex-1 px-6 py-3 rounded-lg transition-colors font-medium"
                style={{ backgroundColor: "#D9DFE6", color: "#606873" }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#c8d0d7")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#D9DFE6")}
              >
                Cancel
              </button>
              <button
                onClick={handleWhatsAppContact}
                className="flex-1 px-6 py-3 text-white rounded-lg transition-colors font-medium"
                style={{ backgroundColor: "#3B9577" }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#2d7a63")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#3B9577")}
              >
                Send WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 pt-8">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#39434F" }}
          >
            🐾 Lost Pet Details
          </h1>
          <div
            className="inline-block rounded-full px-6 py-3 shadow-lg border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#D9DFE6" }}
          >
            <p className="text-lg font-semibold" style={{ color: "#3B9577" }}>
              Pet ID: {id}
            </p>
          </div>
        </div>

        {petData ? (
          <div className="space-y-6">
            {/* Pet Image and Basic Info Card */}
            <div
              className="rounded-2xl shadow-xl p-6 md:p-8 border hover:shadow-2xl transition-all duration-300"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#D9DFE6" }}
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Pet Image */}
                {petData.pet_image && (
                  <div className="lg:w-1/3">
                    <div
                      className="relative overflow-hidden rounded-xl"
                      style={{ backgroundColor: "#ECEFF2" }}
                    >
                      <img
                        src={petData.pet_image}
                        alt={petData.pet_name || "Pet"}
                        className="w-full h-64 lg:h-80 object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className="absolute top-4 right-4 rounded-full p-2 shadow-lg"
                        style={{ backgroundColor: "#FFFFFF" }}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: "#d62d20" }}
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* Basic Info */}
                <div className="lg:w-2/3">
                  <div className="text-center lg:text-left mb-6">
                    <h2
                      className="text-3xl md:text-4xl font-bold mb-2"
                      style={{ color: "#39434F" }}
                    >
                      {petData.pet_name || "Unknown Pet"}
                    </h2>
                    <p className="text-xl mb-4" style={{ color: "#606873" }}>
                      {petData.pet_race || "Unknown Breed"} •{" "}
                      {petData.pet_gender || "Unknown Gender"}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: "#ECEFF2", color: "#3B9577" }}
                      >
                        {petData.pet || "Pet"}
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: "#ECEFF2", color: "#3B9577" }}
                      >
                        {petData.pet_size || "Unknown Size"}
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ backgroundColor: "#ECEFF2", color: "#3B9577" }}
                      >
                        {petData.pet_color || "Unknown Color"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Details Card */}
              <div
                className="rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#D9DFE6" }}
              >
                <div className="flex items-center mb-4">
                  <div
                    className="rounded-full p-3 mr-3"
                    style={{ backgroundColor: "#ECEFF2" }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: "#3B9577" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#39434F" }}
                  >
                    Basic Details
                  </h3>
                </div>
                <div className="space-y-3">
                  <div
                    className="flex justify-between items-center py-2 border-b"
                    style={{ borderColor: "#D9DFE6" }}
                  >
                    <span className="font-medium" style={{ color: "#606873" }}>
                      Pet Type:
                    </span>
                    <span className="font-medium" style={{ color: "#39434F" }}>
                      {petData.pet || "Unknown"}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center py-2 border-b"
                    style={{ borderColor: "#D9DFE6" }}
                  >
                    <span className="font-medium" style={{ color: "#606873" }}>
                      Date of Birth:
                    </span>
                    <span className="font-medium" style={{ color: "#39434F" }}>
                      {petData.pet_dob
                        ? new Date(petData.pet_dob).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center py-2 border-b"
                    style={{ borderColor: "#D9DFE6" }}
                  >
                    <span className="font-medium" style={{ color: "#606873" }}>
                      Age:
                    </span>
                    <span className="font-medium" style={{ color: "#39434F" }}>
                      {petData.preferred_age || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical Characteristics Card */}
              <div
                className="rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#D9DFE6" }}
              >
                <div className="flex items-center mb-4">
                  <div
                    className="rounded-full p-3 mr-3"
                    style={{ backgroundColor: "#ECEFF2" }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: "#3B9577" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#39434F" }}
                  >
                    Physical Characteristics
                  </h3>
                </div>
                <div className="space-y-3">
                  <div
                    className="flex justify-between items-center py-2 border-b"
                    style={{ borderColor: "#D9DFE6" }}
                  >
                    <span className="font-medium" style={{ color: "#606873" }}>
                      Weight:
                    </span>
                    <span className="font-medium" style={{ color: "#39434F" }}>
                      {petData.pet_weight
                        ? `${petData.pet_weight} kg`
                        : "Unknown"}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center py-2 border-b"
                    style={{ borderColor: "#D9DFE6" }}
                  >
                    <span className="font-medium" style={{ color: "#606873" }}>
                      Height:
                    </span>
                    <span className="font-medium" style={{ color: "#39434F" }}>
                      {petData.pet_height
                        ? `${petData.pet_height} cm`
                        : "Unknown"}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center py-2 border-b"
                    style={{ borderColor: "#D9DFE6" }}
                  >
                    <span className="font-medium" style={{ color: "#606873" }}>
                      Microchip:
                    </span>
                    <span className="font-medium" style={{ color: "#39434F" }}>
                      {petData.pet_microchip_number || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium" style={{ color: "#606873" }}>
                      Neutered:
                    </span>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor:
                          petData.isNeutered === "true" ? "#ECEFF2" : "#D9DFE6",
                        color:
                          petData.isNeutered === "true" ? "#3B9577" : "#808B9A",
                      }}
                    >
                      {petData.isNeutered === "true" ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact and Location Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information Card */}
              <div
                className="rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#D9DFE6" }}
              >
                <div className="flex items-center mb-4">
                  <div
                    className="rounded-full p-3 mr-3"
                    style={{ backgroundColor: "#ECEFF2" }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: "#3B9577" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#39434F" }}
                  >
                    Contact Information
                  </h3>
                </div>
                <div className="space-y-3">
                  <div
                    className="flex justify-between items-center py-2 border-b"
                    style={{ borderColor: "#D9DFE6" }}
                  >
                    <span className="font-medium" style={{ color: "#606873" }}>
                      Owner:
                    </span>
                    <span className="font-medium" style={{ color: "#39434F" }}>
                      {petData?.user?.firstname +
                        " " +
                        petData?.user?.lastname || "Unknown"}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center py-2 border-b"
                    style={{ borderColor: "#D9DFE6" }}
                  >
                    <span className="font-medium" style={{ color: "#606873" }}>
                      Phone:
                    </span>
                    <span className="font-medium" style={{ color: "#39434F" }}>
                      {petData?.user?.phone || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium" style={{ color: "#606873" }}>
                      Address:
                    </span>
                    <span className="font-medium" style={{ color: "#39434F" }}>
                      {petData?.user?.address || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location & Time Card */}
              <div
                className="rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#D9DFE6" }}
              >
                <div className="flex items-center mb-4">
                  <div
                    className="rounded-full p-3 mr-3"
                    style={{ backgroundColor: "#ECEFF2" }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: "#FFC542" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#39434F" }}
                  >
                    Location & Time
                  </h3>
                </div>
                <div className="space-y-3">
                  <div
                    className="flex justify-between items-center py-2 border-b"
                    style={{ borderColor: "#D9DFE6" }}
                  >
                    <span className="font-medium" style={{ color: "#606873" }}>
                      Location:
                    </span>
                    <span className="font-medium" style={{ color: "#39434F" }}>
                      {petData.preferred_location || "Not specified"}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center py-2 border-b"
                    style={{ borderColor: "#D9DFE6" }}
                  >
                    <span className="font-medium" style={{ color: "#606873" }}>
                      Distance:
                    </span>
                    <span className="font-medium" style={{ color: "#39434F" }}>
                      {petData.distance || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium" style={{ color: "#606873" }}>
                      Posted:
                    </span>
                    <span className="font-medium" style={{ color: "#39434F" }}>
                      {petData.createdAt
                        ? new Date(petData.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Cards */}
            {(petData.pet_description || petData.notes_other) && (
              <div className="grid grid-cols-1 gap-6">
                {petData.pet_description && (
                  <div
                    className="rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9DFE6",
                    }}
                  >
                    <div className="flex items-center mb-4">
                      <div
                        className="rounded-full p-3 mr-3"
                        style={{ backgroundColor: "#ECEFF2" }}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: "#3B9577" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: "#39434F" }}
                      >
                        Description
                      </h3>
                    </div>
                    <p
                      className="leading-relaxed text-lg"
                      style={{ color: "#606873" }}
                    >
                      {petData.pet_description}
                    </p>
                  </div>
                )}

                {petData.notes_other && (
                  <div
                    className="rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#D9DFE6",
                    }}
                  >
                    <div className="flex items-center mb-4">
                      <div
                        className="rounded-full p-3 mr-3"
                        style={{ backgroundColor: "#ECEFF2" }}
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: "#FFC542" }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </div>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: "#39434F" }}
                      >
                        Additional Notes
                      </h3>
                    </div>
                    <p
                      className="leading-relaxed text-lg"
                      style={{ color: "#606873" }}
                    >
                      {petData.notes_other}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Temperament Section */}
            {petData.temperament && petData.temperament.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-pink-100 rounded-full p-3 mr-3">
                    <svg
                      className="w-6 h-6 text-pink-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Temperament
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {petData.temperament.map((trait, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className="rounded-2xl shadow-xl p-8 border text-center"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#D9DFE6" }}
          >
            <div
              className="mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4"
              style={{ backgroundColor: "#ECEFF2" }}
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "#808B9A" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: "#39434F" }}
            >
              No Pet Information Found
            </h2>
            <p style={{ color: "#808B9A" }}>
              No pet data available for ID: {id}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetLostPet;
