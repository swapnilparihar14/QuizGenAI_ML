import logging

import requests
from summa import summarizer
from sumy.nlp.tokenizers import Tokenizer
from sumy.parsers.plaintext import PlaintextParser
from sumy.summarizers.kl import KLSummarizer
from sumy.summarizers.lex_rank import LexRankSummarizer
from sumy.summarizers.lsa import LsaSummarizer
from sumy.summarizers.reduction import ReductionSummarizer
from sumy.summarizers.text_rank import TextRankSummarizer

from constants import DEEP_AI_SUMMARIZER, ENGLISH, LOGGER_FORMAT, DEEP_AI_ERROR
from connect import DEEP_AI_API_KEY
from utility import tokenize_sentences


class ExtractiveTextSum:
    """ Single responsibility of generating Extractive Text summary of input text. (Sentence pruning or ranking)"""

    def __init__(self, text, question_count, safety_factor=2):
        """
        Class Constructor
        :param text: Input text for generating summary
        """
        self.text = text
        self.sentence_count = question_count * safety_factor
        self.log = logging.getLogger(self.__class__.__name__)
        file_handler = logging.FileHandler(f'logs/{self.__class__.__name__}.log')
        formatter = logging.Formatter(LOGGER_FORMAT)
        file_handler.setFormatter(formatter)
        self.log.addHandler(file_handler)

    def get_text_summary(self, algorithm_selector=2):
        """
        Generates the required text summary using different text summarization libraries
        :param algorithm_selector: Sumy Library algorithm selector (Default is LexRank)
        :return: Summary of the input text
        """
        sentences_in_text = len(tokenize_sentences(self.text))
        if sentences_in_text < self.sentence_count:
            self.log.warning(f"Question Count: {self.sentence_count} Sentence Count: {sentences_in_text}")
            return self.text
        while sentences_in_text > 5 * self.sentence_count:
            temp = self.get_deepai_text_summary()
            if not temp:
                break
            self.text = self.get_deepai_text_summary()
            sentences_in_text = len(tokenize_sentences(self.text))
        return self.get_sumy_text_summary(self.sentence_count, algorithm_selector)

    def get_summa_text_summary(self):
        """
        Generates text summary using basic TextRank algorithm by summa library
        :return: text summary
        """
        return summarizer.summarize(self.text).replace("\n", "")

    def get_sumy_text_summary(self, sentence_limit, algorithm_selector):
        """
        Generates text summary using algorithms by Sumy library
        :param algorithm_selector: Can select from an array of functions Value between 0-4
        :param sentence_limit: The number of sentences the algorithm should shortlist
        :return: text summary
        """
        algorithm_list = [TextRankSummarizer, LexRankSummarizer, LsaSummarizer, KLSummarizer, ReductionSummarizer]
        parser = PlaintextParser.from_string(self.text, Tokenizer(ENGLISH))
        summarizer = algorithm_list[algorithm_selector]()
        summary = summarizer(parser.document, sentence_limit)
        return ''.join([str(elem) for elem in summary])

    def get_deepai_text_summary(self):
        """
        Generates text summary using DeepAI algorithm (approx 20% reduction text)
        :return: text summary
        """
        try:
            r = requests.post(DEEP_AI_SUMMARIZER, data={'text': self.text}, headers={'api-key': DEEP_AI_API_KEY})
            return r.json()['output'].replace("\n", "")
        except Exception as e:
            self.log.error(f"{DEEP_AI_ERROR}.Error {e}")
            return ""
