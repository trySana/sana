import json

import openai
from core.config import settings

client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)


def parse_medical_text(text: str) -> dict:
    prompt = (
        "Here is a text from a medical consultation. "
        "Extract the important medical information as JSON with the following keys: "
        "symptoms, duration, intensity, other. "
        f'Text: "{text}" Respond only with the JSON.'
    )
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are a medical assistant who structures information.",
            },
            {"role": "user", "content": prompt},
        ],
    )
    result = response.choices[0].message.content
    if not isinstance(result, str):
        return {"result": result}
    try:
        return json.loads(result)
    except Exception:
        return {"result": result}
