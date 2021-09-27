from allennlp.predictors.predictor import Predictor
from transformers import TFGPT2LMHeadModel, GPT2Tokenizer
from sentence_transformers import SentenceTransformer
from constants import LOGGER_FORMAT, ALLEN_NLP_MODEL, GPT2, BERT_FOR_TF_QUESTIONS, SENSE2VEC_MODEL
from long_question_generation import model_prod
from sense2vec import Sense2Vec
import logging
import inspect
# !pip install sense2vec==1.0.3

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
            model = T5ForConditionalGeneration.from_pretrained(trained_model_path)
            tokenizer = T5Tokenizer.from_pretrained(trained_tokenizer)

            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            #print("device ", device)
            model = model.to(device)
            return model, tokenizer
        except Exception as e:
            self.log.debug(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return None, None

    def sense_to_vec(self):
        """
        Loads the Sense2Vec model from the model library
        :return: Sense2Vec model
        """
        try:
            return Sense2Vec().from_disk(SENSE2VEC_MODEL)
        except Exception as e:
            self.log.debug(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return None

    def generate_all_models(self):
        """
        Generates all global machine learning models required for the project
        :return: ML models required for the project
        """
        AllenNLPpredictor, GPT2tokenizer, GPT2model, BERT_model_tfquestions = self.true_false_questions()
        t5_model, t5_tokenizer = self.long_question_generate()
        return AllenNLPpredictor, GPT2tokenizer, GPT2model, BERT_model_tfquestions, t5_model, t5_tokenizer
