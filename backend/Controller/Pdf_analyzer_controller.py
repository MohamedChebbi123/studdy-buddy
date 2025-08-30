from fastapi import File, UploadFile
from Utils.text_extractor import textextractor
from openai import OpenAI
from dotenv import load_dotenv
import os

def pdfanalyzer(file: UploadFile = File(...)):
    load_dotenv()
    key = os.getenv("OPENROUTER_API_KEY")
    chunked_text = textextractor(file)
    print(chunked_text)

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=key,
    )

    completion = client.chat.completions.create(
        extra_body={},
        model="cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
        messages=[
            {
                "role": "system",
                "content": "you are an ai assistant that will summarize the text of this pdf"
            },
            {
                "role": "user",
                "content": f"summarize this {chunked_text}"
            }
        ]
    )
    summary=completion.choices[0].message.content
    
    print(summary)

    return {"message": summary}
