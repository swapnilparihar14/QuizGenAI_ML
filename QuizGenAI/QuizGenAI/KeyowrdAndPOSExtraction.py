import pip
import itertools
import nltk
import re
import string
import requests
import json
import pke
from nltk.corpus import stopwords
from nltk.corpus import wordnet
import traceback
from nltk.tokenize import sent_tokenize
from flashtext import KeywordProcessor
from keybert import KeyBERT
# pip3 install git+https://github.com/boudinfl/pke.git
# pip3 install flashtext
# pip3 install - -upgrade spacy == 2.2.4
# pip3 install keyBERT


nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')


class MethodSelector:
    @classmethod
    def get_keyword_limit(cls, no_of_words, user_limit=0):
        """Estimates the number of keywords required
           @input: (no_of_words)-Block of continous text on a single topic  
           @Hyperparameters: ()-None
           @Output: (sentences)-Sentence Array"""
        if user_limit == 0:
            return round(no_of_words/15)

    @classmethod
    def tokenize_sentences(cls, text):
        """Converts long passages into sentence array     
           @input: (text)-Block of continous text on a single topic  
           @Hyperparameters: ()-None
           @Output: (sentences)-Sentence Array"""
        sentences = sent_tokenize(text)
        sentences = [sentence.strip()
                     for sentence in sentences if len(sentence) > 20]
        return sentences

    @classmethod
    def get_sentences_for_keyword(cls, keywords, sentences):
        """Maps Keywords with their sentences
           @input: (keywords1)-Dictionary of keywords 
           @input: (sentences)-Sentence Array
           @Hyperparameters: ()-None
           @Output: (out)-Dictionary with the syntax {('keyword','partofspeech'):weightage}"""
        keyword_processor = KeywordProcessor()
        keyword_sentences = {}
        for word in keywords:
            keyword_sentences[word[0]] = []
            keyword_processor.add_keyword(word[0])
        for sentence in sentences:
            keywords_found = keyword_processor.extract_keywords(sentence)
            for key in keywords_found:
                keyword_sentences[key].append(sentence)

        for key in keyword_sentences.keys():
            values = keyword_sentences[key]
            values = sorted(values, key=len, reverse=True)
            keyword_sentences[key] = values
        return keyword_sentences

    @classmethod
    def get_pos_for_keywords(cls, keywords1):
        """Generates POS for Non-POS based keywords
           @input: (keywords1)-Dictionary of keywords 
           @Hyperparameters: ()-None
           @Output: (out)-Dictionary with the syntax {('keyword','partofspeech'):weightage}"""
        tagged_keywords = nltk.pos_tag(keywords1)
        new_keyword = {}
        for i in tagged_keywords:
            if i[1][0] == 'N':
                new_keyword[i[0], 'n'] = keywords1[i[0]]
            elif i[1][0] == 'V':
                new_keyword[i[0], 'v'] = keywords1[i[0]]
            elif i[1][0] == 'J':
                new_keyword[i[0], 'a'] = keywords1[i[0]]

        return new_keyword


class KeywordNPOS:
    """ Sample Access Example
        from KeyowrdAndPOSExtraction import KeywordNPOS 
        dictionary = KeywordNPOS.functionname(arguments)"""
    @classmethod
    def get_keywords_MultipartiteRank(cls, text, user_limit=0):
        """Extracts keywords from input text using Graph based MultipartiteRank algorithm
           @input: (text)-Block of continous text on a single topic 
           @Hyperparameters: ()-None
           @Output: (out)-Dictionary with the syntax {('keyword','partofspeech'):weightage}"""
        out = {}
        try:
            # Selecting the extractor and loading the input text in it
            extractor = pke.unsupervised.MultipartiteRank()
            extractor.load_document(input=text)

            # It can extract these three types of "phrases" from the input text
            pos = {'VERB', 'ADJ', 'NOUN'}
            convert_pos = {'VERB': 'v', 'NOUN': 'n', 'ADJ': 'a'}

            stoplist = list(string.punctuation)
            stoplist += ['-lrb-', '-rrb-', '-lcb-', '-rcb-', '-lsb-', '-rsb-']
            stoplist += stopwords.words('english')

            keyword_limit = MethodSelector.get_keyword_limit(
                len(text.split()), user_limit)

            for partsofspeech in pos:
                extractor.candidate_selection(
                    pos=partsofspeech, stoplist=stoplist)
                extractor.candidate_weighting(
                    alpha=1.1, threshold=0.75, method='average')
                keyphrases = extractor.get_n_best(n=keyword_limit)

                for val in keyphrases:
                    out[(val[0], convert_pos[partsofspeech])] = val[1]

        except:
            out = {}
            traceback.print_exc()

        return out

    @classmethod
    def get_keywords_PositionRank(cls, text, user_limit=0):
        """Extracts keywords from input text using Graph based PositionRank algorithm
            @input: (text)-Block of continous text on a single topic 
            @Hyperparameters: ()-None
            @Output: (out)-Dictionary with the syntax {('keyword','partofspeech'):weightage}"""

        out = {}
        pos = {'NOUN', 'VERB', 'ADJ'}
        convert_pos = {'VERB': 'v', 'NOUN': 'n', 'ADJ': 'a'}
        try:
            # define the grammar for selecting the keyphrase candidates
            grammar = "NP: {<ADJ>*<NOUN|PROPN>+}"

            # 1. create a PositionRank extractor.
            extractor = pke.unsupervised.PositionRank()
            #print("Keyword extraction Using the PositionRank model")

            # 2. load the content of the document.
            extractor.load_document(
                input=text, language='en', normalization=None)

            # 3. select the noun phrases up to 3 words as keyphrase candidates.
            extractor.candidate_selection(
                grammar=grammar, maximum_word_number=3)

            keyword_limit = MethodSelector.get_keyword_limit(
                len(text.split()), user_limit)

            # 4. weight the candidates using the sum of their word's scores that are
            #    computed using random walk biaised with the position of the words
            #    in the document. In the graph, nodes are words (nouns and
            #    adjectives only) that are connected if they occur in a window of
            #    10 words.
            for partsofspeech in pos:
                extractor.candidate_weighting(window=10, pos=partsofspeech)
                # 5. get the 10-highest scored candidates as keyphrases
                keyphrases = extractor.get_n_best(n=keyword_limit)
                for val in keyphrases:
                    out[(val[0], convert_pos[partsofspeech])] = val[1]
        except:
            out = {}
            traceback.print_exc()

        return out

    @classmethod
    def get_keywords_SingleRank(cls, text, user_limit=0):
        """Extracts keywords from input text using Graph based SingleRank algorithm
           @input: (text)-Block of continous text on a single topic 
           @Hyperparameters: ()-None
           @Output: (out)-Dictionary with the syntax {('keyword','partofspeech'):weightage}"""
        out = {}
        try:
            # Selecting the extractor and loading the input text in it
            extractor = pke.unsupervised.SingleRank()
            extractor.load_document(input=text)

            # It can extract these three types of "phrases" from the input text
            pos = {'NOUN', 'VERB', 'ADJ'}
            convert_pos = {'VERB': 'v', 'NOUN': 'n', 'ADJ': 'a'}

            keyword_limit = MethodSelector.get_keyword_limit(
                len(text.split()), user_limit)

            for partsofspeech in pos:
                extractor.candidate_selection(pos=partsofspeech)
                extractor.candidate_weighting(window=10, pos=partsofspeech)
                try:
                    keyphrases = extractor.get_n_best(n=keyword_limit)
                except ZeroDivisionError:
                    continue

                for val in keyphrases:
                    out[(val[0], convert_pos[partsofspeech])] = val[1]

        except:
            out = {}
            traceback.print_exc()

        return out

    @classmethod
    def get_keywords_TextRank(cls, text, user_limit=0):
        """Extracts keywords from input text using Graph based TextRank algorithm
           @input: (text)-Block of continous text on a single topic 
           @Hyperparameters: ()-None
           @Output: (out)-Dictionary with the syntax {('keyword','partofspeech'):weightage}"""
        out = {}
        try:
            # Selecting the extractor and loading the input text in it
            extractor = pke.unsupervised.TextRank()
            extractor.load_document(input=text)

            # It can extract these three types of "phrases" from the input text
            pos = {'NOUN', 'VERB', 'ADJ'}
            convert_pos = {'VERB': 'v', 'NOUN': 'n', 'ADJ': 'a'}

            keyword_limit = MethodSelector.get_keyword_limit(
                len(text.split()), user_limit)

            for partsofspeech in pos:
                # extractor.candidate_selection(pos=partsofspeech)
                extractor.candidate_weighting(
                    window=3, pos=partsofspeech, top_percent=1)
                try:
                    keyphrases = extractor.get_n_best(n=keyword_limit)
                except ZeroDivisionError:
                    continue

                for val in keyphrases:
                    out[(val[0], convert_pos[partsofspeech])] = val[1]

        except:
            out = {}
            traceback.print_exc()

        return out

    @classmethod
    def get_keywords_YAKE(cls, text, user_limit=0):
        """Extracts keywords from input text using Graph based TextRank algorithm
            @input: (text)-Block of continous text on a single topic 
            @Hyperparameters: ()-None
            @Output: (out)-Dictionary with the syntax {('keyword','partofspeech'):weightage}"""
        out = {}
        try:
            # Selecting the extractor and loading the input text in it
            extractor = pke.unsupervised.YAKE()
            extractor.load_document(
                input=text, language='en', normalization=None)

            # It can extract these three types of "phrases" from the input text
            #pos = {'NOUN','VERB','ADJ'}
            #convert_pos = {'VERB': 'v', 'NOUN': 'n','ADJ': 'a'}

            stoplist = list(string.punctuation)
            stoplist += ['-lrb-', '-rrb-', '-lcb-', '-rcb-', '-lsb-', '-rsb-']
            stoplist = stopwords.words('english')

            keyword_limit = MethodSelector.get_keyword_limit(
                len(text.split()), user_limit)

            extractor.candidate_selection(n=3, stoplist=stoplist)
            extractor.candidate_weighting(
                window=3, stoplist=stoplist, use_stems=False)
            keyphrases = extractor.get_n_best(n=keyword_limit*2, threshold=0.8)

            for val in keyphrases:
                out[(val[0])] = val[1]

        except:
            out = {}
            traceback.print_exc()

        return get_pos_for_keywords(out)

    @classmethod
    def get_keywords_KeyBERT(cls, text, user_limit=0):
        """Extracts keywords from input text using Word Embedding based TextRank algorithm
            @input: (text)-Block of continous text on a single topic 
            @Hyperparameters: ()-None
            @Output: (out)-Dictionary with the syntax {('keyword','partofspeech'):weightage}"""
        out = {}
        try:
            kw_extractor = KeyBERT('distilbert-base-nli-mean-tokens')

            keyword_limit = MethodSelector.get_keyword_limit(
                len(text.split()), user_limit)

            keywords = kw_extractor.extract_keywords(
                text, stop_words='english', top_n=keyword_limit*2, keyphrase_ngram_range=(1, 2))

            for val in keywords:
                out[(val[0])] = val[1]

        except:
            out = {}
            traceback.print_exc()

        return get_pos_for_keywords(out)
