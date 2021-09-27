import inspect
import logging
import random

import requests
from nltk.corpus import wordnet as wn
from nltk.stem import PorterStemmer
from sense2vec import Sense2Vec

from constants import CONCEPT_NET_API_1, CONCEPT_NET_API_2, LOGGER_FORMAT, DISTRACTOR_LIB_WEIGHTS, \
    WORDNET_GRAND_WEIGHT, WORDNET_LIMIT, SENSE2VEC_MODEL
from utility import get_sentence_cosine_similarity
from models import Models

A = Models()
SENSE2VEC = A.sense_to_vec()

# nltk.download('wordnet')
# !pip install sense2vec==1.0.3
# nltk.download('punkt')


class DistractorGeneration:
    """Single Responsibility of Over generating an exhaustive list of distractors"""

    def __init__(self, keyword, keyword_sentence, distractor_count=3):
        """
        Constructor
        :param keyword: The keyword for which we are searching for distractor
        :param keyword_sentence: The sentence in which the keyword is used
        :param distractor_count: The count of distractors expected
        """
        self.log = logging.getLogger(self.__class__.__name__)
        file_handler = logging.FileHandler(f'logs/{self.__class__.__name__}.log')
        formatter = logging.Formatter(LOGGER_FORMAT)
        file_handler.setFormatter(formatter)
        self.log.addHandler(file_handler)
        self.keyword = keyword
        self.keyword_sentence = keyword_sentence
        self.distractor_count = distractor_count

    def get_all_distractors(self):
        """
        Merges all the distractor list generated from different libraries
        :return: A dictionary containg keyoword as key and distractor and their rank as dictionary values
        """
        wordnet_object = WordNetDistractor(self.keyword, self.keyword_sentence)
        first_funcs = [wordnet_object.get_wordnet_distractor,
                       self.get_distractors_conceptnet, self.sense2vec_get_words]
        distractor_final = {}
        for i in first_funcs:
            distractor_dic = self.prune_distractor_list(i())
            if self.keyword[0] in distractor_dic:
                distractor_final.update(distractor_dic[self.keyword[0]])
            if len(distractor_final) > self.distractor_count:
                return {self.keyword[0]: self.get_n_distractors(distractor_final, self.distractor_count)}
        return {self.keyword[0]: {}}

    def get_n_distractors(self, distractor, count):
        """
        Get the required number of distractors
        :param distractor: list of distractors
        :return: Get 'n' distractors from the complete list
        """
        keys = list(distractor.keys())
        random.shuffle(keys)
        new_dic = {your_key: distractor[your_key] for your_key in keys[:count]}
        return new_dic

    def get_distractors_conceptnet(self):
        """
        Returns a list of distractors generated using ConceptNet Library
        :return: List now containing distractors as value of keywords in dictionary
        """
        distractor_dic, distractor = {self.keyword[0]: {}}, {}
        try:
            word = self.keyword[0].lower().replace(" ", "_")
            url = CONCEPT_NET_API_1 % (word, self.keyword[1], word)
            obj = requests.get(url).json()
            for edge in obj['edges']:
                link = edge['end']['term']
                url2 = CONCEPT_NET_API_2 % (link, link)
                obj2 = requests.get(url2).json()
                for edge in obj2['edges']:
                    word2 = edge['start']['label']
                    if word2 not in distractor and self.keyword[0].lower() not in word2.lower():
                        distractor[word2] = DISTRACTOR_LIB_WEIGHTS[1]
                distractor_dic[self.keyword[0]] = distractor
        except Exception as e:
            self.log.error(
                f'{inspect.currentframe().f_code.co_name} Function failed. Error {e}')
        return distractor_dic

    def sense2vec_get_words(self):
        """
        Returns a list of distractors generated using Sense2vec Library
        :return: List now containing distractors as value of keywords in dictionary
        """
        distractor_list, output, most_similar = {self.keyword[0]: {}}, {}, []
        word = self.keyword[0].lower().replace(" ", "_")
        try:
            sense = SENSE2VEC.get_best_sense(word)
            distractor_limit = 12
            while distractor_limit > 2:
                try:
                    most_similar = SENSE2VEC.most_similar(sense, n=distractor_limit)
                    break
                except:
                    distractor_limit -= 2
            for each_word in most_similar:
                append_word = each_word[0].split(
                    "|")[0].replace("_", " ").lower()
                if append_word.lower() != word:
                    output[append_word] = each_word[1] * \
                        DISTRACTOR_LIB_WEIGHTS[2]
            distractor_list[self.keyword[0]] = output
        except Exception as e:
            self.log.error(
                f'{inspect.currentframe().f_code.co_name} Function failed. Error {e}')
        return self.sense2vec_distractor_pruning(distractor_list)

    def sense2vec_distractor_pruning(self, dis):
        """
        Pruning distractor list of the sense2vec library
        :param dis: A dictionary of distractor which are repeated and too similar to original word
        :return: List now containing distractors as value of keywords in dictionary
        """
        ps = PorterStemmer()
        for i in dis:
            splitted_word, test_dict, del_list = i.split(), dis[i], []
            for word in splitted_word:
                word = ps.stem(word)
                del_list += [distractor for distractor in test_dict if (
                    word in distractor) or (distractor in word)]
            for duplicate in del_list:
                if duplicate in test_dict:
                    test_dict.pop(duplicate)
            dis[i] = test_dict
        return dis

    def prune_distractor_list(self, distractor):
        """
        Removes distractors with similar words in it
        :param distractor: Input raw distractor list
        :return: Refined distractor list
        """
        for word in distractor:
            dictractor_dic = distractor[word]
            keys = list(dictractor_dic.keys())
            random.shuffle(keys)
            selected_keys = {word: 1}
            for key in keys:
                flag = True
                for selected_key in selected_keys:
                    if get_sentence_cosine_similarity(key, selected_key) > 0.4:
                        flag = False
                        break
                if flag:
                    selected_keys[key] = dictractor_dic[key]
            selected_keys.pop(word)
            distractor[word] = selected_keys
        return distractor


class WordNetDistractor:
    """ Class returns Distractors generated using the WordNet library"""

    def __init__(self, keyword, keyword_sentence):
        """
        Constructor
        :param keyword: The keyword for which we are searching for distractor
        :param keyword_sentence: The sentence in which the keyword is used
        """
        self.keyword = keyword
        self.keyword_sentence = keyword_sentence

    def get_wordnet_distractor(self):
        """
        Returns distractors using the wordnet library
        :return: A dictionary of keyword and distractors
        """
        distractor_dict, word = {}, self.keyword[0].lower().replace(" ", "_")
        synonyms = self.get_sysn_wordnet(word, self.keyword[1])
        synonyms = self.get_best_sysn(synonyms)
        if synonyms:
            distractor_dict[(self.keyword[0], synonyms)] = 1
        return self.wordnet_distractor_list(distractor_dict)

    def get_sysn_wordnet(self, word, pos):
        """
        Generate synonyms for a word
        :param word: The input word
        :param pos: The part of speech identified by the keyword library
        :return: Wordnet synonym variable
        """
        synonyms = wn.synsets(word, pos)
        if not synonyms:
            synonyms = wn.synsets(word, 'n')
            if not synonyms:
                synonyms = wn.synsets(word, 'v')
                if not synonyms:
                    synonyms = wn.synsets(word, 'a')
        return synonyms

    def get_best_sysn(self, syns):
        """
        Generates the best synonyms from a list of synonyms
        :param syns: List of synonyms
        :return: Single synonym
        """
        new_syn = []
        if len(syns) > 1:
            cosine = 0
            for syn in syns[::-1]:
                intial_cosine = get_sentence_cosine_similarity(syn.definition(), self.keyword_sentence)
                if cosine <= intial_cosine:
                    cosine, new_syn = intial_cosine, syn
        elif len(syns) == 1:
            new_syn = syns[0]
        return new_syn

    def wordnet_distractor_list(self, distractor_dict):
        """
        Generates the Wordnet Based distractor list
        :param distractor_dict: A dictionary of words for which we need to find distractors
        :return: List now containing distractors as value of keywords in dictionary
        """
        result = {}
        for element in distractor_dict:
            word, hypernym, distractor = element[0].lower(), element[1].hypernyms(), {}

            # Distractor generation using parents
            if len(hypernym) != 0:
                grand_hypernym = hypernym[0].hypernyms()
                distractor = self.get_hyponyms(word, hypernym, {})
                # Distractor generation using distant-cousin
                if len(distractor) < WORDNET_LIMIT and len(grand_hypernym) != 0:
                    for chypernym in grand_hypernym[0].hyponyms():
                        distractor.update(self.get_hyponyms(
                            word, [chypernym], distractor, grand=True))
            result[element[0]] = distractor
        return result

    def get_hyponyms(self, word, hypernym, distractor, grand=False):
        """
        Get hyponym for a given hypernym
        :param word: Input word
        :param hypernym: hypernyms for the Input word
        :param grand: If this is TRUE grand-parent penalty is added
        :return: Dictionary of distractors
        """
        for item in hypernym[0].hyponyms():
            name = item.lemmas()[0].name()
            if name == word:
                continue
            name = name.replace("_", " ")
            name = " ".join(w.capitalize() for w in name.split())
            if name is not None and name not in distractor:
                distractor[name] = DISTRACTOR_LIB_WEIGHTS[0]
                if grand:
                    distractor[name] *= WORDNET_GRAND_WEIGHT
        return distractor
