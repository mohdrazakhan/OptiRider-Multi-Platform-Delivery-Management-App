<div align="center">

# 🚀 OptiRider

### Multi-Platform Delivery Management System

<img src="https://img.shields.io/badge/Phase-1%20MVP-success?style=for-the-badge&logo=rocket" alt="Phase 1"/>
<img src="https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React Native"/>
<img src="https://img.shields.io/badge/Expo-~54.0-000020?style=for-the-badge&logo=expo" alt="Expo"/>
<img src="https://img.shields.io/badge/Firebase-12.5.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase"/>

<p align="center">
  <strong>🎯 Optimize your delivery earnings across multiple platforms</strong>
</p>

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=28&pause=1000&color=4F46E5&center=true&vCenter=true&width=600&lines=Swiggy+%7C+Zomato+%7C+Uber+Eats;Blinkit+%7C+Multi-Platform;Smart+Analytics+Dashboard;Real-Time+Earnings+Tracking" alt="Typing SVG" />

</div>

---

## 📱 What is OptiRider?

OptiRider is a **unified delivery management app** designed for gig-economy riders who work across multiple food and grocery delivery platforms. Track your earnings, analyze performance, and maximize your income—all in one place!

<div align="center">

### 🎨 Features at a Glance

| Feature | Status | Description |
|---------|--------|-------------|
| 📊 **Smart Dashboard** | ✅ Live | Real-time earnings analytics with platform breakdown |
| 📝 **Trip Ledger** | ✅ Live | Manual trip logging with instant sync |
| 💰 **EPH Calculator** | ✅ Live | Earnings Per Hour tracking |
| 🔐 **Secure Auth** | ✅ Live | Firebase email/password authentication |
| 📈 **Platform Analytics** | ✅ Live | Compare performance across Swiggy, Zomato, Uber Eats & Blinkit |
| 💡 **Smart Insights** | ✅ Live | AI-powered recommendations (Phase 1 basics) |

</div>

---

## 🎯 3-Phase Development Roadmap

<div align="center">

```mermaid
graph LR
    A[📱 Phase 1<br/>MVP Core] --> B[🔌 Phase 2<br/>API Integration]
    B --> C[🤖 Phase 3<br/>AI Intelligence]
    
    style A fill:#10B981,stroke:#059669,stroke-width:3px,color:#fff
    style B fill:#F59E0B,stroke:#D97706,stroke-width:3px,color:#fff
    style C fill:#6366F1,stroke:#4F46E5,stroke-width:3px,color:#fff
```

</div>

### 🟢 **Phase 1: MVP Foundation** `(Current Release)`

**Manual Data Entry & Analytics Dashboard**

- ✅ Trip logging with platform, earnings & duration
- ✅ Real-time Firebase Firestore sync
- ✅ Dashboard with key metrics (Total Earnings, EPH, Trip Count)
- ✅ Platform-wise breakdown with visual percentages
- ✅ Smart insights & milestone tracking
- ✅ Secure authentication (Email/Password)
- ✅ Beautiful Material Design UI

### 🟡 **Phase 2: Deep Integration** `(Coming Q1 2026)`

**Automated Platform Control via APIs**

- 🔄 Direct API integration with delivery platforms
- 🔄 Auto-sync trip data from Swiggy, Zomato, Uber Eats, Blinkit
- 🔄 One-tap multi-platform status toggle (Go Online/Offline)
- 🔄 Real-time order notifications aggregation
- 🔄 Accessibility-based automation (Android)
- 🔄 Live earnings tracker without manual entry

### 🔵 **Phase 3: AI-Powered Optimization** `(Coming Q2 2026)`

**Machine Learning & Predictive Analytics**

- 🤖 AI-driven route optimization
- 🤖 Peak hour prediction & earnings forecasting
- 🤖 Smart platform recommendations based on historical data
- 🤖 Heatmap analysis for high-demand zones
- 🤖 Automated acceptance/rejection suggestions
- 🤖 Personalized earning strategies

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo Go app on your mobile device
- Firebase account (free tier works!)

### Installation

```bash
# Clone the repository
git clone https://github.com/mohdrazakhan/OptiRider-Multi-Platform-Delivery-Management-App.git

# Navigate to project directory
cd OptiRiderApp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Start the development server
npx expo start
```

### 📱 Run on Device

1. Install **Expo Go** from [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) or [App Store](https://apps.apple.com/app/expo-go/id982107779)
2. Scan the QR code from your terminal
3. Start logging trips and watch your earnings grow! 📈

---

## 🎨 Screenshots

<div align="center">

### 🏠 Dashboard

<img src="https://via.placeholder.com/300x600/4F46E5/FFFFFF?text=Smart+Dashboard" alt="Dashboard" width="250"/>

*Real-time analytics with platform breakdown and EPH tracking*

### 📝 Trip Ledger

<img src="https://via.placeholder.com/300x600/10B981/FFFFFF?text=Trip+Ledger" alt="Ledger" width="250"/>

*Easy trip logging with recent history*

### 🔐 Authentication

<img src="https://via.placeholder.com/300x600/FDBF00/000000?text=Welcome+Screen" alt="Auth" width="250"/>

*Secure email/password login*

</div>

---

## 🛠️ Tech Stack

<div align="center">

| Technology | Purpose |
|------------|---------|
| ⚛️ **React Native** | Cross-platform mobile framework |
| 🎨 **Expo SDK 54** | Development toolchain & build system |
| 🔥 **Firebase Firestore** | Real-time NoSQL database |
| 🔐 **Firebase Auth** | User authentication with persistence |
| 🧭 **React Navigation** | Tab & stack navigation |
| 💾 **AsyncStorage** | Local data persistence |
| 📊 **Custom Analytics** | Platform breakdown & EPH calculation |

</div>

---

## 📂 Project Structure

```
OptiRiderApp/
├── 📱 App.js                  # Main app container & navigation
├── 🖼️  screens/
│   ├── WelcomeScreen.tsx     # Onboarding landing page
│   ├── LoginScreen.tsx       # Email/password login
│   └── SignUpScreen.tsx      # Account creation
├── 🎨 components/            # Reusable UI components
├── 🌐 assets/                # Images, fonts, icons
├── 🔧 .env.example           # Environment template
├── 🔐 .env                   # Your Firebase config (gitignored)
└── 📚 README.md              # You are here!
```

---

## 🔐 Security

Your API keys are **safe**! We use environment variables to protect sensitive data:

- ✅ `.env` is gitignored (never committed)
- ✅ `.env.example` provides a template
- ✅ `check-secrets.sh` scans for exposed credentials
- ✅ Firebase security rules protect your data

See [SECURITY.md](./SECURITY.md) for detailed setup instructions.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🍴 Fork the repository
2. 🔨 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🎉 Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Upcoming Features

<div align="center">

| Feature | Phase | ETA |
|---------|-------|-----|
| 🗺️ Route Optimization | 3 | Q2 2026 |
| 📊 Advanced Analytics | 2 | Q1 2026 |
| 🔔 Push Notifications | 2 | Q1 2026 |
| 🌙 Dark Mode | 1.5 | Q4 2025 |
| 📱 Platform Auto-Sync | 2 | Q1 2026 |
| 🤖 AI Recommendations | 3 | Q2 2026 |

</div>

---

## 📞 Support

Having issues? We're here to help!

- 📧 Email: support@optirider.com
- 🐛 [Report a Bug](https://github.com/mohdrazakhan/OptiRider-Multi-Platform-Delivery-Management-App/issues)
- 💡 [Request a Feature](https://github.com/mohdrazakhan/OptiRider-Multi-Platform-Delivery-Management-App/issues/new?labels=enhancement)

---

<div align="center">

### 💖 Built with Love for Delivery Riders

**Made in India 🇮🇳 | B.Tech Major Project 2025**

<img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge" alt="Made with Love"/>
<img src="https://img.shields.io/badge/Powered%20by-Coffee%20☕-brown?style=for-the-badge" alt="Powered by Coffee"/>

---

⭐ **Star this repo if you found it helpful!** ⭐

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=18&pause=1000&color=10B981&center=true&vCenter=true&width=500&lines=Maximize+Your+Earnings;Track+Every+Trip;Optimize+Every+Hour;Ride+Smarter%2C+Earn+More!" alt="Footer Typing" />

</div>
