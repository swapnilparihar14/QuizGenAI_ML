from datasets import load_dataset, Dataset
import os
import pandas as pd
from tqdm.notebook import tqdm
from sklearn.utils import shuffle
import argparse
import glob
import os
import json
import time
import logging
import random
import re
import copy
from itertools import chain
from string import punctuation

import pandas as pd
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
import pytorch_lightning as pl
from termcolor import colored
import textwrap

from transformers import (
    AdamW,
    T5ForConditionalGeneration,
    T5Tokenizer,
    get_linear_schedule_with_warmup
)

pl.seed_everything(42)


class preprocessing:
    train_dataset = pd.DataFrame()
    valid_dataset = pd.DataFrame()
    df_train = pd.DataFrame()
    df_validation = pd.DataFrame()
    abc = pd.DataFrame()
    train_save_path = 't5/dataset/squad_t5_train.csv'
    validation_save_path = 't5/dataset/squad_t5_val.csv'

    def __init__(self):
        'sdas'

    def create_folder(self):
        '''Create folder structure for storing model files'''
        os.mkdir('t5')
        os.mkdir('t5/dataset')
        os.mkdir('t5/model')
        os.mkdir('t5/tokenizer')
        os.mkdir('t5/raw')
        os.mkdir('t5/raw/test')
        os.mkdir('t5/raw/train')

    def import_squad(self):
        self.train_dataset = load_dataset('squad', split='train')
        self.valid_dataset = load_dataset('squad', split='validation')

    def enumeration(self):
        self.df_train = pd.DataFrame(columns=['context', 'answer', 'question'])
        self.df_validation = pd.DataFrame(columns=['context', 'answer', 'question'])
        print(self.df_validation)
        print(self.df_train)

        self.df_train = shuffle(self.df_train)
        self.df_validation = shuffle(self.df_validation)

        count_long = 0
        count_short = 0

        for index, val in enumerate(tqdm(self.train_dataset)):
            passage = val['context']
            question = val['question']
            answer = val['answers']['text'][0]
            no_of_words = len(answer.split())
            if no_of_words >= 7:
                count_long = count_long + 1
                continue
            else:
                self.df_train.loc[count_short] = [passage] + [answer] + [question]
                count_short = count_short + 1

            print(count_long, count_short)

        print("count_long validation dataset: ", count_long)
        print("count_short validation dataset: ", count_short)

        for index, val in enumerate(tqdm(self.valid_dataset)):
            passage = val['context']
            question = val['question']
            answer = val['answers']['text'][0]
            no_of_words = len(answer.split())
            if no_of_words >= 7:
                count_long = count_long + 1
                continue
            else:
                self.df_validation.loc[count_short] = [passage] + [answer] + [question]
                count_short = count_short + 1

            print(count_long, count_short)

        print("count_long train dataset: ", count_long)
        print("count_short train dataset: ", count_short)

        print(self.df_train.shape)
        print(self.df_validation.shape)

    def shuffle_and_save(self):
        self.df_train = shuffle(self.df_train)
        self.abc.to_csv(self.train_save_path, index=False)
        self.abc = shuffle(self.df_validation)
        self.abc.to_csv(self.validation_save_path, index=False)


class transformer_model:
    train_file_path = 't5/dataset/squad_t5_train.csv'
    validation_file_path = 't5/dataset/squad_t5_val.csv'

    def __init__(self):
        self.t5_tokenizer = None
        self.t5_model = None
        self.sample_encoding = None
        self.tokenized_output = None
        self.decoded_output = None
        self.train_dataset = None
        self.train_sample = None
        self.decoded_train_input = None
        self.decoded_train_output = None
        self.validation_dataset = None

    def tokenizer(self):
        self.t5_tokenizer = T5Tokenizer.from_pretrained('t5-base')
        self.t5_model = T5ForConditionalGeneration.from_pretrained('t5-base')

    def temp_pick(self):
        import pickle
        '''
        pickle_out = open("tokenizer.pickle", 'wb')
        pickle.dump(self.t5_tokenizer, pickle_out)

        pickle_out = open("t5.pickle", 'wb')
        pickle.dump(self.t5_model, pickle_out)
        '''
        pickle_in = open("t5.pickle", 'rb')
        self.t5_model = pickle.load(pickle_in)

        pickle_in = open("tokenizer.pickle", 'rb')
        self.t5_tokenizer = pickle.load(pickle_in)
        #'''

    def explore_tokenizer(self):
        from pprint import pprint
        self.sample_encoding = self.t5_tokenizer.encode_plus("My name is XYZ",
                                                             max_length=64,
                                                             pad_to_max_length=True,
                                                             truncation=True,
                                                             return_tensors="pt")

        print(self.sample_encoding.keys())
        pprint(self.sample_encoding)
        print(self.sample_encoding['input_ids'].shape)
        print(self.sample_encoding['input_ids'].squeeze().shape)
        print(self.sample_encoding['input_ids'])

    def sentence_piece_tokenizer(self):
        self.tokenized_output = self.t5_tokenizer.convert_ids_to_tokens(self.sample_encoding['input_ids'].squeeze())
        print('Tokenized Output', self.tokenized_output)

        self.decoded_output = self.t5_tokenizer.decode(self.sample_encoding['input_ids'].squeeze(),
                                                       skip_special_tokens=True, clean_up_tokenization_spaces=True)
        print('Decoded Output', self.decoded_output)

        print(self.t5_tokenizer.get_vocab())
        print(len(self.t5_tokenizer.get_vocab().keys()))

    def dataset_prepare(self):
        self.train_dataset = QuestionGenerationDataset(self.t5_tokenizer, self.train_file_path)
        self.train_sample = self.train_dataset[50]
        self.decoded_train_input = self.t5_tokenizer.decode(self.train_sample['source_ids'])
        self.decoded_train_output = self.t5_tokenizer.decode(self.train_sample['target_ids'])
        print(self.decoded_train_input)
        print(self.decoded_train_output)

        self.validation_dataset = QuestionGenerationDataset(self.t5_tokenizer, self.train_file_path)# self.validation_file_path)
        self.train_sample = self.validation_dataset[50]
        self.decoded_train_input = self.t5_tokenizer.decode(self.train_sample['source_ids'])
        self.decoded_train_output = self.t5_tokenizer.decode(self.train_sample['target_ids'])
        print(self.decoded_train_input)
        print(self.decoded_train_output)

    def model_tuning(self):
        train_dataset = copy.deepcopy(self.train_dataset)
        validation_dataset = copy.deepcopy(self.validation_dataset)
        t5_model = copy.deepcopy(self.t5_model)
        t5_tokenizer = copy.deepcopy(self.t5_tokenizer)

        args_dict = dict(
            batch_size=4,
        )

        args = argparse.Namespace(**args_dict)

        model = T5FineTuner(args, self.t5_model, self.t5_tokenizer)

        trainer = pl.Trainer(max_epochs=1, gpus=0, progress_bar_refresh_rate=30)

        trainer.fit(model)

        print("Saving model")
        save_path_model = 't5/model/'
        save_path_tokenizer = 't5/tokenizer/'
        model.model.save_pretrained(save_path_model)
        t5_tokenizer.save_pretrained(save_path_tokenizer)


class model_prod:
    trained_model_path = 't5/model1/'
    trained_tokenizer = 't5/tokenizer1/'

    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.device = None
        self.answer = None
        self.context = None
        self.sent = None
        self.encoding = None
        self.input_ids = None
        self.attention_mask = None
        self.beam_outputs = None

    def import_model(self):
        self.model = T5ForConditionalGeneration.from_pretrained(self.trained_model_path)
        self.tokenizer = T5Tokenizer.from_pretrained(self.trained_tokenizer)

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print("device ", self.device)
        self.model = self.model.to(self.device)

    def generate_question(self):
        self.encoding = self.tokenizer.encode_plus(self.text, max_length=512, padding=True, return_tensors="pt")
        print(self.encoding.keys())
        self.input_ids, self.attention_mask = self.encoding["input_ids"].to(self.device), self.encoding["attention_mask"].to(self.device)

        self.model.eval()
        self.beam_outputs = self.model.generate(
            input_ids=self.input_ids, attention_mask=self.attention_mask,
            max_length=72,
            early_stopping=True,
            num_beams=5,
            num_return_sequences=5

        )

        for beam_output in self.beam_outputs:
            self.sent = self.tokenizer.decode(beam_output, skip_special_tokens=True, clean_up_tokenization_spaces=True)
            print(self.sent)


class QuestionGenerationDataset(Dataset):

    def __init__(self, tokenizer, filepath, max_len_inp=512, max_len_out=96):
        self.path = filepath

        self.passage_column = "context"
        self.answer = "answer"
        self.question = "question"

        # self.data = pd.read_csv(self.path)
        self.data = pd.read_csv(self.path, nrows=1000)

        self.max_len_input = max_len_inp
        self.max_len_output = max_len_out
        self.tokenizer = tokenizer
        self.inputs = []
        self.targets = []
        self.skippedcount = 0
        self._build()

    def __len__(self):
        return len(self.inputs)

    def __getitem__(self, index):
        source_ids = self.inputs[index]["input_ids"].squeeze()
        target_ids = self.targets[index]["input_ids"].squeeze()

        src_mask = self.inputs[index]["attention_mask"].squeeze()  # might need to squeeze
        target_mask = self.targets[index]["attention_mask"].squeeze()  # might need to squeeze

        labels = copy.deepcopy(target_ids)
        labels[labels == 0] = -100

        return {"source_ids": source_ids, "source_mask": src_mask, "target_ids": target_ids,
                "target_mask": target_mask, "labels": labels}

    def _build(self):
        for idx in tqdm(range(len(self.data))):
            passage, answer, target = self.data.loc[idx, self.passage_column], self.data.loc[idx, self.answer], \
                                      self.data.loc[idx, self.question]

            input_ = "context: %s  answer: %s </s>" % (passage, answer)
            target = "question: %s </s>" % (str(target))

            # get encoding length of input. If it is greater than self.max_len skip it
            test_input_encoding = self.tokenizer.encode_plus(input_, truncation=False, return_tensors="pt")

            length_of_input_encoding = len(test_input_encoding['input_ids'][0])

            if length_of_input_encoding > self.max_len_input:
                self.skippedcount = self.skippedcount + 1
                continue

            # tokenize inputs
            tokenized_inputs = self.tokenizer.batch_encode_plus(
                [input_], max_length=self.max_len_input, pad_to_max_length=True, return_tensors="pt"
            )
            # tokenize targets
            tokenized_targets = self.tokenizer.batch_encode_plus(
                [target], max_length=self.max_len_output, pad_to_max_length=True, return_tensors="pt"
            )

            self.inputs.append(tokenized_inputs)
            self.targets.append(tokenized_targets)


class T5FineTuner(pl.LightningModule):

    def __init__(self, hparams, t5model, t5tokenizer):
        super(T5FineTuner, self).__init__()
        self.hparams = hparams
        self.model = t5model
        self.tokenizer = t5tokenizer

    def forward(self, input_ids, attention_mask=None, decoder_input_ids=None, decoder_attention_mask=None,
                lm_labels=None):
        outputs = self.model(
            input_ids=input_ids,
            attention_mask=attention_mask,
            decoder_attention_mask=decoder_attention_mask,
            labels=lm_labels,
        )

        return outputs

    def training_step(self, batch, batch_idx):
        outputs = self.forward(
            input_ids=batch["source_ids"],
            attention_mask=batch["source_mask"],
            decoder_input_ids=batch["target_ids"],
            decoder_attention_mask=batch['target_mask'],
            lm_labels=batch['labels']
        )

        loss = outputs[0]
        self.log('train_loss', loss)
        return loss

    def validation_step(self, batch, batch_idx):
        outputs = self.forward(
            input_ids=batch["source_ids"],
            attention_mask=batch["source_mask"],
            decoder_input_ids=batch["target_ids"],
            decoder_attention_mask=batch['target_mask'],
            lm_labels=batch['labels']
        )

        loss = outputs[0]
        self.log("val_loss", loss)
        return loss

    def train_dataloader(self):
        train_dataset = copy.deepcopy(self.train_dataset)
        return DataLoader(train_dataset, batch_size=self.hparams.batch_size, num_workers=4)

    def val_dataloader(self):
        validation_dataset = copy.deepcopy(self.validation_dataset)
        return DataLoader(validation_dataset, batch_size=self.hparams.batch_size, num_workers=4)

    def configure_optimizers(self):
        optimizer = AdamW(self.parameters(), lr=3e-4, eps=1e-8)
        return optimizer
