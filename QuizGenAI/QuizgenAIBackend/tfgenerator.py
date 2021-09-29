# import tensorflow as tf
# import nltk
# nltk.download('punkt')
import scipy
# from nltk import tokenize
# import spacy
import logging
from nltk import tokenize
from nltk.tree import Tree
import re
from constants import LOGGER_FORMAT
import inspect


class TrueFalsePreprocessing:

    def __init__(self, predictor):
        self.predictor = predictor
        self.log = logging.getLogger(self.__class__.__name__)
        file_handler = logging.FileHandler(f'logs/{self.__class__.__name__}.log')
        formatter = logging.Formatter(LOGGER_FORMAT)
        file_handler.setFormatter(formatter)
        self.log.addHandler(file_handler)

    def tfdriver(self, sentence, GPT2tokenizer, GPT2model, BERT_model_tfquestions):
        try:
            split_sentence = self.tfpreprocessor(sentence)
            tfgen = TrueFalseGenerator(GPT2tokenizer, GPT2model, BERT_model_tfquestions)
            false_question = tfgen.generate_tf_questions(sentence, split_sentence)
            return false_question
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")

    def tfpreprocessor(self, sentence):
        try:
            tree = self.break_sentence(sentence)
            last_nounphrase, last_verbphrase = self.get_right_most_VP_or_NP(tree)
            last_nounphrase_flattened = self.get_flattened(last_nounphrase)
            last_verbphrase_flattened = self.get_flattened(last_verbphrase)
            longest_phrase_to_use = max(last_nounphrase_flattened, last_verbphrase_flattened, key=len)
            longest_phrase_to_use = re.sub(r"-LRB- ", "(", longest_phrase_to_use)
            longest_phrase_to_use = re.sub(r" -RRB-", ")", longest_phrase_to_use)
            split_sentence = self.get_termination_portion(sentence, longest_phrase_to_use)
            return split_sentence
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")

    def break_sentence(self, sentence):
        try:
            test_sentence = sentence.rstrip('?:!.,;')
            parser_output = self.predictor.predict(sentence=test_sentence)
            tree_string = parser_output["trees"]
            tree = Tree.fromstring(tree_string)
            return tree
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")

    def get_flattened(self, t):
        try:
            sent_str_final = None
            if t is not None:
                sent_str = [" ".join(x.leaves()) for x in list(t)]
                sent_str_final = [" ".join(sent_str)]
                sent_str_final = sent_str_final[0]
            return sent_str_final
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")

    def get_right_most_VP_or_NP(self, parse_tree, last_NP=None, last_VP=None):
        try:
            if len(parse_tree.leaves()) == 1:
                return last_NP, last_VP
            last_subtree = parse_tree[-1]
            if last_subtree.label() == "NP":
                last_NP = last_subtree
            elif last_subtree.label() == "VP":
                last_VP = last_subtree
            return self.get_right_most_VP_or_NP(last_subtree, last_NP, last_VP)
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")

    def get_termination_portion(self, main_string, sub_string):
        try:
            combined_sub_string = sub_string.replace(" ", "")
            main_string_list = main_string.split()
            last_index = len(main_string_list)
            for i in range(last_index):
                check_string_list = main_string_list[i:]
                check_string = "".join(check_string_list)
                check_string = check_string.replace(" ", "")
                if check_string == combined_sub_string:
                    return " ".join(main_string_list[:i])
            return None
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")


class TrueFalseGenerator:

    def __init__(self, GPT2tokenizer, GPT2model, BERT_model):
        self.GPT2tokenizer = GPT2tokenizer
        self.GPT2model = GPT2model
        self.BERT_model = BERT_model
        self.log = logging.getLogger(self.__class__.__name__)
        file_handler = logging.FileHandler(f'logs/{self.__class__.__name__}.log')
        formatter = logging.Formatter(LOGGER_FORMAT)
        file_handler.setFormatter(formatter)
        self.log.addHandler(file_handler)

    def generate_tf_questions(self, original_sentence, partial_sentence):
        try:
            false_sentences = self.generate_alternate_endings(partial_sentence)
            false_sentence = self.choose_best_sentence(original_sentence, false_sentences)
            return false_sentence
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")

    def generate_alternate_endings(self, partial_sentence):
        try:
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
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")

    def choose_best_sentence(self, original_sentence, false_sentences):
        try:
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
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")






