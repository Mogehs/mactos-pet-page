# 🐾 Pet Lost & Found Application

A beautiful, responsive React application for finding and reuniting lost pets with their owners through WhatsApp integration.

## ✨ Features

- **🔍 Pet Search**: Search for lost pets by ID
- **📱 WhatsApp Integration**: Automatic redirection to WhatsApp with complete pet information
- **🎨 Beautiful UI**: Modern, gradient-based design with smooth animations
- **📱 Mobile Responsive**: Optimized for all device sizes
- **⚡ Real-time Loading**: Interactive loading states and error handling
- **🍞 Toast Notifications**: Non-intrusive WhatsApp redirect notifications

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd pet
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

## 🛠️ Tech Stack

- **React 19**: Latest React with hooks
- **React Router DOM**: For routing and navigation
- **Axios**: HTTP client for API requests
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server

## 📁 Project Structure

```
src/
├── assets/          # Static assets
├── components/      # React components
│   └── icons/       # SVG icon components
├── GetLostPet.jsx   # Main pet details component
├── App.jsx          # App router configuration
├── main.jsx         # Application entry point
└── index.css        # Global styles and animations
```

## 🔗 API Integration

The application expects a POST endpoint at:

```
POST http://localhost:5000/api/pet/{id}
```

Response format:

```json
{
  "pet": {
    "pet_name": "Buddy",
    "pet": "dog",
    "pet_race": "Golden Retriever",
    "pet_gender": "male",
    "pet_color": "Golden",
    "pet_size": "Medium",
    "pet_weight": "12.5",
    "pet_height": "40",
    "pet_microchip_number": "MC123456789",
    "isNeutered": "true",
    "pet_description": "Friendly and playful dog",
    "notes_other": "Needs daily walks",
    "preferred_location": "Central Park, New York",
    "distance": "2km",
    "temperament": ["Calm"],
    "pet_image": "image-url",
    "user": {
      "firstname": "John",
      "lastname": "Doe",
      "phone": "+1234567890",
      "address": "123 Main St"
    },
    "latitude": "40.7128",
    "longitude": "-74.0060"
  }
}
```

## 🎯 Key Features

### WhatsApp Integration

- **3-second countdown** before redirect
- **Complete pet information** in message
- **Location sharing** with Google Maps link
- **Automatic tab closure** after redirect

### Responsive Design

- **Mobile-first** approach
- **Beautiful gradients** and animations
- **Card-based layout** for better organization
- **Hover effects** and transitions

### User Experience

- **Loading states** with animated spinners
- **Error handling** with retry functionality
- **Toast notifications** for actions
- **Cancel options** for user control

## 📱 WhatsApp Message Format

The application sends a comprehensive message including:

- Pet basic information (name, type, breed, etc.)
- Physical characteristics (weight, height, microchip)
- Owner contact details
- Pet description and notes
- Location information with map link

## 🎨 Customization

### Colors

The application uses a blue-to-purple gradient theme. Modify colors in:

- `src/index.css` for global styles
- Individual components for specific elements

### Icons

All SVG icons are modularized in `src/components/icons/` for easy customization.

## 🚀 Deployment

1. Build the application:

```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support or questions, please contact the development team.

---

Made with ❤️ for reuniting pets with their families
