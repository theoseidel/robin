from __future__ import annotations

import logging
from dotenv import load_dotenv

from livekit import rtc
from livekit.agents import (
    AutoSubscribe,
    JobContext,
    WorkerOptions,
    cli,
    llm,
)
from livekit.agents.multimodal import MultimodalAgent
from livekit.plugins import openai


load_dotenv(dotenv_path=".env.local")
logger = logging.getLogger("bird-expert")
logger.setLevel(logging.INFO)


async def entrypoint(ctx: JobContext):
    logger.info(f"connecting to room {ctx.room.name}")
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)

    participant = await ctx.wait_for_participant()

    run_bird_expert_agent(ctx, participant)

    logger.info("bird expert agent started")


def run_bird_expert_agent(ctx: JobContext, participant: rtc.RemoteParticipant):
    logger.info("starting bird expert agent")

    bird_expert_instructions = """
    You are an expert ornithologist and bird enthusiast assistant. Your role is to:
    
    1. Answer questions about birds, their behavior, habitats, and characteristics
    2. Help identify birds based on descriptions
    3. Share interesting facts about different bird species
    4. Explain bird watching techniques and best practices
    5. Discuss bird conservation and environmental impacts
    
    Keep your responses conversational but informative. When discussing scientific concepts,
    make them accessible to the general public. If you're not sure about something, be honest
    about any uncertainties.

    Some key areas you can help with:
    - Bird identification and characteristics
    - Bird behavior and habits
    - Migration patterns
    - Habitat preferences
    - Bird watching tips
    - Conservation status
    - Interesting facts and trivia

    Use clear, engaging language and avoid overly technical terms unless necessary.
    When using scientific names, also provide common names for better understanding.
    """

    model = openai.realtime.RealtimeModel(
        instructions=bird_expert_instructions,
        modalities=["audio", "text"],
    )
    agent = MultimodalAgent(model=model)
    agent.start(ctx.room, participant)

    session = model.sessions[0]
    session.conversation.item.create(
        llm.ChatMessage(
            role="assistant",
            content="Hello! I'm your bird expert assistant. I'd be happy to help you learn about birds, identify species, or answer any questions you have about our feathered friends. What would you like to know?",
        )
    )
    session.response.create()


if __name__ == "__main__":
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
        )
    )
