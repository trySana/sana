import whisper

# Load the model
print("Loading model...")
model = whisper.load_model("turbo")
print("Model loaded.")

# Replace with the real path of your audio file
audio_path = "../audio/patient.mp3"
result = model.transcribe(audio_path)

print("Transcription :", result["text"])
