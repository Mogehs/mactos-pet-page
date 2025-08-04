import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QrCode = () => {
  const { id } = useParams();
  const [data, setData] = useState({});
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
        console.log(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch QR code data");
        console.error("Error fetching QR code data:", err);
      } finally {
        setLoading(false);
      }
    };
    getQrCodeInfo();
  }, [id]);

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
    <div className="min-h-screen p-4" style={{ backgroundColor: "#FAFAFA" }}>
      {/* Floating WhatsApp Button */}
      {owner?.phone && (
        <button
          onClick={() => setShowContactForm(true)}
          className="fixed top-6 right-6 z-50 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 animate-pulse"
          style={{ backgroundColor: "#3B9577" }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2d7a63")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3B9577")}
          title={`Contactar al dueño por WhatsApp`}
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
        </button>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                    {pet.pet_name || "Mascota sin nombre"}
                  </h2>
                  <p className="text-xl mb-4" style={{ color: "#606873" }}>
                    {pet.preferred_age || "Edad desconocida"} •{" "}
                    {pet.pet_size || "Tamaño desconocido"}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: "#ECEFF2", color: "#3B9577" }}
                    >
                      {pet.isNeutered === "Yes"
                        ? "Esterilizado"
                        : "No esterilizado"}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: "#ECEFF2", color: "#3B9577" }}
                    >
                      {pet.pet_socialize === "Yes"
                        ? "Socializado"
                        : "No socializado"}
                    </span>
                    {pet.pet_microchip_number &&
                      pet.pet_microchip_number !== "N/A" && (
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: "#ECEFF2",
                            color: "#3B9577",
                          }}
                        >
                          Microchip: {pet.pet_microchip_number}
                        </span>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
              <div
                className="flex justify-between items-center py-2 border-b"
                style={{ borderColor: "#D9DFE6" }}
              >
                <span className="font-medium" style={{ color: "#606873" }}>
                  Teléfono:
                </span>
                <span className="font-medium" style={{ color: "#39434F" }}>
                  {owner.phone || "No proporcionado"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-medium" style={{ color: "#606873" }}>
                  Email:
                </span>
                <span className="font-medium" style={{ color: "#39434F" }}>
                  {owner.email || "No proporcionado"}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          {pet.notes_other && (
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
