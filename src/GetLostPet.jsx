import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GetLostPet = () => {
  const { id } = useParams();
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to handle WhatsApp contact
  const handleWhatsAppContact = () => {
    if (!petData) return;

    // Extract all available data from the API response
    const ownerFirstName = petData?.user?.firstname || "";
    const ownerLastName = petData?.user?.lastname || "";
    const petName = petData?.pet_name || "your pet";
    const phone = petData?.user?.phone || "";
    const latitude = petData?.latitude || "";
    const longitude = petData?.longitude || "";
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
    let message = `¡Hola ${ownerFirstName} ${ownerLastName}! He encontrado a tu mascota ${petName}.`;

    // Add pet details
    if (petType) message += `\n\n🐾 Tipo: ${petType}`;
    if (petBreed) message += `\n🐕 Raza: ${petBreed}`;
    if (petColor) message += `\n🎨 Color: ${petColor}`;
    if (petSize) message += `\n📏 Tamaño: ${petSize}`;
    if (petGender) message += `\n⚧ Género: ${petGender}`;
    if (microchipNumber) message += `\n🔗 Microchip: ${microchipNumber}`;

    // Add description if available
    if (description) message += `\n\n📝 Descripción: ${description}`;

    // Add location information
    if (latitude && longitude) {
      message += `\n\n📍 Mi ubicación actual: https://maps.google.com/?q=${latitude},${longitude}`;
    }

    // Add contact information
    if (phone) message += `\n\n📞 Mi teléfono: ${phone}`;
    if (ownerAddress) message += `\n🏠 Dirección del dueño: ${ownerAddress}`;
    if (preferredLocation)
      message += `\n📍 Ubicación preferida: ${preferredLocation}`;

    message += `\n\n¡Por favor contáctame lo antes posible para coordinar la devolución de tu mascota!`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

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
          `http://localhost:5000/api/pet/${id}`
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-xl text-gray-700 font-medium">
              Loading pet information...
            </p>
            <p className="mt-2 text-gray-500">
              Please wait while we fetch the details
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 font-medium shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      {/* Floating WhatsApp Button */}
      {petData?.user?.phone && (
        <button
          onClick={handleWhatsAppContact}
          className="fixed top-6 right-6 z-50 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 animate-pulse"
          title={`Contact ${petData?.user?.firstname} ${petData?.user?.lastname} on WhatsApp`}
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
        </button>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🐾 Lost Pet Details
          </h1>
          <div className="inline-block bg-white rounded-full px-6 py-3 shadow-lg border border-blue-200">
            <p className="text-lg font-semibold text-blue-800">Pet ID: {id}</p>
          </div>
        </div>

        {petData ? (
          <div className="space-y-6">
            {/* Pet Image and Basic Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Pet Image */}
                {petData.pet_image && (
                  <div className="lg:w-1/3">
                    <div className="relative overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={petData.pet_image}
                        alt={petData.pet_name || "Pet"}
                        className="w-full h-64 lg:h-80 object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                        <svg
                          className="w-6 h-6 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 24 24"
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
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                      {petData.pet_name || "Unknown Pet"}
                    </h2>
                    <p className="text-xl text-gray-600 mb-4">
                      {petData.pet_race || "Unknown Breed"} •{" "}
                      {petData.pet_gender || "Unknown Gender"}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {petData.pet || "Pet"}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {petData.pet_size || "Unknown Size"}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
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
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-full p-3 mr-3">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Basic Details
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Pet Type:</span>
                    <span className="text-gray-900 font-medium">
                      {petData.pet || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">
                      Date of Birth:
                    </span>
                    <span className="text-gray-900 font-medium">
                      {petData.pet_dob
                        ? new Date(petData.pet_dob).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Age:</span>
                    <span className="text-gray-900 font-medium">
                      {petData.preferred_age || "Unknown"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Physical Characteristics Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 rounded-full p-3 mr-3">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Physical Characteristics
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Weight:</span>
                    <span className="text-gray-900 font-medium">
                      {petData.pet_weight
                        ? `${petData.pet_weight} kg`
                        : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Height:</span>
                    <span className="text-gray-900 font-medium">
                      {petData.pet_height
                        ? `${petData.pet_height} cm`
                        : "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">
                      Microchip:
                    </span>
                    <span className="text-gray-900 font-medium">
                      {petData.pet_microchip_number || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-600">Neutered:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        petData.isNeutered === "true"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
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
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 rounded-full p-3 mr-3">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Contact Information
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Owner:</span>
                    <span className="text-gray-900 font-medium">
                      {petData?.user?.firstname +
                        " " +
                        petData?.user?.lastname || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Phone:</span>
                    <span className="text-gray-900 font-medium">
                      {petData?.user?.phone || "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-600">Address:</span>
                    <span className="text-gray-900 font-medium">
                      {petData?.user?.address || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location & Time Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="bg-orange-100 rounded-full p-3 mr-3">
                    <svg
                      className="w-6 h-6 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
                  <h3 className="text-xl font-bold text-gray-800">
                    Location & Time
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Location:</span>
                    <span className="text-gray-900 font-medium">
                      {petData.preferred_location || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-600">Distance:</span>
                    <span className="text-gray-900 font-medium">
                      {petData.distance || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-600">Posted:</span>
                    <span className="text-gray-900 font-medium">
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
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="bg-indigo-100 rounded-full p-3 mr-3">
                        <svg
                          className="w-6 h-6 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Description
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {petData.pet_description}
                    </p>
                  </div>
                )}

                {petData.notes_other && (
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="bg-yellow-100 rounded-full p-3 mr-3">
                        <svg
                          className="w-6 h-6 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Additional Notes
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-lg">
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
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <svg
                className="h-8 w-8 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Pet Information Found
            </h2>
            <p className="text-gray-600">No pet data available for ID: {id}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetLostPet;
