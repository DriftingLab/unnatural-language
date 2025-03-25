# raw text to clean sentenses for refinery

from nltk import sent_tokenize
import re
import pandas as pd

txt_path = "./tests/indonesia.txt"
csv_path = "./tests/indonesia.csv"

with open(txt_path) as file:
    textFile = file.read()

tokenTextList = sent_tokenize(textFile)

text=[re.sub(r"\n\d+\.", "", i) for i in tokenTextList] #delete number+. following text
text=[sub.replace('\n', ' ') for sub in text]
text=[re.sub(r"^\d+\.", "", i) for i in text] #delete single number+.
text=[re.sub(r"\s{2,30}", " ", i) for i in text] #delete extra spaces.
text=[re.sub(r"^\d+^", "", i) for i in text] #delete single number
text=[re.sub(r"^[A-Za-z]+\.$", "", i) for i in text] #delete char+.
text=[re.sub(r"^[i+]\.^", "", i) for i in text] #delete i. / ii. / iii.

while '' in text:
    text.remove('')
 
print('testing:' , text[140:150])

df = pd.DataFrame(text)
df.to_csv(csv_path, index=False, header=False)


# import numpy as np

# np.savetxt("myCSVfile.csv", tokenTextList, delimiter=",", fmt="%s")


# import csv

# with open('myCSVfile.csv', 'w', newline='') as file:
#     write = csv.writer(file, lineterminator='\n')
#     # write.writerows([tokenTextList])
#     write.writerows([[token] for token in tokenTextList]) # For pandas style output

# # Output: ['Here is my first sentence.', "And that's a second one."]

