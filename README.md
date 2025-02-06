# ROBIN - Bird Sighting Explorer

ROBIN is a full-stack application for exploring and learning about bird sightings. It features an interactive gallery, real-time bird information, and an AI-powered bird expert assistant.

## Features

- 🦜 Interactive bird sighting gallery
- 🗺️ Location mapping for each sighting
- 🤖 AI-powered bird expert chat assistant
- 🔍 Search and filter capabilities
- 📱 Responsive design
- 🎨 Beautiful loading animations

## Tech Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Backend**: Python, LiveKit
- **AI**: OpenAI API
- **Database**: Supabase
- **Maps**: Mapbox

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- pnpm
- Environment variables set up in:
  - `web/.env.local`
  - `agent/.env.local`

### Environment Setup

1. Create `web/.env.local`:
```env
LIVEKIT_API_KEY=your_livekit_key
LIVEKIT_API_SECRET=your_livekit_secret
LIVEKIT_URL=your_livekit_url

NEXT_PUBLIC_BIRD_API_BASE_URL=your_bird_api_url
NEXT_PUBLIC_BIRD_API_KEY=your_bird_api_key

NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

NEXT_PUBLIC_EBIRD_API_KEY=your_ebird_key
```

2. Create `agent/.env.local`:
```env
OPENAI_API_KEY=your_openai_key
LIVEKIT_API_KEY=your_livekit_key
LIVEKIT_API_SECRET=your_livekit_secret
LIVEKIT_URL=your_livekit_url
```

### Running the Application

1. Start the web application:
```bash
cd web
pnpm install
pnpm dev
```

2. In a new terminal, start the agent:
```bash
cd agent
pip install -r requirements.txt
python agent.py dev
```

The application will be available at:
- Web interface: http://localhost:3000

## Project Structure

```
robin/
├── web/                # Next.js frontend
│   ├── app/           # App router components
│   ├── components/    # Shared components
│   └── hooks/         # Custom React hooks
└── agent/             # Python AI assistant
    └── agent.py       # Main agent logic
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details 