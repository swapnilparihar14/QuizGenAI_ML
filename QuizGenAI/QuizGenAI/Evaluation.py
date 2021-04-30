import nltk
from nltk.translate.bleu_score import sentence_bleu
from rouge_score import rouge_scorer

# pip install rouge-score


class EvaluationMethods:
    """ Single responsibility of generating Known evaluation metric scores"""

    @classmethod
    def bleu_score(cls, reference, candidate, weight=(1, 0, 0, 0)):
        """Return the bleu score of the inout senteces 
            @input: (reference,candidate)- Two sentences that to compare
            @Hyperparameter: (weights) - A tuple that decides the weightage of unigrams,bigrams and so on
            @Output: (result)- The BLEU score for the input text"""
        ref_tokenize = nltk.word_tokenize(reference)
        can_tokenize = nltk.word_tokenize(candidate)
        score = sentence_bleu([ref_tokenize], can_tokenize, weights=weight)
        result = {}
        result['bleu'] = score
        return result

    @classmethod
    def rouge_score(cls, reference, candidate):
        """Return the bleu score of the inout senteces 
            @input: (reference,candidate)- Two sentences that to compare
            @Hyperparameter: (None) 
            @Output: (result)- The ROUGE score for the input text"""
        scorer = rouge_scorer.RougeScorer(
            ['rouge1', 'rougeL'], use_stemmer=True)
        scores = scorer.score(reference, candidate)
        result = {}
        for i in scores:
            result[i] = scores[i][2]
        return result
