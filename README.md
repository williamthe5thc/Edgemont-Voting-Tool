# Edgemont 1st Ward Dia de Los Ancestros Cooking Competition Voting Tool

## Overview

This project is a web-based voting system designed for the Edgemont 1st Ward Día de los Ancestros Cooking Competition. It allows participants to vote for their favorite dishes across multiple categories and provides an admin interface for managing the competition settings and viewing results.

## Features

- User-friendly voting interface
- Multiple categories for voting (e.g., Bread, Appetizers, Dessert, Entrée)
- Real-time input validation
- Local storage for saving incomplete votes
- Admin panel for managing competition settings
- Results page for viewing competition outcomes
- Integration with Vercel KV for data storage
- Integration with Google Sheets for vote recording

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js with Vercel Serverless Functions
- Database: Vercel KV (Key-Value store)
- Additional Storage: Google Sheets (via Google Apps Script)

## Project Structure

```
/
├── api/
│   ├── clear-votes.js
│   ├── get-settings.js
│   ├── results.js
│   ├── update-settings.js
│   ├── utils.js
│   └── vote.js
├── js/
│   ├── utils/
│   │   ├── apiUtils.js
│   │   ├── storageUtils.js
│   │   ├── uiUtils.js
│   │   └── validationUtils.js
│   ├── admin.js
│   ├── categoryLoader.js
│   ├── constants.js
│   ├── main.js
│   ├── results-display.js
│   └── voteSubmitter.js
├── admin.html
├── index.html
├── results.html
├── styles.css
└── package.json
```

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/dia-de-los-ancestros-voting.git
   cd dia-de-los-ancestros-voting
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Vercel KV:
   - Create a Vercel account if you don't have one
   - Set up a new KV store in your Vercel dashboard
   - Add your KV connection string to your Vercel project's environment variables

4. Set up Google Apps Script:
   - Create a new Google Apps Script project
   - Copy the contents of the `google-apps-script.js` file into your script
   - Deploy the script as a web app
   - Update the `submitToGoogleSheets` function in `voteSubmitter.js` with your script's URL

5. Deploy to Vercel:
   ```
   vercel
   ```

## Usage

### For Voters

1. Navigate to the main page of the deployed application.
2. Enter your votes for each category (up to two dishes per category).
3. Submit your votes.

### For Admins

1. Navigate to the `/admin.html` page of the deployed application.
2. Update the number of dishes per category as needed.
3. Use the "Clear Votes" function to reset all votes (use with caution).

### Viewing Results

1. Navigate to the `/results.html` page to view the current standings.

## Development

To run the project locally:

1. Start the development server:
   ```
   npm run dev
   ```

2. Open `http://localhost:3000` in your browser.

## Key Components

- `api/`: Contains serverless functions for backend operations
- `js/`: Client-side JavaScript files
- `admin.html`: Admin panel interface
- `index.html`: Main voting interface
- `results.html`: Results display page
- `styles.css`: Global styles for the application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Vercel for hosting and KV store
- Google Sheets for additional data storage
- All contributors (Claude and myself) and participants who helped test it and give feedback of the Día de los Ancestros Cooking Competition
- My wife for tolerating me and helping me out while I made this
```
Ok truthfully I (Williamthe5thc) had that Readme was generated by Claude, it does appear to be good, but take it with a grain of salt. I also had to go back in deployment.
