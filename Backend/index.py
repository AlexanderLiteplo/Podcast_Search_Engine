from flask import Flask
from flask import request
import google.generativeai as genai

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/api/v1/prompt", methods=['POST'])
def promt():
    if request.method == 'POST':
        PROMPT = 'You as a assistant to Andrew Huberman, pick the vitamins or supplements that he suggests for the user asked input of'+request.form['promptdata']+'JUST MENTION THE SUPPLEMENT OR PROTEIN NOTHING ELSE.'
        MODEL = 'gemini-pro'
        # print('** GenAI text: %r model & prompt %r\n' % (MODEL, PROMPT))

        genai.configure(api_key='AIzaSyASZwo5T5jF_uCYHwX_KO_Mds7W9xzgDFU')
        model = genai.GenerativeModel(MODEL)
        response = model.generate_content(PROMPT)
        return response.text
    else:
        return 'Invalid request.'