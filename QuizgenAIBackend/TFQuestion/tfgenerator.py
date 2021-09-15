import tensorflow as tf
from transformers import TFGPT2LMHeadModel, GPT2Tokenizer
import nltk
nltk.download('punkt')
from nltk import tokenize
from sentence_transformers import SentenceTransformer, util
import scipy

class TrueFalseGenerator:

    def __init__(self):
        self.GPT2tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
        self.GPT2model = TFGPT2LMHeadModel.from_pretrained("gpt2", pad_token_id=self.GPT2tokenizer.eos_token_id)
        self.BERT_model = SentenceTransformer('distilbert-base-nli-stsb-mean-tokens')

    def generate_alternate_endings(self, partial_sentence):
        input_ids = self.GPT2tokenizer.encode(partial_sentence, return_tensors='tf')
        maximum_length = len(partial_sentence.split()) + 40
        sample_outputs = self.GPT2model.generate(
            input_ids,
            do_sample=True,
            max_length=maximum_length,
            top_p=0.80,  # 0.85
            top_k=30,  # 30
            repetition_penalty=10.0,
            num_return_sequences=10
        )

        generated_sentences = []
        for i, sample_output in enumerate(sample_outputs):
            decoded_sentence = self.GPT2tokenizer.decode(sample_output, skip_special_tokens=True)
            final_sentence = tokenize.sent_tokenize(decoded_sentence)[0]
            generated_sentences.append(final_sentence)
        return generated_sentences

    def choose_best_sentence(self, original_sentence, false_sentences):
        false_sentences_embeddings = self.BERT_model.encode(false_sentences)
        original_sentence_embedding = self.BERT_model.encode([original_sentence])
        distances = scipy.spatial.distance.cdist(original_sentence_embedding, false_sentences_embeddings, "cosine")[0]
        results = zip(range(len(distances)), distances)
        results = sorted(results, key=lambda x: x[1])
        dissimilar_sentences = []
        for idx, distance in results:
            dissimilar_sentences.append(false_sentences[idx])
        false_sentences_list_final = reversed(dissimilar_sentences)
        for sent in false_sentences_list_final:
            return sent


    def generate_tf_questions(self, original_sentence, partial_sentence):
        false_sentences = self.generate_alternate_endings(partial_sentence)
        false_sentence = self.choose_best_sentence(original_sentence, false_sentences)
        return false_sentence



