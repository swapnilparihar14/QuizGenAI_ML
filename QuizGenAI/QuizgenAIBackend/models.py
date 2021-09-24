from allennlp.predictors.predictor import Predictor
from transformers import TFGPT2LMHeadModel, GPT2Tokenizer
from sentence_transformers import SentenceTransformer
from constants import LOGGER_FORMAT, ALLEN_NLP_MODEL, GPT2, BERT_FOR_TF_QUESTIONS
from model_generation import model_prod
import logging
import inspect


class Models:

    def __init__(self):
        self.log = logging.getLogger(self.__class__.__name__)
        file_handler = logging.FileHandler(f'logs/{self.__class__.__name__}.log')
        formatter = logging.Formatter(LOGGER_FORMAT)
        file_handler.setFormatter(formatter)
        self.log.addHandler(file_handler)

    def true_false_questions(self):
        try:
            predictor = Predictor.from_path(ALLEN_NLP_MODEL)
            GPT2tokenizer = GPT2Tokenizer.from_pretrained(GPT2)
            GPT2model = TFGPT2LMHeadModel.from_pretrained(GPT2, pad_token_id=GPT2tokenizer.eos_token_id)
            BERT_model = SentenceTransformer(BERT_FOR_TF_QUESTIONS)
            return predictor, GPT2tokenizer, GPT2model, BERT_model
        except Exception as e:
            self.log.debug(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return None, None, None, None

    def long_question_generate(self):
        try:
            long_question = model_prod.import_model()
            return long_question
        except Exception as e:
            self.log.debug(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return None

    def generate_all_models(self):
        AllenNLPpredictor, GPT2tokenizer, GPT2model, BERT_model_tfquestions = self.true_false_questions()
        long_question = self.long_question_generate()
        return AllenNLPpredictor, GPT2tokenizer, GPT2model, BERT_model_tfquestions, long_question
