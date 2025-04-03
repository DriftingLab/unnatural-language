from flask import Flask, request, send_from_directory, send_file, make_response
from flask_cors import CORS
import os
import uuid
import pandas as pd
from werkzeug.utils import secure_filename

from python_modules.pdf_visualizer import highlight_pdf
from python_modules.settings import *

REMOVE_FILE = True

app = Flask(__name__, static_folder='html_assets', static_url_path='/html_assets')
CORS(app)

@app.route('/')
def index():
	return send_from_directory('html_assets', 'index.html')

@app.route('/process_pdf', methods=['POST'])
def process_pdf():
	
	if 'file' not in request.files:
		return {'error': 'No file part'}, 400
	file = request.files['file']
	if file.filename == '':
		return {'error': 'No selected file'}, 400
	if not file.filename.lower().endswith('.pdf'):
		return {'error': 'File must be a PDF'}, 400
	
	try:
	
		df = pd.read_csv(save_pg_path)
		sentences = df["seq"].tolist()
		sentences = sentences[:10]

		unique_id = str(uuid.uuid4())
		filename = secure_filename(f"{unique_id}_{file.filename[:-4]}")
		print(filename)
		input_path = f"tests/{filename}.pdf"
		output_path = f"results/{filename}.pdf"
		
		file.save(input_path)
		highlight_pdf(filename, sentences)
		 
		response = make_response(send_file(
			output_path,
			as_attachment=True,
			download_name=f"processed_{file.filename}",
			mimetype='application/pdf'
		))
		response.headers['X-Internal-Filename'] = filename

		return response
	
	except Exception as e:
		return {'error': str(e)}, 500
	finally:
		try:
			if REMOVE_FILE:
				if os.path.exists(input_path):
					os.remove(input_path)
				if os.path.exists(output_path):
					os.remove(output_path)
		except:
			pass

@app.route('/get_highlights_csv/<filename>', methods=['GET'])
def get_highlights_csv(filename):
	try:
		csv_path = f"results/{filename}.csv"
		print(csv_path)
		if not os.path.exists(csv_path):
			return {'error': 'CSV file not found'}, 404
		return send_file(
			csv_path,
			as_attachment=True,
			download_name=f"{filename}.csv",
			mimetype='text/csv'
		)
	except Exception as e:
		return {'error': str(e)}, 500
	finally:
		try:
			if (REMOVE_FILE and os.path.exists(csv_path)):
				os.remove(csv_path)
		except:
			pass

if __name__ == '__main__':
	app.run(debug=True)