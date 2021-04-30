from sense2vec import Sense2Vec
from nltk.corpus import wordnet as wn
from nltk.stem import PorterStemmer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import nltk
nltk.download('wordnet')
#!pip install sense2vec==1.0.3


class DistractorSupport:
    """This is a helper class that provides support functions for DistractorGeneration Class"""

    @classmethod
    def wordnet_distractor_list(cls, distractor_dict, library_weight, grand_weight):
        """Generates the Wordnet Based distractor list
           @input: (distractor_dict)- A dictionary of words for which we need to find distractors   
           @Hyperparameters: (library_weight,grand_weight)-Weight of library and correction for grand child
           @Output: (distractor_dict)-List now containing distractors as value of keywords in dictionary"""

        for element in distractor_dict:
            # Initialization
            distractor = {}
            word = element[0].lower()
            orig_word = word
            if len(word.split()) > 0:
                word = word.replace(" ", "_")
                # This logic doesnt work in this library. Improvement needed
            hypernym = element[1].hypernyms()

            # Distractor generation using parents
            if len(hypernym) != 0:
                grand_hypernym = hypernym[0].hypernyms()
                # print(grand_hypernym)
                for item in hypernym[0].hyponyms():
                    name = item.lemmas()[0].name()
                    #print ("name ",name, " word",orig_word)
                    if name == orig_word:
                        continue
                    name = name.replace("_", " ")
                    name = " ".join(w.capitalize() for w in name.split())
                    if name is not None and name not in distractor:
                        distractor[name] = library_weight

            # Distractor generation using grand-parents
            if len(distractor) < 10 and len(grand_hypernym) != 0:
                for chypernym in grand_hypernym[0].hyponyms():
                    for item in chypernym.hyponyms():
                        name = item.lemmas()[0].name()
                        #print ("name ",name, " word",orig_word)
                        if name == orig_word:
                            continue
                        name = name.replace("_", " ")
                        name = " ".join(w.capitalize() for w in name.split())
                        if name is not None and name not in distractor:
                            distractor[name] = library_weight*grand_weight
                            # print(distractor,"\n\n")

            distractor_dict[element] = distractor
        return distractor_dict

    @classmethod
    def sense2vec_distractor_pruning(cls, dis):
        """Pruning distractor list of the sense2vec library
           @input: (dis)- A dictionary of distractor which are repeated and too similar to original word   
           @Hyperparameters: (library_weight,grand_weight)-None
           @Output: (dis)-List now containing distractors as value of keywords in dictionary"""
        ps = PorterStemmer()
        for i in dis:
            splitted_word = i.split()
            test_dict = dis[i]
            del_list = []
            for word in splitted_word:
                word = ps.stem(word)
                for distractor in test_dict:
                    if word in distractor:
                        del_list.append(distractor)
                    if distractor in word:
                        del_list.append(distractor)
            for duplicate in del_list:
                test_dict.pop(duplicate)

            dis[i] = test_dict
        return dis

    @classmethod
    def get_setenence_cosine_similarity(cls, x, y):
        """ Generates the cosine similarity for two senteces
            @input: (X,Y)- Two sentences
            @Hyperparamters: ()= None
            @Output: (cosine)- Returns the similarity measure between the two sentences"""
        x_list = word_tokenize(x)
        y_list = word_tokenize(y)
        ps = PorterStemmer()
        # sw contains the list of stopwords
        stoplist = list(string.punctuation)
        stoplist += ['-lrb-', '-rrb-', '-lcb-', '-rcb-', '-lsb-', '-rsb-']
        stoplist += stopwords.words('english')
        l1 = []
        l2 = []

        # remove stop words from the string
        x_set = {ps.stem(w) for w in x_list if not w in stoplist}
        y_set = {ps.stem(w) for w in y_list if not w in stoplist}

        # form a set containing keywords of both strings
        rvector = x_set.union(y_set)
        for w in rvector:
            if w in x_set:
                l1.append(1)  # create a vector
            else:
                l1.append(0)
            if w in y_set:
                l2.append(1)
            else:
                l2.append(0)
        c = 0

        # cosine formula
        for i in range(len(rvector)):
            c += l1[i]*l2[i]
        try:
            cosine = c / float((sum(l1)*sum(l2))**0.5)
        except:
            cosine = 0

        return cosine


class DistractorGeneration:
    """Single Responsibility of Overgenerating an exhaustive list of distractors"""
    @classmethod
    def get_wordnet_distractor(cls, keywords, keyword_sentences, library_weight=1, grand_weight=0.8):
        """Returns a list of distractors generated using WordNet Library
            @input: (keyword,keyword_sentences)- Set of keywords and their corresponding sentences
            @hyperparamter: (library_weight,grand_weight)- Weights to adjust the weightage of the library
            @Output: (distractor_list)- List now containing distractors as value of keywords in dictionary"""
        distractor_dict = {}
        for element in keywords:
            word = element[0].lower()
            if len(word.split()) > 0:
                j = 0
                #word = word.replace(" ","_")
                # Add different logic, this doesn't work
            syns = wn.synsets(word, element[1])
            if syns == []:
                syns = wn.synsets(word, 'n')
            if syns == []:
                syns = wn.synsets(word, 'v')
            if syns == []:
                syns = wn.synsets(word, 'a')

            if len(syns) > 1:
                cosine = 0
                for syn in syns[::-1]:
                    # print(element[0])
                    # print (syn, ": ",syn.definition())
                    # Tried with element[1] instead of the whole text. The results were not accurate
                    intial_cosine = DistractorSupport.get_setenence_cosine_similarity(
                        syn.definition(), text)
                    # print(intial_cosine,"\n")
                    if cosine <= intial_cosine:
                        cosine = intial_cosine
                        new_syn = syn
            elif len(syns) == 1:
                new_syn = syns[0]
            else:
                new_syn = []

            str1 = " "
            Y = str1.join(keyword_sentences[element[0]])
            if new_syn and keyword_sentences[element[0]]:
                distractor_dict[(element[0], new_syn, Y)] = 1

        return DistractorSupport.wordnet_distractor_list(distractor_dict, library_weight, grand_weight)

    @classmethod
    def get_distractors_conceptnet(cls, keywords, keyword_sentences, library_weight=1):
        """Returns a list of distractors generated using ConceptNet Library
            @input: (keyword,keyword_sentences)- Set of keywords and their corresponding sentences
            @hyperparamter: (library_weight)- Weights to adjust the weightage of the library
            @Output: (distractor_list)- List now containing distractors as value of keywords in dictionary"""
        distractor_list = {}

        for element in keywords:
            distractor = {}
            word = element[0].lower()
            original_word = word
            if (len(word.split()) > 0):
                word = word.replace(" ", "_")
            url = "http://api.conceptnet.io/query?node=/c/en/%s/%s&rel=/r/PartOf&start=/c/en/%s&limit=5" % (
                word, element[1], word)
            obj = requests.get(url).json()

            for edge in obj['edges']:
                link = edge['end']['term']

                url2 = "http://api.conceptnet.io/query?node=%s&rel=/r/PartOf&end=%s&limit=10" % (
                    link, link)
                obj2 = requests.get(url2).json()
                for edge in obj2['edges']:
                    word2 = edge['start']['label']
                    if word2 not in distractor and original_word.lower() not in word2.lower():
                        distractor[word2] = library_weight
            distractor_list[word] = distractor

        return distractor_list

    @classmethod
    def sense2vec_get_words(cls, keywords, keyword_sentences, library_weight=1):
        """Returns a list of distractors generated using Sense2vec Library
            @input: (keyword,keyword_sentences)- Set of keywords and their corresponding sentences
            @hyperparamter: (library_weight)- Weights to adjust the weightage of the library
            @Output: (distractor_list)- List now containing distractors as value of keywords in dictionary"""

        s2v = Sense2Vec().from_disk('s2v_old')
        distractor_list = {}
        for element in keywords:
            output = {}
            # print(element[0])
            word = element[0].lower()
            word = word.replace(" ", "_")
            most_similar = []
            sense = s2v.get_best_sense(word)
            distractor_limit = 10
            while(distractor_limit > 2):
                try:
                    most_similar = s2v.most_similar(sense, n=distractor_limit)
                    break
                except:
                    distractor_limit -= 2

            # print ("most_similar ",most_similar)

            for each_word in most_similar:
                append_word = each_word[0].split(
                    "|")[0].replace("_", " ").lower()
                if append_word.lower() != word:
                    output[append_word] = each_word[1] * library_weight

            distractor_list[element[0]] = output
            #print(f"{element[0]}:{distractor_list[element[0]]} ")
        return DistractorSupport.sense2vec_distractor_pruning(distractor_list)
