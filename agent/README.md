<a href="https://livekit.io/">
  <img src="./.github/assets/livekit-mark.png" alt="LiveKit logo" width="100" height="100">
</a>

# Bird Expert Voice Assistant

An intelligent voice-based bird expert assistant powered by LiveKit's [Agents Framework](https://github.com/livekit/agents). This agent combines real-time voice interaction with extensive ornithological knowledge to help users learn about birds, identify species, and get bird watching tips.

## Features

- 🦜 **Bird Identification**: Get help identifying birds based on descriptions
- 📚 **Expert Knowledge**: Learn about bird behavior, habitats, and characteristics
- 🔍 **Bird Watching Tips**: Get advice on bird watching techniques and best practices
- 🌍 **Conservation Info**: Learn about bird conservation and environmental impacts
- 🎯 **Real-time Voice Interaction**: Natural conversation with voice-based responses

## Dev Setup

1. Clone the repository and set up a virtual environment:

```console
git clone [repo-url]
cd agent
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Configure environment variables by copying `.env.example` to `.env.local` and filling in:

- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_EBIRD_API_KEY`

You can use the LiveKit CLI for automatic setup:

```bash
lk app env
```

3. Run the agent:

```console
python3 agent.py dev
```

## Frontend Integration

This bird expert agent works with:

- The included Next.js frontend application in the `web/` directory
- Any frontend from [livekit-examples](https://github.com/livekit-examples/)
- Custom frontends built using LiveKit's [client SDKs](https://docs.livekit.io/realtime/quickstarts/)
- LiveKit's hosted [Sandbox](https://cloud.livekit.io/projects/p_/sandbox) frontends

## Features

The web application provides:
- Interactive bird gallery with images from Wikimedia
- Real-time bird sighting data
- Filtering and sorting capabilities
- Detailed information cards for each bird
- Integration with eBird for species codes

## Resources

- [LiveKit Agents Documentation](https://docs.livekit.io/agents/overview/)
- [LiveKit Cloud](https://livekit.io/cloud)
- [LiveKit Blog](https://blog.livekit.io/)

## License

This project is licensed under the [Apache License 2.0](LICENSE).
