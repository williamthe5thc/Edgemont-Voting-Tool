# Dia de Los Ancestros Cooking Competition Voting System

# Dia de Los Ancestros Voting Application

A web-based voting system for managing dish voting in a cooking competition, built with vanilla JavaScript and Vercel KV storage.

## 🌟 Features

### Voting System
- Vote for favorite dishes across multiple categories:
  - Bread
  - Appetizers
  - Dessert
  - Entrée & Soups
- Up to 2 votes per category
- Real-time input validation
- Local storage for draft votes
- Prevention of duplicate dish selections

### Admin Panel
- Manage number of dishes per category
- Clear all votes with double confirmation
- Real-time settings updates

### Results Display
- Live vote counting
- Top 3 rankings per category
- Medal indicators (🥇, 🥈, 🥉)

## 🛠 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Vercel Serverless Functions
- **Database**: Vercel KV (Redis-compatible)
- **Additional Storage**: Google Sheets integration
- **Styling**: Custom CSS with Responsive Design

## 📁 Project Structure

```
/
├── api/                      # API endpoints
│   ├── clear-votes.js       # Clear votes endpoint
│   ├── config.js            # API configuration
│   ├── get-settings.js      # Settings retrieval
│   ├── results.js           # Results endpoint
│   ├── update-settings.js   # Settings update
│   └── vote.js              # Vote submission
├── js/
│   ├── utils/               # Utility functions
│   │   ├── apiUtils.js      # API interactions
│   │   ├── configUtils.js   # Configuration
│   │   ├── domUtils.js      # DOM manipulation
│   │   ├── errorUtils.js    # Error handling
│   │   ├── eventUtils.js    # Event management
│   │   ├── formUtils.js     # Form handling
│   │   ├── storageUtils.js  # Local storage
│   │   ├── transformUtils.js # Data transformation
│   │   ├── uiUtils.js       # UI components
│   │   └── validationUtils.js # Input validation
│   ├── admin.js             # Admin panel logic
│   ├── categoryLoader.js    # Category loading
│   ├── constants.js         # App constants
│   ├── main.js              # Main application
│   ├── preloader.js         # Loading screen
│   ├── results-display.js   # Results page
│   └── voteSubmitter.js     # Vote submission
├── admin.html               # Admin interface
├── index.html              # Voting interface
├── results.html           # Results display
└── styles.css             # Global styles

```

## 🚀 Installation

1. **Clone the repository**
```bash
git clone [your-repo-url]
cd dia-de-los-ancestros-voting
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file with:
```env
KV_URL=your-vercel-kv-url
KV_REST_API_URL=your-kv-rest-api-url
KV_REST_API_TOKEN=your-kv-rest-api-token
KV_REST_API_READ_ONLY_TOKEN=your-read-only-token
```

4. **Development**
```bash
npm run dev
```

5. **Deploy**
```bash
npm run deploy
```

## 💻 Usage

### For Voters
1. Visit the main page
2. Enter dish numbers (1-N) for each category
3. Submit votes
4. View confirmation

### For Administrators
1. Access `/admin.html`
2. Update dish counts per category
3. Clear votes if needed
4. Monitor voting progress

### Viewing Results
- Visit `/results.html`
- See real-time rankings
- Track vote counts

## 🔒 Security Features

- No personal data collection
- Input validation at multiple levels
- Secure API endpoints
- Data integrity checks

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## ⚠️ Known Limitations

- No vote modification after submission
- Admin actions are irreversible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

## 🙏 Acknowledgements

- Vercel for hosting and KV store
- Google Sheets for extended storage
- Vercel for hosting and KV store
- All contributors (Claude and myself) and participants who helped test it and give feedback of the Día de los Ancestros Cooking Competition
- My wife for tolerating me and helping me out while I made this
```
Ok truthfully I (Williamthe5thc) had that Readme was generated by Claude, it does appear to be good, but take it with a grain of salt. I also had to go back in deployment.
