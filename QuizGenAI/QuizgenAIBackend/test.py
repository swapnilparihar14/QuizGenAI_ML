from model_generation import *

#preprocessing.create_folder()
'''
pre_process_data = preprocessing()
pre_process_data.import_squad()
pre_process_data.enumeration()
pre_process_data.shuffle_and_save()
'''

'''
model_t = transformer_model()
model_t.tokenizer()
model_t.temp_pick()
model_t.explore_tokenizer()
model_t.sentence_piece_tokenizer()
model_t.dataset_prepare()
model_t.model_tuning()

train_dataset = copy.deepcopy(model_t.train_dataset)
validation_dataset = copy.deepcopy(model_t.validation_dataset)
t5_model = copy.deepcopy(model_t.t5_model)
t5_tokenizer = copy.deepcopy(model_t.t5_tokenizer)

'''

prod = model_prod()
prod.import_model()

context ="""There is a lot of volcanic activity at divergent plate boundaries in the oceans. For example, many undersea 
volcanoes are found along the Mid-Atlantic Ridge. This is a divergent plate boundary that runs north-south through 
the middle of the Atlantic Ocean. As tectonic plates pull away from each other at a divergent plate boundary, 
they create deep fissures, or cracks, in the crust. Molten rock, called magma, erupts through these cracks onto 
Earth's surface. At the surface, the molten rock is called lava. It cools and hardens, forming rock. Divergent plate 
boundaries also occur in the continental crust. Volcanoes form at these boundaries, but less often than in ocean 
crust. That's because continental crust is thicker than oceanic crust. This makes it more difficult for molten rock 
to push up through the crust. Many volcanoes form along convergent plate boundaries where one tectonic plate is 
pulled down beneath another at a subduction zone. The leading edge of the plate melts as it is pulled into the 
mantle, forming magma that erupts as volcanoes. When a line of volcanoes forms along a subduction zone, they make up 
a volcanic arc. The edges of the Pacific plate are long subduction zones lined with volcanoes. This is why the 
Pacific rim is called the "Pacific Ring of Fire."""
answer = "plate melts"

prod.generate_question(context, answer)
