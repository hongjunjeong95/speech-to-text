import os
from google.cloud import speech
from micstream import MicrophoneStream

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "gc-speech-300312-2507d585b1ef.json"

# Audio recording parameters
RATE = 44100
CHUNK = int(RATE / 10)  # 100ms


def listen_print_loop(responses):

    for response in responses:
        print(response)
        result = response.results[0]
        transcript = result.alternatives[0].transcript

        print(transcript)

        if "exit" in transcript or "quit" in transcript:
            print("Exiting..")
            break


language_code = "en-US"

client = speech.SpeechClient()
config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=RATE,
    language_code=language_code,
)
streaming_config = speech.StreamingRecognitionConfig(config=config)

with MicrophoneStream(RATE, CHUNK) as stream:
    audio_generator = stream.generator()
    requests = (
        speech.StreamingRecognizeRequest(audio_content=content)
        for content in audio_generator
    )
    responses = client.streaming_recognize(streaming_config, requests)

    listen_print_loop(responses)
