# Changan SAV - WhatsApp Flow Survey System

Automated satisfaction survey system for Changan Morocco using WhatsApp Flows with PostgreSQL database, analytics, and Excel export.

## 🚀 Features

- ✅ **WhatsApp Flow Integration** - 8-screen satisfaction survey with conditional logic
- ✅ **End-to-End Encryption** - RSA + AES-GCM encryption for data security
- ✅ **PostgreSQL Database** - Neon serverless database with auto-scaling
- ✅ **Auto-Calculated Analytics** - NPS scores, satisfaction metrics, sentiment analysis
- ✅ **Excel Export** - One-click CSV export with 22 formatted columns
- ✅ **Real-Time Dashboard** - Live statistics and response tracking
- ✅ **Zero Manual Intervention** - Fully automated with auto-table creation

## 📊 Survey Questions

1. **Accueil et Courtoisie** - Reception & courtesy rating
2. **Délais Respectés** - Were deadlines met?
3. **Qualité du Service** - Service quality rating
4. **Note de Recommandation** - NPS score (0-10)
5. **Remarques** - Additional comments
6. **Recontact** - Follow-up request

## 🗄️ Database Schema

24 columns including:
- **Survey fields** (8) - All form responses
- **Analytics** (5) - Satisfaction score, NPS category, sentiment, followup flag
- **Time data** (6) - Week, month, day, hour for trend analysis
- **Metadata** (5) - IDs, timestamps, raw JSON backup

## 🛠️ Tech Stack

- **Backend**: Node.js, Vercel Serverless Functions
- **Database**: Neon PostgreSQL (serverless)
- **Encryption**: Node.js crypto (RSA-2048, AES-128-GCM)
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **API**: WhatsApp Business API (Meta)

## 📦 Installation

### Prerequisites

- Node.js 18+
- Vercel account
- Neon database account
- WhatsApp Business account with Flow access

### Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/changan-sav.git
   cd changan-sav
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create Neon database**
   - Go to https://neon.tech/
   - Create project: `changan-sav`
   - Region: Europe (Frankfurt)
   - Copy connection string

4. **Configure environment variables**
   
   Add to Vercel dashboard:
   ```
   DATABASE_URL=postgresql://user:password@...
   CHANGAN_PRIVATE_KEY=[Your RSA private key]
   ```

5. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

6. **Configure WhatsApp Flow**
   - Upload public key to WhatsApp
   - Set endpoint URL to your Vercel deployment
   - Publish Flow

## 📖 Documentation

- [Complete Setup Guide](COMPLETE-SETUP-GUIDE.md) - Full walkthrough
- [Database Setup](SETUP-POSTGRES.md) - Neon database configuration
- [Flow Setup](FLOW-SETUP-GUIDE.md) - WhatsApp Flow creation
- [Encryption Guide](ENCRYPTION-SOLUTION.md) - Security implementation
- [Neon Migration](NEON-SETUP.md) - Database migration from Vercel Postgres

## 🔐 Security

- End-to-end encryption using RSA-2048 + AES-128-GCM
- Private keys stored as Vercel environment variables
- No sensitive data in code or logs
- HTTPS-only communication
- Database encryption at rest

## 📈 Analytics

### Dashboard Metrics
- Total responses (all time)
- Today's submissions
- NPS score (-100 to +100)
- Average satisfaction percentage
- Customers needing follow-up
- Last response timestamp

### Excel Export Columns
- Basic info (ID, Date/Time, Phone)
- Survey responses (8 fields)
- Analytics (NPS, satisfaction, sentiment, followup flag)
- Time data (week, month, day, hour)

## 🚦 API Endpoints

### `POST /api/flow`
Main WhatsApp Flow endpoint
- Handles encrypted ping (health check)
- Processes survey submissions
- Auto-initializes database
- Returns encrypted responses

### `GET /api/responses`
Retrieve survey data
- Returns stats + recent 50 responses
- Includes analytics for each response

### `GET /api/export`
Export to Excel
- Downloads CSV with all data
- UTF-8 BOM for Excel compatibility
- French headers and values

## 🌍 Deployment

Deployed on Vercel with:
- Production URL: https://y-gamma-six-62.vercel.app/
- Auto-scaling serverless functions
- CDN for static assets
- Automatic HTTPS

## 📊 Database Performance

**Free Tier (Neon):**
- 3 GB storage = ~3 million surveys
- 0.5 GB transfer/month
- Autoscaling compute
- 24/7 availability

## 🤝 Contributing

This is a private project for Changan Morocco. For issues or improvements, contact the development team.

## 📝 License

Proprietary - Voom Digital © 2026

## 👥 Credits

**Developed by**: Voom Digital  
**Client**: Changan Morocco  
**Platform**: WhatsApp Business API (Meta)

## 📞 Support

For technical support or questions about the system, refer to the documentation files in this repository.

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: February 2026
