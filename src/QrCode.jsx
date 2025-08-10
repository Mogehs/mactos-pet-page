import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QrCode = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [finderPhone, setFinderPhone] = useState("");
  const [finderLocation, setFinderLocation] = useState("");
  const [finderLatitude, setFinderLatitude] = useState("");
  const [finderLongitude, setFinderLongitude] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    const getQrCodeInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `https://mascotas-backend.onrender.com/api/qrcode/${id}`
        );
        setData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch QR code data");
        console.error("Error fetching QR code data:", err);
      } finally {
        setLoading(false);
      }
    };

    getQrCodeInfo();
  }, [id]);

  useEffect(() => {
    const getMedicalHistory = async () => {
      if (data?.data?.pet?._id) {
        try {
          const response = await axios.post(
            "https://mascotas-backend.onrender.com/api/medical",
            {
              id: data.data.pet._id,
            }
          );
          console.log("Data fetched of medical history:", response.data);
          if (response.data.success && response.data.data?.length > 0) {
            setMedicalHistory(response.data.data[0]);
          }
        } catch (error) {
          console.error("Error fetching medical history:", error);
        }
      }
    };
    getMedicalHistory();
  }, [data]);

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
          alert(
            "No se pudo obtener tu ubicación. Por favor, ingrésala manualmente."
          );
        }
      );
    } else {
      alert("La geolocalización no es compatible con este navegador.");
    }
  };

  // Function to handle WhatsApp contact
  const handleWhatsAppContact = () => {
    if (!data?.data?.pet || !data?.data?.owner) return;

    // Check if finder details are provided
    if (!finderPhone.trim()) {
      alert(
        "Por favor ingresa tu número de teléfono antes de contactar al dueño."
      );
      return;
    }

    const pet = data.data.pet;
    const owner = data.data.owner;
    const petName = pet.pet_name || "tu mascota";
    const ownerPhone = owner.phone || "";

    // Create comprehensive WhatsApp message with all available data
    let message = `¡Hola! He encontrado a tu mascota ${petName}.`;

    // Add pet details
    if (pet.pet_size) message += `\n\n🐾 Tamaño: ${pet.pet_size}`;
    if (pet.preferred_age) message += `\n📅 Edad: ${pet.preferred_age}`;
    if (pet.pet_microchip_number && pet.pet_microchip_number !== "N/A") {
      message += `\n🔗 Microchip: ${pet.pet_microchip_number}`;
    }
    if (pet.isNeutered) message += `\n⚧ Esterilizado: ${pet.isNeutered}`;

    // Add description if available
    if (pet.notes_other) message += `\n\n📝 Notas: ${pet.notes_other}`;

    // Add finder's location information
    if (finderLatitude && finderLongitude) {
      message += `\n\n📍 Mi ubicación actual: https://maps.google.com/?q=${finderLatitude},${finderLongitude}`;
    } else if (finderLocation.trim()) {
      message += `\n\n📍 Mi ubicación actual: ${finderLocation}`;
    }

    // Add finder's contact information
    message += `\n\n📞 Mi teléfono: ${finderPhone}`;

    // Add owner information if available
    if (owner.email) message += `\n📧 Tu email: ${owner.email}`;
    if (pet.preferred_location && pet.preferred_location !== "N/A") {
      message += `\n📍 Ubicación preferida: ${pet.preferred_location}`;
    }

    message += `\n\n¡Por favor contáctame lo antes posible para coordinar la devolución de ${petName}!`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL with owner's phone number
    const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    // Close the current tab/window after a brief delay to ensure WhatsApp opens
    setTimeout(() => {
      window.close();
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="relative">
              <div
                className="animate-spin rounded-full h-16 w-16 border-4"
                style={{ borderColor: "#D9DFE6" }}
              ></div>
              <div
                className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent absolute top-0 left-0"
                style={{ borderColor: "#3B9577" }}
              ></div>
            </div>
            <p
              className="mt-6 text-xl font-medium"
              style={{ color: "#606873" }}
            >
              Cargando información...
            </p>
            <p className="mt-2" style={{ color: "#808B9A" }}>
              Por favor espera mientras obtenemos los detalles
            </p>
          </div>
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
                ¡Algo salió mal!
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
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if pet data is available
  if (!data?.data?.pet) {
    return (
      <div className="min-h-screen p-4" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="max-w-4xl mx-auto pt-12">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#39434F" }}
            >
              🐾 Mascotas App
            </h1>
            <div
              className="inline-block rounded-full px-6 py-3 shadow-lg border"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#D9DFE6" }}
            >
              <p className="text-lg font-semibold" style={{ color: "#3B9577" }}>
                Registro de Mascotas
              </p>
            </div>
          </div>

          {/* Main Card */}
          <div
            className="rounded-2xl shadow-xl p-8 md:p-12 border text-center"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#D9DFE6" }}
          >
            <div
              className="mx-auto flex items-center justify-center h-24 w-24 rounded-full mb-6"
              style={{ backgroundColor: "#ECEFF2" }}
            >
              <svg
                className="h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "#3B9577" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: "#39434F" }}
            >
              ¡Mascota no registrada!
            </h2>

            <p
              className="text-lg mb-8 leading-relaxed"
              style={{ color: "#606873" }}
            >
              Esta mascota aún no está registrada en nuestra plataforma. Para
              proteger a tu mascota y facilitar su localización en caso de
              pérdida, regístrala ahora en la aplicación Mascotas.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "#ECEFF2" }}
              >
                <div
                  className="flex items-center justify-center h-12 w-12 rounded-full mx-auto mb-3"
                  style={{ backgroundColor: "#3B9577" }}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: "#FFFFFF" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "#39434F" }}>
                  Registro Seguro
                </h3>
                <p className="text-sm" style={{ color: "#606873" }}>
                  Mantén los datos de tu mascota seguros y actualizados
                </p>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "#ECEFF2" }}
              >
                <div
                  className="flex items-center justify-center h-12 w-12 rounded-full mx-auto mb-3"
                  style={{ backgroundColor: "#3B9577" }}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: "#FFFFFF" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "#39434F" }}>
                  Localización Rápida
                </h3>
                <p className="text-sm" style={{ color: "#606873" }}>
                  Encuentra a tu mascota perdida más rápidamente
                </p>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "#ECEFF2" }}
              >
                <div
                  className="flex items-center justify-center h-12 w-12 rounded-full mx-auto mb-3"
                  style={{ backgroundColor: "#3B9577" }}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: "#FFFFFF" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "#39434F" }}>
                  Contacto Directo
                </h3>
                <p className="text-sm" style={{ color: "#606873" }}>
                  Comunicación directa con quien encuentre tu mascota
                </p>
              </div>
            </div>

            {/* Download Button */}
            <div className="space-y-4">
              <button
                onClick={() =>
                  window.open("https://play.google.com/store", "_blank")
                }
                className="w-full md:w-auto px-8 py-4 rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold text-lg shadow-lg"
                style={{ backgroundColor: "#3B9577", color: "#FFFFFF" }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#2d7a63")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#3B9577")}
              >
                📱 Descargar Mascotas App
              </button>

              <p className="text-sm" style={{ color: "#808B9A" }}>
                Disponible para Android y iOS
              </p>
            </div>
          </div>

          {/* QR Code Display */}
          {data?.data?.qrCodeImage && (
            <div className="mt-8 text-center">
              <div
                className="inline-block p-4 rounded-lg"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D9DFE6",
                }}
              >
                <img
                  src={data.data.qrCodeImage}
                  alt="QR Code"
                  className="w-32 h-32 mx-auto"
                />
                <p className="mt-2 text-sm" style={{ color: "#808B9A" }}>
                  Código QR de la mascota
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Pet is available - show contact form
  const pet = data.data.pet;
  const owner = data.data.owner;

  return (
    <div className="min-h-screen p-4 pb-24" style={{ backgroundColor: "#FAFAFA" }}>
      {/* Full Width Send Location Button - Fixed at bottom */}
      {owner?.phone && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
          <button
            onClick={() => setShowContactForm(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] font-bold text-lg flex items-center justify-center gap-2"
            title="Enviar ubicación al dueño"
          >
            <svg
              className="w-6 h-6"
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
            Enviar ubicación
          </button>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xl bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-2xl shadow-2xl p-6 w-full max-w-md"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <h3
              className="text-2xl font-bold mb-6 text-center"
              style={{ color: "#39434F" }}
            >
              Tu Información de Contacto
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: "#606873" }}
                >
                  Tu Número de Teléfono *
                </label>
                <input
                  type="tel"
                  value={finderPhone}
                  onChange={(e) => setFinderPhone(e.target.value)}
                  placeholder="Ingresa tu número de teléfono"
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
                  Tu Ubicación Actual
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={finderLocation}
                    onChange={(e) => setFinderLocation(e.target.value)}
                    placeholder="Ingresa tu ubicación o dirección"
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
                    title="Obtener ubicación actual"
                  >
                    📍
                  </button>
                </div>
                <p className="text-xs mt-1" style={{ color: "#808B9A" }}>
                  Haz clic en 📍 para detectar automáticamente tu ubicación
                </p>
              </div>

              {finderLatitude && finderLongitude && (
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#ECEFF2" }}
                >
                  <p className="text-sm" style={{ color: "#3B9577" }}>
                    ✓ Ubicación detectada: {finderLatitude}, {finderLongitude}
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
                Cancelar
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
                Enviar WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 pt-8">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#39434F" }}
          >
            🐾 ¡Mascota Encontrada!
          </h1>
          <div
            className="inline-block rounded-full px-6 py-3 shadow-lg border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#D9DFE6" }}
          >
            <p className="text-lg font-semibold" style={{ color: "#3B9577" }}>
              Información de la mascota
            </p>
          </div>
        </div>

        {/* Pet Information Card */}
        <div className="space-y-6">
          {/* Microchip Alert - Prominently displayed */}
          {pet.pet_microchip_number && pet.pet_microchip_number !== "N/A" && (
            <div className="rounded-2xl shadow-xl p-6 border-2 border-red-500 bg-red-50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-500 rounded-full p-3 mr-3">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-700 mb-1">
                    MICROCHIP REGISTRADO
                  </h3>
                  <p className="text-3xl font-mono font-bold text-red-800">
                    {pet.pet_microchip_number}
                  </p>
                </div>
              </div>
              <p className="text-center text-red-600 font-medium">
                Esta mascota tiene microchip registrado. Contacta inmediatamente
                al dueño.
              </p>
            </div>
          )}

          {/* Pet Image and Basic Info Card */}
          <div
            className="rounded-2xl shadow-xl p-6 md:p-8 border hover:shadow-2xl transition-all duration-300"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#D9DFE6" }}
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Pet Image */}
              {pet.pet_image && (
                <div className="lg:w-1/3">
                  <div
                    className="relative overflow-hidden rounded-xl"
                    style={{ backgroundColor: "#ECEFF2" }}
                  >
                    <img
                      src={pet.pet_image}
                      alt={pet.pet_name || "Mascota"}
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
                    {pet.pet_name || "Mascota"}
                  </h2>
                  <p className="text-xl mb-4" style={{ color: "#606873" }}>
                    {pet.preferred_age && pet.preferred_age !== "1-5 años" && pet.preferred_age}
                    {pet.preferred_age && pet.preferred_age !== "1-5 años" && pet.pet_size && pet.pet_size !== "Todos" && " • "}
                    {pet.pet_size && pet.pet_size !== "Todos" && pet.pet_size}
                  </p>

                  {/* Enhanced Pet Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {pet.isNeutered && pet.isNeutered !== "No" && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Estado de Esterilización
                        </h4>
                        <p
                          className="text-lg font-medium"
                          style={{
                            color:
                              pet.isNeutered === "Yes" ? "#3B9577" : "#d62d20",
                          }}
                        >
                          {pet.isNeutered === "Yes"
                            ? "✓ Esterilizado"
                            : "✗ No esterilizado"}
                        </p>
                      </div>
                    )}

                    {pet.pet_socialize && pet.pet_socialize !== "No" && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Socialización
                        </h4>
                        <p
                          className="text-lg font-medium"
                          style={{
                            color:
                              pet.pet_socialize === "Yes" ? "#3B9577" : "#d62d20",
                          }}
                        >
                          {pet.pet_socialize === "Yes"
                            ? "✓ Socializado"
                            : "✗ No socializado"}
                        </p>
                      </div>
                    )}

                    {pet.pet_race && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Raza
                        </h4>
                        <p className="text-lg font-medium text-gray-800">
                          {pet.pet_race}
                        </p>
                      </div>
                    )}

                    {pet.pet_weight && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Peso
                        </h4>
                        <p className="text-lg font-medium text-gray-800">
                          {pet.pet_weight}
                        </p>
                      </div>
                    )}

                    {pet.pet_gender && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Género
                        </h4>
                        <p className="text-lg font-medium text-gray-800">
                          {pet.pet_gender}
                        </p>
                      </div>
                    )}

                    {pet.pet_color && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          Color
                        </h4>
                        <p className="text-lg font-medium text-gray-800">
                          {pet.pet_color}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Temperament Section */}
          {pet.temperament && pet.temperament.length > 0 && (
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold" style={{ color: "#39434F" }}>
                  Temperamento
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {pet.temperament.map((trait, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Preferred Times Section */}
          {pet.preferred_time && pet.preferred_time.length > 0 && (
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold" style={{ color: "#39434F" }}>
                  Horarios Preferidos
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {pet.preferred_time.map((time, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200"
                  >
                    {time}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pet Description/Medical Info */}
          {pet.pet_description && (
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
                    style={{ color: "#d62d20" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold" style={{ color: "#39434F" }}>
                  Información Médica/Descripción
                </h3>
              </div>
              <p
                className="leading-relaxed text-lg bg-red-50 p-4 rounded-lg border border-red-200"
                style={{ color: "#d62d20" }}
              >
                <strong>IMPORTANTE:</strong> {pet.pet_description}
              </p>
            </div>
          )}

          {/* Notes Section - only if not default */}
          {pet.notes_other && pet.notes_other !== "Prefiere perros tranquilos" && (
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold" style={{ color: "#39434F" }}>
                  Notas Adicionales
                </h3>
              </div>
              <p
                className="leading-relaxed text-lg"
                style={{ color: "#606873" }}
              >
                {pet.notes_other}
              </p>
            </div>
          )}

          {/* Owner Information */}
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold" style={{ color: "#39434F" }}>
                Información del Dueño
              </h3>
            </div>
            <div className="space-y-3">
              {owner.phone && (
                <div
                  className="flex justify-between items-center py-2 border-b"
                  style={{ borderColor: "#D9DFE6" }}
                >
                  <span className="font-medium" style={{ color: "#606873" }}>
                    Teléfono:
                  </span>
                  <span className="font-medium" style={{ color: "#39434F" }}>
                    {owner.phone}
                  </span>
                </div>
              )}
              {owner.email && (
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium" style={{ color: "#606873" }}>
                    Email:
                  </span>
                  <span className="font-medium" style={{ color: "#39434F" }}>
                    {owner.email}
                  </span>
                </div>
              )}
              {pet.preferred_location && pet.preferred_location !== "N/A" && (
                <div
                  className="flex justify-between items-center py-2 border-t"
                  style={{ borderColor: "#D9DFE6" }}
                >
                  <span className="font-medium" style={{ color: "#606873" }}>
                    Ubicación Preferida:
                  </span>
                  <span className="font-medium" style={{ color: "#39434F" }}>
                    {pet.preferred_location}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          {/*{pet.notes_other && (*/}
          {/*   <div*/}
          {/*    className="rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-all duration-300"*/}
          {/*    style={{ backgroundColor: "#FFFFFF", borderColor: "#D9DFE6" }}*/}
          {/*  >*/}
          {/*    <div className="flex items-center mb-4">*/}
          {/*      <div*/}
          {/*        className="rounded-full p-3 mr-3"*/}
          {/*        style={{ backgroundColor: "#ECEFF2" }}*/}
          {/*      >*/}
          {/*        <svg*/}
          {/*          className="w-6 h-6"*/}
          {/*          fill="none"*/}
          {/*          stroke="currentColor"*/}
          {/*          viewBox="0 0 24 24"*/}
          {/*          style={{ color: "#FFC542" }}*/}
          {/*        >*/}
          {/*          <path*/}
          {/*            strokeLinecap="round"*/}
          {/*            strokeLinejoin="round"*/}
          {/*            strokeWidth="2"*/}
          {/*            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"*/}
          {/*          />*/}
          {/*        </svg>*/}
          {/*      </div>*/}
          {/*      <h3 className="text-xl font-bold" style={{ color: "#39434F" }}>*/}
          {/*        Notas Adicionales*/}
          {/*      </h3>*/}
          {/*    </div>*/}
          {/*    <p*/}
          {/*      className="leading-relaxed text-lg"*/}
          {/*      style={{ color: "#606873" }}*/}
          {/*    >*/}
          {/*      {pet.notes_other}*/}
          {/*    </p>*/}
          {/*  </div>*/}
          {/*)}*/}

          {/* Medical History Section */}
          {medicalHistory && (
            <div
              className="rounded-2xl shadow-xl p-6 border-2 hover:shadow-2xl transition-all duration-300"
              style={{ backgroundColor: "#FFFFFF", borderColor: "#3B9577" }}
            >
              <div className="flex items-center mb-6">
                <div
                  className="rounded-full p-3 mr-3"
                  style={{ backgroundColor: "#3B9577" }}
                >
                  <svg
                    className="w-8 h-8 text-white"
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
                <h3 className="text-2xl font-bold" style={{ color: "#39434F" }}>
                  Historial Médico
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Medications Section */}
                {(medicalHistory.drug_name && medicalHistory.drug_name !== "N/A") && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-bold text-red-700 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      💊 MEDICAMENTOS
                    </h4>
                    <div className="space-y-2">
                      <p><strong>Medicamento:</strong> {medicalHistory.drug_name}</p>
                      {medicalHistory.dosage && medicalHistory.dosage !== "N/A" && (
                        <p><strong>Dosis:</strong> {medicalHistory.dosage}</p>
                      )}
                      {medicalHistory.frequency && medicalHistory.frequency !== "N/A" && (
                        <p><strong>Frecuencia:</strong> {medicalHistory.frequency}</p>
                      )}
                      {medicalHistory.dose_start_date && medicalHistory.dose_start_date !== "N/A" && (
                        <p><strong>Inicio:</strong> {medicalHistory.dose_start_date}</p>
                      )}
                      {medicalHistory.dose_end_date && medicalHistory.dose_end_date !== "N/A" && (
                        <p><strong>Fin:</strong> {medicalHistory.dose_end_date}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Allergies Section */}
                {(medicalHistory.allergy_title && medicalHistory.allergy_title !== "N/A") && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-bold text-orange-700 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      ⚠️ ALERGIAS
                    </h4>
                    <div className="space-y-2">
                      <p><strong>Alergia:</strong> {medicalHistory.allergy_title}</p>
                      {medicalHistory.allergy_type && medicalHistory.allergy_type !== "N/A" && (
                        <p><strong>Tipo:</strong> {medicalHistory.allergy_type}</p>
                      )}
                      {medicalHistory.allergy_symptoms && medicalHistory.allergy_symptoms !== "N/A" && (
                        <p><strong>Síntomas:</strong> {medicalHistory.allergy_symptoms}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Deworming Section */}
                {(medicalHistory.pet_deworming_date && medicalHistory.pet_deworming_date !== "N/A") && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-bold text-green-700 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      🛡️ DESPARASITACIÓN
                    </h4>
                    <div className="space-y-2">
                      <p><strong>Fecha:</strong> {medicalHistory.pet_deworming_date}</p>
                      {medicalHistory.pet_deworming_type && medicalHistory.pet_deworming_type !== "N/A" && (
                        <p><strong>Tipo:</strong> {medicalHistory.pet_deworming_type}</p>
                      )}
                      {medicalHistory.pet_deworming_method && medicalHistory.pet_deworming_method !== "N/A" && (
                        <p><strong>Método:</strong> {medicalHistory.pet_deworming_method}</p>
                      )}
                      {medicalHistory.used_product_in_deworming && medicalHistory.used_product_in_deworming !== "N/A" && (
                        <p><strong>Producto:</strong> {medicalHistory.used_product_in_deworming}</p>
                      )}
                      {medicalHistory.pet_deworming_reminder_date && medicalHistory.pet_deworming_reminder_date !== "N/A" && (
                        <p><strong>Próxima:</strong> {medicalHistory.pet_deworming_reminder_date}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Vaccinations Section */}
                {(medicalHistory.pet_vaccine && medicalHistory.pet_vaccine !== "N/A") && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-bold text-blue-700 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      💉 VACUNAS
                    </h4>
                    <div className="space-y-2">
                      <p><strong>Vacuna:</strong> {medicalHistory.pet_vaccine}</p>
                      {medicalHistory.pet_vaccine_date && medicalHistory.pet_vaccine_date !== "N/A" && (
                        <p><strong>Fecha:</strong> {medicalHistory.pet_vaccine_date}</p>
                      )}
                      {medicalHistory.pet_vaccine_reminder_date && medicalHistory.pet_vaccine_reminder_date !== "N/A" && (
                        <p><strong>Próxima:</strong> {medicalHistory.pet_vaccine_reminder_date}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Emergency Contact Section */}
                {(medicalHistory.emergency_veterinarian_name && medicalHistory.emergency_veterinarian_name !== "N/A") && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-bold text-purple-700 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      🚨 CONTACTO DE EMERGENCIA
                    </h4>
                    <div className="space-y-2">
                      <p><strong>Veterinario:</strong> {medicalHistory.emergency_veterinarian_name}</p>
                      {medicalHistory.emergency_phone && medicalHistory.emergency_phone !== "N/A" && (
                        <p><strong>Teléfono:</strong> {medicalHistory.emergency_phone}</p>
                      )}
                      {medicalHistory.emergency_email && medicalHistory.emergency_email !== "N/A" && (
                        <p><strong>Email:</strong> {medicalHistory.emergency_email}</p>
                      )}
                      {medicalHistory.emergency_address && medicalHistory.emergency_address !== "N/A" && (
                        <p><strong>Dirección:</strong> {medicalHistory.emergency_address}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Disease/Conditions Section */}
                {(medicalHistory.pet_disease_name && medicalHistory.pet_disease_name !== "N/A") && (
                  <div className="bg-red-100 p-4 rounded-lg border border-red-300">
                    <h4 className="font-bold text-red-800 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      🏥 CONDICIONES MÉDICAS
                    </h4>
                    <div className="space-y-2">
                      <p><strong>Enfermedad:</strong> {medicalHistory.pet_disease_name}</p>
                      {medicalHistory.pet_disease_description && medicalHistory.pet_disease_description !== "N/A" && (
                        <p><strong>Descripción:</strong> {medicalHistory.pet_disease_description}</p>
                      )}
                      {medicalHistory.pet_date_diagnosis && medicalHistory.pet_date_diagnosis !== "N/A" && (
                        <p><strong>Fecha de Diagnóstico:</strong> {medicalHistory.pet_date_diagnosis}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Medical Images */}
              {medicalHistory.pet_deworming_image && medicalHistory.pet_deworming_image !== "N/A" && (
                <div className="mt-6">
                  <h4 className="font-bold text-gray-700 mb-3">📄 Documentos Médicos</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-2"><strong>Comprobante de Desparasitación:</strong></p>
                    <img
                      src={medicalHistory.pet_deworming_image}
                      alt="Comprobante de desparasitación"
                      className="max-w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* WhatsApp Message */}
          {data.data.whatsappMessage && (
            <div
              className="rounded-2xl shadow-lg p-6 border"
              style={{ backgroundColor: "#ECEFF2", borderColor: "#D9DFE6" }}
            >
              <div className="text-center">
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "#39434F" }}
                >
                  Mensaje predeterminado:
                </h3>
                <p className="italic" style={{ color: "#606873" }}>
                  "{data.data.whatsappMessage}"
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrCode;
