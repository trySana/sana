from dataclasses import dataclass
import time
import sentencepiece
import torch

from moshi.models import MimiModel, LMModel, LMGen

@dataclass
class InferenceState:
    mimi: "MimiModel"
    text_tokenizer: sentencepiece.SentencePieceProcessor
    lm_gen: "LMGen"

    def __init__(
        self,
        mimi: "MimiModel",
        text_tokenizer: sentencepiece.SentencePieceProcessor,
        lm: "LMModel",
        batch_size: int,
        device: str | torch.device,
    ):
        self.mimi = mimi
        self.text_tokenizer = text_tokenizer
        self.lm_gen = LMGen(lm, temp=0, temp_text=0, use_sampling=False)
        self.device = device
        self.frame_size = int(self.mimi.sample_rate / self.mimi.frame_rate)
        self.batch_size = batch_size
        self.mimi.streaming_forever(batch_size)
        self.lm_gen.streaming_forever(batch_size)

    def run(self, in_pcms: torch.Tensor):
        device = self.lm_gen.lm_model.device
        ntokens = 0
        first_frame = True
        chunks = [
            c
            for c in in_pcms.split(self.frame_size, dim=2)
            if c.shape[-1] == self.frame_size
        ]
        start_time = time.time()
        all_text = []
        for chunk in chunks:
            codes = self.mimi.encode(chunk)
            if first_frame:
                tokens = self.lm_gen.step(codes)
                first_frame = False
            tokens = self.lm_gen.step(codes)
            if tokens is None:
                continue
            assert tokens.shape[1] == 1
            one_text = tokens[0, 0].cpu()
            if one_text.item() not in [0, 3]:
                text = self.text_tokenizer.id_to_piece(one_text.item())
                text = text.replace("▁", " ")
                all_text.append(text)
            ntokens += 1
        dt = time.time() - start_time
        print(
            f"processed {ntokens} steps in {dt:.0f}s, {1000 * dt / ntokens:.2f}ms/step"
        )
        return "".join(all_text)

# Fonction utilitaire pour la transcription
def transcribe_audio(inference_state: InferenceState, in_pcms: torch.Tensor) -> str:
    return inference_state.run(in_pcms)
