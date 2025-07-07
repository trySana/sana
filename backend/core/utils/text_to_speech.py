import torch
from TTS.api import TTS


class Jenny:

    def __init__(self, model_path: str):

        self.tts = TTS(model_path).to(Jenny.get_device())

    @staticmethod
    def get_device():
        if torch.cuda.is_available():
            return "cuda"
        elif torch.backends.mps.is_available():
            return "mps"  # macOS Apple Silicon
        else:
            return "cpu"

    def convert_to_voice(self, text: str, filename: str) -> str:
        """Convert text to voice.

        Args:
            text (str): Text to convert
            filename (str): Name of the file in which the audio is to
            be written

        Returns:
            str: Path of the audio file
        """
        return self.tts.tts_to_file(text=text, file_path=f"tmp/{filename}")
