import logging

from flask import abort, jsonify, request
import google.generativeai as genai
from os import getenv
import os
from supabase import create_client, Client

# from app.content_generation import  
from . import api_bp  # Import the Blueprint

logging.basicConfig(level=logging.INFO)

url_expiry_time = 3600*5 #(5 hours)

@api_bp.route('/prompt', methods=['POST'])
def prompt():
    '''
    input:
    {
        'promptdata': "what does andrew huberman say about fat loss"
    }
    '''
    # ensure the id field is in the request
    data = request.get_json()
    if not all(key in data for key in ['promptdata']):
        abort(400, description="Missing data in request payload")
    

    PROMPT = f'''You as a assistant to Andrew Huberman, pick the vitamins or supplements that he suggests for the user asked input of {data['promptdata']}
                 RETURN AS A COMMA SEPERATED LIST ONLY AND NOTHING ELSE.'''
    MODEL = 'gemini-pro'
    # print('** GenAI text: %r model & prompt %r\n' % (MODEL, PROMPT))

    genai.configure(api_key='AIzaSyASZwo5T5jF_uCYHwX_KO_Mds7W9xzgDFU')
    model = genai.GenerativeModel(MODEL)
    response = model.generate_content(PROMPT)
    result = response.text
    
    logging.info(f"Generated content: {result}")
    if result:
        return jsonify({"result": result}), 200
    else:
        abort(500, description="Failed to generate content")

@api_bp.route('/searchtranscripts', methods=['GET'])
def search_transcripts():
    '''
    input:
    {
        'search_terms': ["vitamin", "whey"]
    }
    '''
    # ensure the search_terms field is in the request
    data = request.get_json()
    if not all(key in data for key in ['search_terms']):
        abort(400, description="Missing data in request payload")
    
    search_terms = data['search_terms']
    
    
    url: str = os.environ.get("SUPABASE_URL")
    key: str = os.environ.get("SUPABASE_KEY")
    supabase: Client = create_client(url, key)
    # Query to find transcripts containing the word 'vitamin'
    query_result = []
    for term in data['search_terms']:
        query = f"select * from transcripts where text like '%{term}%';"
        result_data = supabase.table("transcripts").execute_sql(query)
        if result_data.error:
            return jsonify({"error": str(data.error)}), 500
        
        query_result.append(result_data.data)

    logging.info(f"Query result: {query_result}")

    return jsonify(data.data), 200