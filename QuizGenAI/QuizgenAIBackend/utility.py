from string import punctuation

import nltk
import re
import wikipedia
from flashtext import KeywordProcessor
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize

# nltk.download('stopwords')

from nltk.translate.bleu_score import sentence_bleu
from rouge_score import rouge_scorer
from constants import ENGLISH, ADDITIONAL_STOPWORDS, SENTENCE_CHAR_LIMIT, GET_POS, FILL_IN_THE_BLANK_STRING


def bleu_score(reference, candidate, weight=(1, 0, 0, 0)):
    """
    Return the bleu score of the input sentences
    :param reference: The reference sentence to compare with the generated sentence
    :param candidate: The candidate or the sentence to be evaluate
    :param weight: A tuple that decides the weightage of uni-grams,bi-grams in the sentences
    :return: The BLEU score for the input text
    """
    ref_tokenize = nltk.word_tokenize(reference)
    can_tokenize = nltk.word_tokenize(candidate)
    return {'bleu': sentence_bleu([ref_tokenize], can_tokenize, weights=weight)}


def rouge_score(reference, candidate):
    """
    Return the bleu score of the inout sentences
    :param reference: The reference sentence to compare with the generated sentence
    :param candidate: The candidate or the sentence to be evaluate
    :return: The ROUGE score for the input text
    """
    scorer = rouge_scorer.RougeScorer(['rouge1', 'rougeL'], use_stemmer=True)
    scores = scorer.score(reference, candidate)
    result = {}
    for i in scores:
        result[i] = scores[i][2]
    return result


def get_keyword_limit(no_of_words, user_limit=0) -> int:
    """
    Estimates the number of keywords required
    :param no_of_words: Block of continuous text on a single topic
    :param user_limit: Provide a specific number of users
    :return:
    """
    if user_limit == 0:
        return round(no_of_words / 15)
    return user_limit


def get_stopword_list():
    """ Returns a complete list of stopwords for algorithms """
    return list(punctuation) + ADDITIONAL_STOPWORDS + stopwords.words(ENGLISH)


def get_sentence_cosine_similarity(x, y):
    """
    Generates the cosine similarity between two sentences
    :param x: One of the two sentences to be compared
    :param y: One of the two sentences to be compared
    :return: Cosine similarity between the two sentences
    """
    ps, stoplist, c = PorterStemmer(), get_stopword_list(), 0
    x_set = {ps.stem(w) for w in word_tokenize(x) if not w in stoplist}
    y_set = {ps.stem(w) for w in word_tokenize(y) if not w in stoplist}
    rvector = x_set.union(y_set)
    l1 = [1 if w in x_set else 0 for w in rvector]
    l2 = [1 if w in y_set else 0 for w in rvector]
    for i in range(len(rvector)):
        c += l1[i] * l2[i]
    try:
        cosine = c / float((sum(l1) * sum(l2)) ** 0.5)
    except:
        cosine = 0
    return cosine


def tokenize_sentences(text, pruning=True):
    """
    Converts long passages into array consisting of individual sentences
    :param text: Block of continuous text on a single topic
    :param pruning: Remove smaller sentences
    :return: Sentence Array
    """
    sentences = re.split("(?<!etc)\.", text)
    if pruning:
        return [sentence.strip() for sentence in sentences if len(sentence) > SENTENCE_CHAR_LIMIT]
    return sentences


def get_pos_for_keywords(keywords):
    """
    Generates POS for Non-POS based keywords
    :param keywords: Dictionary of keywords
    :return: returns tag for the keyword
    """
    pos = nltk.pos_tag(keywords)[0][1][0]
    try:
        return GET_POS[pos]
    except:
        return 'n'


def get_sentences_for_keyword(keywords, sentences):
    """
    Maps Keywords with their sentences
    :param keywords: Dictionary of keywords
    :param sentences: Sentence Array
    :return: Dictionary with the syntax {('keyword','partofspeech'):weightage}
    """
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


def get_fill_in_the_blank(keyword, sentence):
    """
    Converts the first occurrence of a keyword in the sentence with blank space
    :param keyword: Keyword selected for fill in the blanks
    :param sentence: Sentence containing the keyword
    :return: Sentence with the keyword dashed-out or empty string if failed
    """
    if keyword.lower() + ' ' in sentence.lower():
        reg_ex = re.compile(re.escape(keyword+' '), re.IGNORECASE)
        return reg_ex.sub(FILL_IN_THE_BLANK_STRING + ' ', sentence)
    elif ' ' + keyword.lower() in sentence.lower():
        reg_ex = re.compile(re.escape(' ' + keyword), re.IGNORECASE)
        return reg_ex.sub(' ' + FILL_IN_THE_BLANK_STRING, sentence)
    elif keyword.lower() in sentence.lower():
        reg_ex = re.compile(re.escape(keyword), re.IGNORECASE)
        return reg_ex.sub(FILL_IN_THE_BLANK_STRING, sentence)
    return ""


def get_data_from_wiki(keyword):
    """
    Get the definition of a keyword from the web
    :param keyword: Keyword for which new information is required from the web
    :return: text extracted from Wikipedia
    """
    try:
        wiki = wikipedia.page(keyword)
        text = wiki.content.split('==')[0]
        return re.sub(r"\([^()]*\)", "", text)
    except:
        return ""
