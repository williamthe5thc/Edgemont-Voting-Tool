# Dia de Los Ancestros Cooking Competition Voting System

A web-based voting system for managing dish voting in a cooking competition, built with vanilla JavaScript and Vercel KV storage.

## 📚 Documentation Structure
- [JavaScript Architecture Documentation](js/README.md) - Detailed documentation of the JavaScript codebase
- [API Documentation](api/README.md) - API endpoints and configuration
- [Utils Documentation](js/utils/README.md) - Utility functions documentation

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
├── api/                      # API endpoints (see api/README.md)
│   ├── clear-votes.js       
│   ├── config.js            
│   ├── get-settings.js      
│   ├── results.js           
│   ├── update-settings.js   
│   └── vote.js              
├── js/                      # JavaScript files (see js/README.md)
│   ├── utils/               # Utility functions (see js/utils/README.md)
│   ├── admin.js             
│   ├── categoryLoader.js    
│   ├── constants.js         
│   ├── main.js              
│   ├── preloader.js         
│   ├── results-display.js   
│   └── voteSubmitter.js     
├── admin.html               # Admin interface
├── index.html               # Voting interface
├── results.html             # Results display
└── styles.css               # Global styles
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

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

## 🙏 Acknowledgements

- Vercel for hosting and KV store
- Google Sheets for extended storage
- All contributors and participants of the Día de los Ancestros Cooking Competition