import inspect
import logging

from keybert import KeyBERT
from pke.unsupervised import MultipartiteRank, PositionRank, SingleRank, TextRank, YAKE

from constants import ENGLISH, LOGGER_FORMAT, KEYBERT_TOKENS, CONVERT_POS, POS, GRAMMAR
from utility import get_stopword_list, get_pos_for_keywords


# import spacy
# spacy.load("en_core_web_sm")
# nltk.download('wordnet')
# nltk.download('punkt')

# pip3 install git+https://github.com/boudinfl/pke.git
# pip3 install flashtext
# pip3 install - -upgrade spacy == 2.2.4
# pip3 install keyBERT


class KeywordAndPOS:

    def __init__(self, text, user_limit=1):
        """
        Constructor
        :param text: Input text to generate keywords
        :param user_limit: Number of keywords to be generated from the text
        """
        self.text = text
        self.keyword_limit = user_limit
        self.log = logging.getLogger(self.__class__.__name__)
        file_handler = logging.FileHandler(f'logs/{self.__class__.__name__}.log')
        formatter = logging.Formatter(LOGGER_FORMAT)
        file_handler.setFormatter(formatter)
        self.log.addHandler(file_handler)

    def log_error(self, function_name, exception_message):
        """
        Logs a error response in case of an keyword extraction exception
        :param function_name: Name of the function
        :param exception_message: Exception message
        :return: empty dictionary
        """
        self.log.error(f'{function_name} Function failed. Error {exception_message}')
        return {}

    def get_keywords_multipartite_rank(self):
        """
        Extracts keywords from input text using Graph based MultipartiteRank algorithm
        :return: Dictionary with the syntax {('keyword','partofspeech'):weightage}
        """
        # Library results indicate best usable only for Noun
        out = {}
        try:
            # Selecting the extractor and loading the input text in it
            extractor = MultipartiteRank()
            extractor.load_document(input=self.text)
            for partsofspeech in POS:
                extractor.candidate_selection(pos=partsofspeech, stoplist=get_stopword_list())
                extractor.candidate_weighting(alpha=1.1, threshold=0.75, method='average')
                keyphrases = extractor.get_n_best(n=self.keyword_limit)
                for val in keyphrases:
                    out[(val[0], CONVERT_POS[partsofspeech])] = val[1]
            return out
        except Exception as e:
            return self.log_error(inspect.currentframe().f_code.co_name, e)

    def get_keywords_position_rank(self):
        """
        Extracts keywords from input text using Graph based PositionRank algorithm
        :return: Dictionary with the syntax {('keyword','partofspeech'):weightage}
        """
        # While results are good Noun seems to be the best suited
        out = {}
        try:
            extractor = PositionRank()
            extractor.load_document(input=self.text, language='en', normalization=None)
            extractor.candidate_selection(grammar=GRAMMAR, maximum_word_number=3)
            for partsofspeech in POS:
                extractor.candidate_weighting(window=10, pos=partsofspeech)
                keyphrases = extractor.get_n_best(n=self.keyword_limit)
                for val in keyphrases:
                    out[(val[0], CONVERT_POS[partsofspeech])] = val[1]
            return out
        except Exception as e:
            return self.log_error(inspect.currentframe().f_code.co_name, e)

    def get_keywords_single_rank(self):
        """
        Extracts keywords from input text using Graph based SingleRank algorithm
        :return: Dictionary with the syntax {('keyword','partofspeech'):weightage}
        """
        out = {}
        try:
            # Selecting the extractor and loading the input text in it
            extractor = SingleRank()
            extractor.load_document(input=self.text)
            for partsofspeech in POS:
                extractor.candidate_selection(pos=partsofspeech)
                extractor.candidate_weighting(window=10, pos=partsofspeech)
                try:
                    keyphrases = extractor.get_n_best(n=self.keyword_limit)
                except ZeroDivisionError:
                    continue
                for val in keyphrases:
                    out[(val[0], CONVERT_POS[partsofspeech])] = val[1]
            return out
        except Exception as e:
            return self.log_error(inspect.currentframe().f_code.co_name, e)

    def get_keywords_text_rank(self):
        """
        Extracts keywords from input text using Graph based TextRank algorithm
        :return: Dictionary with the syntax {('keyword','partofspeech'):weightage}
        """
        out = {}
        try:
            # Selecting the extractor and loading the input text in it
            extractor = TextRank()
            extractor.load_document(input=self.text)
            for partsofspeech in POS:
                extractor.candidate_weighting(window=3, pos=partsofspeech, top_percent=1)
                try:
                    keyphrases = extractor.get_n_best(n=self.keyword_limit)
                except ZeroDivisionError:
                    continue
                for val in keyphrases:
                    out[(val[0], CONVERT_POS[partsofspeech])] = val[1]
            return out
        except Exception as e:
            return self.log_error(inspect.currentframe().f_code.co_name, e)

    def get_keywords_yake(self):
        """
        Extracts keywords from input text using Graph based TextRank algorithm
        :return: Dictionary with the syntax {('keyword','partofspeech'):weightage}
        """
        out = {}
        try:
            # Selecting the extractor and loading the input text in it
            extractor = YAKE()
            extractor.load_document(input=self.text, language='en', normalization=None)
            stoplist = get_stopword_list()
            extractor.candidate_selection(n=3, stoplist=stoplist)
            extractor.candidate_weighting(window=3, stoplist=stoplist, use_stems=False)
            keyphrases = extractor.get_n_best(n=self.keyword_limit, threshold=0.8)
            for val in keyphrases:
                out[(val[0]), get_pos_for_keywords([val[0]])] = val[1]
            return out
        except Exception as e:
            return self.log_error(inspect.currentframe().f_code.co_name, e)

    def get_keywords_key_bert(self):
        """
        Extracts keywords from input text using Word Embedding based on BERT algorithm
        :return: Dictionary with the syntax {('keyword','partofspeech'):weightage}
        """
        out = {}
        try:
            kw_extractor = KeyBERT(KEYBERT_TOKENS)
            keywords = kw_extractor.extract_keywords(self.text, stop_words=ENGLISH, top_n=self.keyword_limit,
                                                     keyphrase_ngram_range=(1, 2))
            for val in keywords:
                out[(val[0]), get_pos_for_keywords([val[0]])] = val[1]
            return out
        except Exception as e:
            return self.log_error(inspect.currentframe().f_code.co_name, e)
