# Fashion Analyzer AI Chatbot

An intelligent fashion analysis chatbot that provides personalized styling recommendations based on uploaded images and body type queries.

## Features

- **Image Analysis**: Upload clothing images to get detailed styling recommendations
- **Multiple Image Upload**: Compare 2+ items and get compatibility analysis
- **Text-Only Advice**: Ask fashion questions without uploading images
- **Color Matching**: Get suggestions for complementary colors
- **Bottom/Top Pairing**: Discover what bottoms work best with tops and vice versa
- **Body Type Recommendations**: Ask about fashion advice for specific body types
- **Fashion-MNIST Integration**: 10 standardized clothing categories with styling guides
- **Ethnic Wear Expertise**: Indian fashion (Anarkali, Saree, Lehenga) and Western styles
- **Interactive Chat Interface**: Beautiful, premium UI with smooth animations
- **AI-Powered**: Uses Google's Gemini AI enhanced with fashion datasets

## Installation

1. Install Node.js (if not already installed)

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## How to Use

### Analyze Clothing Images
1. Click the upload button (📎 icon)
2. Select an image of clothing (top, bottom, dress, etc.)
3. Optionally add a message with specific questions
4. Click send to get AI-powered recommendations

### Ask About Body Types
Type questions like:
- "What clothes look good on hourglass body type?"
- "Fashion recommendations for pear shaped body"
- "What should apple body type wear?"

### General Fashion Questions
Ask anything about:
- Color combinations
- Styling tips
- Occasion-appropriate outfits
- Fashion trends

## Features Explained

### Image Analysis Provides:
- Clothing description (type, color, style, pattern)
- Matching bottom/top suggestions
- Color combination recommendations
- Occasion suitability
- Body type compatibility
- Accessory suggestions

### Body Type Recommendations:
- **Hourglass**: Fitted tops, wrap dresses, high-waisted bottoms
- **Pear**: A-line skirts, bootcut pants, boat neck tops
- **Apple**: Empire waist dresses, V-neck tops, straight-leg pants
- **Rectangle**: Peplum tops, ruffled details, belts
- **Inverted Triangle**: A-line skirts, wide-leg pants, detailed bottoms

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express
- **AI**: Google Gemini 1.5 Flash API
- **Datasets**: 
  - Fashion MNIST (clothing classification)
  - DeepFashion2 (fashion detection and segmentation)
  - Body Metrics & Fashion Colors (body type and color recommendations)
  - Sustainable Fashion (eco-friendly fashion data)
  - Women Fashion (Indian ethnic and western wear styles)
- **Knowledge Base**: Enhanced fashion database with 100+ clothing types, color pairings, and styling rules

## API Configuration

The Google Gemini API key is already configured in `app.js`. If you need to change it:
```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
```

## Project Structure

```
fashion-analyzer-ai/
├── index.html              # Main HTML file
├── styles.css              # Premium styling with animations
├── app.js                  # Frontend logic & AI integration
├── fashionData.js          # Enhanced fashion knowledge base
├── server.js               # Express backend server
├── package.json            # Dependencies
├── FEATURES.md             # Feature documentation
├── DATASET_INFO.md         # Dataset information
├── README.md               # Main documentation
├── body metrics/           # Body type and color data
├── Fashion 1/              # Fashion MNIST dataset
├── DeepFashion2-master/    # Fashion detection dataset
├── sustainable fashion/    # Eco-fashion data
└── women fashion/          # Indian & Western wear images
```

## Browser Compatibility

Works best on modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Tips for Best Results

1. Upload clear, well-lit images of clothing
2. Ask specific questions for more detailed recommendations
3. Mention body type for personalized advice
4. Try different angles and clothing items

## Troubleshooting

**Server won't start:**
- Make sure Node.js is installed
- Run `npm install` to install dependencies

**Image upload not working:**
- Check file size (should be under 10MB)
- Ensure image format is supported (JPG, PNG, WEBP)

**API errors:**
- Check internet connection
- Verify API key is valid

## Future Enhancements

- Save favorite recommendations
- Multiple image comparison
- Virtual wardrobe feature
- Shopping links integration
- Style quiz for body type detection

Enjoy your personalized fashion recommendations! 👗✨
