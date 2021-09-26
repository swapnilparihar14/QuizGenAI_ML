LOGGER_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
STATUS = "status"
MESSAGE = "message"
PDF_EXTENSION = '.pdf'
TEXT_EXTENSION = '.txt'
PPTX_EXTENSION = '.pptx'
HTML_EXTENSION = '.html'
DEEP_AI_SUMMARIZER = "https://api.deepai.org/api/summarization"
ENGLISH = 'english'
ERROR_MESSAGE = 'Error'
SUCCESS_MESSAGE = 'Success'
ALLEN_NLP_MODEL = 'https://s3-us-west-2.amazonaws.com/allennlp/models/elmo-constituency-parser-2018.03.14.tar.gz'
GPT2 = 'gpt2'
BERT_FOR_TF_QUESTIONS = 'distilbert-base-nli-stsb-mean-tokens'
KEYBERT_TOKENS = 'distilbert-base-nli-mean-tokens'
POS = {'VERB', 'ADJ', 'NOUN'}
CONVERT_POS = {'VERB': 'v', 'NOUN': 'n', 'ADJ': 'a'}
GET_POS = {'N': 'n', 'V': 'v', 'J': 'a'}
ADDITIONAL_STOPWORDS = ['-lrb-', '-rrb-', '-lcb-', '-rcb-', '-lsb-', '-rsb-']
GRAMMAR = "NP: {<ADJ>*<NOUN|PROPN>+}"
CONCEPT_NET_API_1 = "http://api.conceptnet.io/query?node=/c/en/%s/%s&rel=/r/PartOf&start=/c/en/%s&limit=5"
CONCEPT_NET_API_2 = "http://api.conceptnet.io/query?node=%s&rel=/r/PartOf&end=%s&limit=10"
DISTRACTOR_LIB_WEIGHTS = [1, 1, 1]
WORDNET_GRAND_WEIGHT = 0.8
WORDNET_LIMIT = 5
SENSE2VEC_MODEL = 'model/s2v_old'
SENTENCE_CHAR_LIMIT = 20
DEEP_AI_ERROR = "DeepAI API not working. Contact the development team @swapnil.parihars@gmail.com"
FILL_IN_THE_BLANK_STRING = '__________'
UPLOAD_FOLDER = ''
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'html', 'pptx'])
trained_model_path = 'Question_generation/t5/model1/'
trained_tokenizer = 'Question_generation/t5/tokenizer1/'

