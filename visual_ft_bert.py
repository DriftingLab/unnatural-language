
import torch
from transformers import BertTokenizer
import pandas as pd

from settings import *

device = "mps" if torch.backends.mps.is_available() else "cpu"
print(device)
 
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
MAX_LEN=500

def inputseq(seq):
	input_text = seq
	input_text = " ".join(input_text.split())
	input_text=input_text[:512]
	
	inputs = tokenizer.encode_plus(
		input_text,
		None,
		add_special_tokens=True,
		max_length=MAX_LEN,
		padding='max_length',
		return_token_type_ids=True
	)
	
	ids = inputs['input_ids']
	mask = inputs['attention_mask']
	token_type_ids = inputs["token_type_ids"]


	return {
		'ids': torch.tensor(ids, dtype=torch.long),
		'mask': torch.tensor(mask, dtype=torch.long),
		'token_type_ids': torch.tensor(token_type_ids, dtype=torch.long),
	}

def norm(value, min_val, max_val):
	return (value - min_val) / (max_val - min_val)


	   
if __name__ == '__main__':

	df = pd.read_csv(csv_path)
	
	df['seq'] = df.iloc[:,0]
	new_df = df[['seq']].copy()
	print('dataset',len(new_df),type(new_df))
	print('df test:',(new_df['seq'][0]))

	model=(torch.load(checkpoint_path))
	model.eval()
  
	# ambigous / destructive / benefical / progrowth 1=yes ; 0=the opposite/other
	############## test ##########################################################################
	
	seqs_pro=[]
	seqs_des=[]
	pro=[]
	amb=[]
	ben=[]
	des=[]
	
	min_value = 0  # Replace with the actual minimum possible value
	max_value = 18  # Replace with the actual maximum possible value

	for i in range(len(new_df)): #len(new_df)
		seq=df['seq'][i]
		print (i)
		# to run the model, need tokenize the seq input
		data=inputseq(seq)
		ids = data['ids'].to(device, dtype = torch.long)
		mask = data['mask'].to(device, dtype = torch.long)
		token_type_ids = data['token_type_ids'].to(device, dtype = torch.long)
		
		# print(ids,mask,token_type_ids)
		
		outputs = model(ids.unsqueeze(0), mask.unsqueeze(0), token_type_ids.unsqueeze(0))
		# print('amb', outputs[0][0].item(),'des',outputs[0][1].item(),'ben',outputs[0][2].item(),'pro-growth',outputs[0][3].item())
	   
		# only shows not progrowth sentenses
		# if outputs[0][3].item()<0:
		#     seqs.append(seq)
		#     pro.append(outputs[0][3].item())
		#     amb.append(outputs[0][0].item())
		#     ben.append(outputs[0][2].item())
		#     des.append(outputs[0][1].item())
		
		# show pro-growth 3/ eco destructive 1 - map the vector to [0-1]
		if outputs[0][3].item()>0:
			seqs_pro.append(seq)
			
			mapped_value = norm(outputs[0][3].item(), min_value, max_value)
			# print(mapped_value, outputs[0][3].item(),min_value, max_value)
			pro.append(mapped_value)
			
		if outputs[0][1].item()>0:
			seqs_des.append(seq)
			
			mapped_value = norm(outputs[0][1].item(), min_value, max_value)
			# print(mapped_value, outputs[0][3].item(),min_value, max_value)
			des.append(mapped_value)
			
			
	# dataframe = pd.DataFrame({'seq':seqs,'pro-growth':pro,'env_amb':amb,'env_des':des,'env_ben':ben})
	
	dataframe = pd.DataFrame({'seq':seqs_pro,'pro-growth':pro})
	dataframe.to_csv(save_pg_path,index=False,sep=',')
	
	dataframe = pd.DataFrame({'seq':seqs_des,'eco-des':des})
	dataframe.to_csv(save_des_path,index=False,sep=',')
	