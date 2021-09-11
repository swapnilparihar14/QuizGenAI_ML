from nltk import tokenize
import spacy
from allennlp.predictors.predictor import Predictor
from nltk import tokenize
from nltk.tree import Tree

class TrueFalsePreprocessing:

    def __init__(self):
        self.predictor = Predictor.from_path("allennnlpparser/elmo-constituency-parser-2018.03.14.tar.gz")


    def break_sentence(self, sentence):
        test_sentence = sentence.rstrip('?:!.,;')
        parser_output = self.predictor.predict(sentence=test_sentence)
        tree_string = parser_output["trees"]
        tree = Tree.fromstring(tree_string)


    def get_flattened(self, t):
        sent_str_final = None
        if t is not None:
            sent_str = [" ".join(x.leaves()) for x in list(t)]
            sent_str_final = [" ".join(sent_str)]
            sent_str_final = sent_str_final[0]
        return sent_str_final


    def get_right_most_VP_or_NP(self, parse_tree, last_NP=None, last_VP=None):
        if len(parse_tree.leaves()) == 1:
            return last_NP, last_VP
        last_subtree = parse_tree[-1]
        if last_subtree.label() == "NP":
            last_NP = last_subtree
        elif last_subtree.label() == "VP":
            last_VP = last_subtree

        return self.get_right_most_VP_or_NP(last_subtree, last_NP, last_VP)

tfp = TrueFalsePreprocessing()
tfp.split_sentence('''Much of the painting in Verrocchio's workshop was done by his assistants. According to Vasari, 
Leonardo collaborated with Verrocchio on his The Baptism of Christ, painting the young angel holding Jesus' robe in a 
manner that was so far superior to his master's that Verrocchio put down his brush and never painted again.''')
