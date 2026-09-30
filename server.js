import express from "express";
import dotenv from "dotenv";
import RunwayML from "@runwayml/sdk";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(express.static("public"));

// Initialize Runway ML client
const client = process.env.RUNWAYML_API_SECRET
  ? new RunwayML({ apiKey: process.env.RUNWAYML_API_SECRET })
  : null;

// Default character
const pam = {
  name: "Baby Pam",
  age: "2–4",
  hair: "soft dark curly hair with two pink hair ties",
  eyes: "big expressive brown eyes",
  outfit: "pink overalls, white T-shirt, white sneakers",
  style: "original colorful 3D preschool animation, rounded shapes, soft lighting"
};

// Character prompt generator
function bible(c) {
  return `Character: ${c.name}, ${c.age}. Appearance: ${c.hair}; ${c.eyes}; ${c.outfit}. Style: ${c.style}. Keep this character visually consistent across all shots. Original children's animation; do not imitate any existing show.`;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "BabyVerse V3",
    runway_ml_configured: !!client
  });
});

// Plan endpoint - creates a video outline without generating
app.post("/api/plan", (req, res) => {
  const { idea = "", character = pam } = req.body;

  if (!idea.trim()) {
    return res.status(400).json({ error: "Enter an idea." });
  }

  const shots = [
    {
      title: "Hello",
      duration: 3,
      prompt: `${bible(character)} Opening wide shot. ${idea} Introduce ${character.name} smiling and waving.`
    },
    {
      title: "Learning",
      duration: 4,
      prompt: `${bible(character)} Medium shot. ${character.name} demonstrates the main learning action from: ${idea}. Clear, gentle preschool movement.`
    },
    {
      title: "Happy ending",
      duration: 3,
      prompt: `${bible(character)} Close-up. ${character.name} celebrates the lesson from: ${idea}, smiling and doing a simple happy gesture.`
    }
  ];

  res.json({
    ok: true,
    character,
    shots,
    totalDuration: 10
  });
});

// Generate endpoint - creates actual video
app.post("/api/generate", async (req, res) => {
  try {
    if (!client) {
      return res.status(500).json({ error: "RUNWAYML_API_SECRET is not configured." });
    }

    const { idea, character = pam, ratio = "720:1280" } = req.body;

    if (!idea?.trim()) {
      return res.status(400).json({ error: "Enter an idea." });
    }

    const shots = [
      {
        prompt: `${bible(character)} Opening scene. ${idea}. Introduce ${character.name} in a bright safe preschool setting.`,
        duration: 3
      },
      {
        prompt: `${bible(character)} Main learning scene. ${idea}. Show one clear action with cheerful toddler-friendly movement.`,
        duration: 4
      },
      {
        prompt: `${bible(character)} Happy ending. ${character.name} celebrates after learning: ${idea}.`,
        duration: 3
      }
    ];

    const task = await client.recipes
      .multiShotVideo({
        version: "2026-06",
        mode: "custom",
        shots,
        duration: 10,
        ratio,
        audio: true
      })
      .waitForTaskOutput();

    res.json({
      ok: true,
      output: task.output || [],
      taskId: task.id || null
    });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Generation failed." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`\n🎬 BabyVerse V3 Started`);
  console.log(`📍 Server: http://localhost:${port}`);
  console.log(`🤖 Runway ML: ${client ? "✓ Configured" : "✗ Not configured"}`);
  console.log(`\n📚 API Endpoints:`);
  console.log(`   POST /api/plan - Create video outline`);
  console.log(`   POST /api/generate - Generate video`);
  console.log(`   GET  /api/health - Health check\n`);
});
