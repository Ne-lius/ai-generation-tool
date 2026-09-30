# 🎬 BabyVerse V3 - AI Animation Generator

An AI-powered tool for generating educational animations for preschoolers, powered by **Runway ML**.

## Features

✨ **AI-Generated Videos** - Create engaging 10-second educational animations  
📚 **Curriculum-Aligned** - Perfect for teaching preschool concepts  
👶 **Character Consistency** - Baby Pam & customizable characters maintain visual consistency  
🎨 **Professional Quality** - 3D animation with soft, rounded, child-friendly aesthetics  
⚡ **Quick Generation** - 3-shot structure: Introduction → Learning → Celebration  
🔧 **Extensible** - Easy to add new characters and customize prompts  

## Tech Stack

- **Backend**: Node.js + Express.js
- **AI Generation**: Runway ML API
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Deployment**: Ready for Vercel, Heroku, or Docker

## Quick Start

### Prerequisites

- Node.js 16+
- Runway ML API key (get one at [runway.ai](https://runway.ai))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ne-lius/ai-generation-tool.git
   cd ai-generation-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env and add your Runway ML API key
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## API Endpoints

### 1. Health Check
```bash
GET /api/health
```
Verifies the server is running and Runway ML is configured.

### 2. Plan Video
```bash
POST /api/plan
Content-Type: application/json

{
  "idea": "Learning to share toys with friends",
  "character": {
    "name": "Baby Pam",
    "age": "2–4",
    "hair": "soft dark curly hair with two pink hair ties",
    "eyes": "big expressive brown eyes",
    "outfit": "pink overalls, white T-shirt, white sneakers",
    "style": "original colorful 3D preschool animation, rounded shapes, soft lighting"
  }
}
```

**Response:**
```json
{
  "ok": true,
  "character": { ... },
  "shots": [
    {
      "title": "Hello",
      "duration": 3,
      "prompt": "..."
    },
    ...
  ],
  "totalDuration": 10
}
```

### 3. Generate Video
```bash
POST /api/generate
Content-Type: application/json

{
  "idea": "Learning to share toys with friends",
  "character": { ... },  // Optional, defaults to Baby Pam
  "ratio": "720:1280"    // Optional, defaults to 720:1280
}
```

**Response:**
```json
{
  "ok": true,
  "output": ["video_url"],
  "taskId": "task-uuid-here"
}
```

## Project Structure

```
ai-generation-tool/
├── server.js              # Main Express server
├── package.json           # Dependencies
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── public/
    └── index.html        # Frontend UI
```

## Character Customization

You can create custom characters by modifying the character object in the request body:

```javascript
const character = {
  name: "Character Name",
  age: "Age range",
  hair: "Hair description",
  eyes: "Eyes description",
  outfit: "Outfit description",
  style: "Animation style description"
};
```

The `bible()` function automatically builds detailed prompts that ensure visual consistency across all shots.

## Configuration

### Environment Variables

```env
# Server port (default: 3000)
PORT=3000

# Runway ML API key (required)
RUNWAYML_API_SECRET=your_api_key_here
```

## Error Handling

The API returns appropriate HTTP status codes:

- **400** - Bad request (missing or invalid parameters)
- **500** - Server error (API unavailable or configuration missing)

All errors include a descriptive message:
```json
{
  "error": "Enter an idea."
}
```

## Development

### Start development server with auto-reload
```bash
npm run dev
```

### Run tests
```bash
npm test
```

### Lint code
```bash
npm run lint
```

## Deployment

### Vercel
```bash
npm i -g vercel
vercel
```
Make sure to set `RUNWAYML_API_SECRET` in Vercel environment variables.

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Video Specification

All generated videos follow this structure:

- **Total Duration**: 10 seconds
- **Aspect Ratio**: 720:1280 (mobile-optimized)
- **Audio**: Included
- **Frame Rate**: Optimized for web
- **Format**: MP4

### Three-Shot Structure

1. **Introduction (3s)** - Character introduction in bright, safe setting
2. **Learning (4s)** - Main educational action with toddler-friendly movement
3. **Celebration (3s)** - Happy conclusion reinforcing the lesson

## Limitations

- Maximum 4MB payload size
- 10-second fixed video duration
- Runway ML API quota applies
- Video generation is asynchronous (may take 30-120 seconds)

## Troubleshooting

### "RUNWAYML_API_SECRET is not configured"
- Ensure `.env` file exists and contains `RUNWAYML_API_SECRET`
- Verify the API key is valid at [runway.ai](https://runway.ai)

### "Generation failed"
- Check Runway ML API status
- Verify your API quota hasn't been exceeded
- Check the browser console for detailed error messages

### Videos not generating
- Increase timeout (Runway ML can take 1-2 minutes)
- Verify the API key has permissions for video generation
- Check network connectivity

## License

MIT - Feel free to use for educational and commercial purposes.

## Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/Ne-lius/ai-generation-tool/issues)
- Submit a [Pull Request](https://github.com/Ne-lius/ai-generation-tool/pulls)

## Author

**Ne-lius** - AI Generation Tool Creator

---

**Made with ❤️ for preschoolers everywhere**
