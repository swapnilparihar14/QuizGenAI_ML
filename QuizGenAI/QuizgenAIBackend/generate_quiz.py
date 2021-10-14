import inspect
import logging
import os
import random

from flask import jsonify
from werkzeug.utils import secure_filename

from constants import LOGGER_FORMAT, UPLOAD_FOLDER, CONTEXT, QUESTION, OPTIONS, CORRECT_ANS, IS_SELECTED
from constants import STATUS, MESSAGE
from distractor_generation import DistractorGeneration
from keyword_pos_extraction import KeywordAndPOS
from text_extractor import Dotx2text
from text_summarization import ExtractiveTextSum
from utility import tokenize_sentences, get_fill_in_the_blank
from tfgenerator import TrueFalsePreprocessing
from long_question_generation import model_prod
import datetime;


class GenerateQuiz:
    """ Generates the complete quiz """

    def __init__(self, predictor, GPT2tokenizer, GPT2model, BERT_model, t5_model, t5_tokenizer):
        """ Constructor """
        self.AllenNLPpredictor = predictor
        self.GPT2tokenizer = GPT2tokenizer
        self.GPT2model = GPT2model
        self.BERT_model = BERT_model
        self.t5_model = t5_model
        self.t5_tokenizer = t5_tokenizer
        self.log = logging.getLogger(self.__class__.__name__)
        file_handler = logging.FileHandler(f'logs/{self.__class__.__name__}.log')
        formatter = logging.Formatter(LOGGER_FORMAT)
        file_handler.setFormatter(formatter)
        self.log.addHandler(file_handler)

    def generate_quiz_driver(self, quiz_details, file, db):
        try:
            quiz_details_dict = {}
            file_destination = self.upload_files(file)
            timed = quiz_details['timed']
            quiz_details_dict['quiz_name'] = quiz_details['quiz_name']
            quiz_details_dict['access_code'] = quiz_details['access_code']
            quiz_details_dict['quiz_type'] = quiz_details['quiz_type']
            quiz_details_dict['creator_id'] = quiz_details['creator_id']
            quiz_details_dict['created_on'] = datetime.datetime.now()
            quiz_details_dict['active'] = False
            if timed == "yes":
                quiz_details_dict['duration'] = (int(quiz_details['hours']) * 60) + int(quiz_details['minutes'])
            no_of_mcq = int(quiz_details['mcq'])
            no_of_fbq = int(quiz_details['fbq'])
            no_of_tfq = int(quiz_details['tfq'])
            questions = self.generate_questions(no_of_mcq, no_of_fbq, no_of_tfq, file_destination)
            quiz_id = db.quiz.insert_one(quiz_details_dict).inserted_id
            return 200, jsonify(
                message="success",
                questions=questions,
                quiz_id=str(quiz_id)
            )
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error")

    def upload_files(self, file):
        try:
            target = os.path.join(UPLOAD_FOLDER, 'quiz_docs')
            if not os.path.isdir(target):
                os.mkdir(target)
            file = file
            filename = secure_filename(file.filename)
            destination = "/".join([target, filename])
            file.save(destination)
            return destination
        except OSError as exc:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {exc}")
            return ""

    def text_preprocessing(self, filename, total_question_count):
        """
        For the input file generates the text tokens required for different Quiz generation classes
        :param filename: Input file path
        :param total_question_count: Sum of the total count of sentences required
        :return: lists containing summarized sentences and extracted keyword-pos
        """
        raw_text = Dotx2text().get_text_from_file(filename)
        if raw_text[STATUS] == 100:
            # Set safety factor to higher values if more sentences are required for a given text
            extractor = ExtractiveTextSum(text=raw_text[MESSAGE], question_count=total_question_count)
        else:
            return raw_text
        sentences_list = tokenize_sentences(extractor.get_text_summary())

        # Add Below code once co-reference resolution is implemented or Web scrapping is enabled
        # random.shuffle(sentences_list)
        keyword_list = [KeywordAndPOS(sentence).get_keywords_key_bert() for sentence in sentences_list]
        return sentences_list, keyword_list

    def get_fb_question(self, context, options, correct_ans):
        """
        Get the fill in the blank question for the given content and keyword
        :param context: The selected sentence
        :param options: distractor and answer list
        :param correct_ans: The location of the correct answer
        :return: dictionary containing all relevant information about fnb for the frontend
        """
        question = get_fill_in_the_blank(options[correct_ans], context)
        return {CONTEXT: context, QUESTION: question, OPTIONS: options, CORRECT_ANS: correct_ans, IS_SELECTED: False}

    def get_distractor(self, keywords, sentences, option_length):
        """
        Generates distractors for the fill in the blanks and MCQ questions
        :param keywords: Input Keyword
        :param sentences: Input sentence
        :param option_length: Number of distractors plus 1
        :return: keyword and distractor tuple
        """
        key = next(iter(keywords))
        temp = DistractorGeneration(key, sentences, option_length - 1).get_all_distractors()
        keyword = next(iter(temp))
        distractor = list(temp[keyword].keys())
        distractor.append(keyword)
        if not distractor:
            return -1, []
        random.shuffle(distractor)
        return distractor.index(keyword), distractor

    def get_mcq_question(self, context, options, correct_ans):
        """
        Get the fill in the blank question for the given content and keyword
        :param context: The selected sentence
        :param options: Distractor and answer list
        :param correct_ans: The location of the correct answer
        :return: dictionary containing all relevant information about mcq for the frontend
        """
        temp_model_obj = model_prod(self.t5_model, self.t5_tokenizer)
        question = temp_model_obj.generate_question(context, options[correct_ans])
        return {CONTEXT: context, QUESTION: question, OPTIONS: options, CORRECT_ANS: correct_ans, IS_SELECTED: False}

    def get_tfq_question(self, sentence, iter):
        """
        Get the True or False question for the given content
        :param context: The selected sentence
        :return: dictionary containing all relevant information about mcq for the frontend
        """
        question = sentence
        correct_ans = True
        if iter%2 == 0:
            tfpre = TrueFalsePreprocessing(self.AllenNLPpredictor)
            generated_question = tfpre.tfdriver(sentence, self.GPT2tokenizer, self.GPT2model, self.BERT_model)
            if generated_question is None:
                question = sentence
                correct_ans = True
            else:
                question = generated_question
                correct_ans = False
        return {QUESTION: question, CORRECT_ANS: correct_ans, IS_SELECTED: False}

    def generate_questions(self, no_of_mcq, no_of_fbq, no_of_tfq, file_destination, no_of_saq=0, option_length=4):
        """
        Generates all types of questions
        :param no_of_mcq: Number of MCQs requested by the user
        :param no_of_fbq: Number of FBs requested by the user
        :param no_of_tfq: Number of TFs requested by the user
        :param file_destination: Location of the input file
        :param no_of_saq: Number of SAs requested by the user
        :param option_length: Requested length of distractors
        :return: Dictionary containing a list of questions for each type
        """
        mcquestions, fbquestions, tfquestions = [], [], []
        total_question_count = no_of_mcq + no_of_fbq + no_of_tfq + no_of_saq
        sentences_list, keyword_list = self.text_preprocessing(file_destination, total_question_count)
        sentence_count, sent_iter, q_iter = len(sentences_list), 0, 0
        while sent_iter < sentence_count and q_iter < total_question_count:
            flag = True
            if no_of_fbq or no_of_mcq:
                keyword_pos, distractors = self.get_distractor(keyword_list[sent_iter], sentences_list[sent_iter],
                                                               option_length)
                if len(distractors) == option_length and no_of_fbq:
                    fbquestions.append(self.get_fb_question(sentences_list[sent_iter], distractors, keyword_pos))
                    no_of_fbq -= 1
                    flag = False
                elif len(distractors) == option_length:
                    mcquestions.append(self.get_mcq_question(sentences_list[sent_iter], distractors, keyword_pos))
                    no_of_mcq -= 1
                    flag = False
            if no_of_tfq and flag:
                tfquestions.append(self.get_tfq_question(sentences_list[sent_iter], no_of_tfq))
                no_of_tfq -= 1
            sent_iter += 1
            total_question_count = no_of_mcq + no_of_fbq + no_of_tfq + no_of_saq
        return {'mcq': mcquestions, 'fbq': fbquestions, 'tfq': tfquestions}

    def save_questions(self, questions_data, db):
        try:
            questions = questions_data['questions']
            tfq = questions['tfq']
            mcq = questions['mcq']
            fbq = questions['fbq']
            quiz_id = questions_data['quiz_id']
            for question in tfq:
                if question['isSelected']:
                    db.questions.insert_one({
                        'question': question['question'],
                        'answer': question['correctAnswer'],
                        'type': 'tfq',
                        'quiz_id': quiz_id
                    })
            for question in mcq:
                if question['isSelected']:
                    db.questions.insert_one({
                        'context': question['context'],
                        'question': question['question'],
                        'answer': question['correctAnswer'],
                        'options': question['options'],
                        'type': 'mcq',
                        'quiz_id': quiz_id
                    })
            for question in fbq:
                if question['isSelected']:
                    db.questions.insert_one({
                        'question': question['question'],
                        'answer': question['correctAnswer'],
                        'options': question['options'],
                        'type': 'fbq',
                        'quiz_id': quiz_id
                    })
            return 200, jsonify(message="Success")
        except Exception as e:
            self.log.error(f"{inspect.currentframe().f_code.co_name} . Error: {e}")
            return 400, jsonify(message="Error")

"""
Driver Code if you want to run and test your code for MCQ and TF generation
a = GenerateQuiz()
print(a.generate_questions(1, 1, 2, 'sample.txt'))
"""
