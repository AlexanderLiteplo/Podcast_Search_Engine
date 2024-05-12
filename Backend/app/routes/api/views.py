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
    Endpoint to search transcripts by terms.
    '''
    search_terms = request.args.getlist('search_terms')  # assuming multiple terms can be passed as list
    logging.info(f"Search terms: {search_terms}")

    url: str = "https://qdebnruvfqxnkpldyaha.supabase.co"
    key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZWJucnV2ZnF4bmtwbGR5YWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0ODA0NDQsImV4cCI6MjAzMTA1NjQ0NH0.GMoI3J_CoUHgmrYowNQu_IyuPCnxGcM2iJwBaP6TRlQ"
    supabase = create_client(url, key)

    query_result = []
    for term in search_terms:
        try:
            # Using the select method with a filter
            # select all columns from the 'transcripts' table where the 'text' column contains the search term  
            # result = supabase.table('transcripts').select().filter('text', 'ilike', f'%{term}%').execute()
            
            # do a sanity check to see if the transcripts table exists
            #return the first 5 rows
            result = supabase.table("transcripts").select("*").execute()

            query_result.append(result.data)
            
            logging.info(f"Query result for term '{term}': {result.data}")
        except Exception as e:
            logging.error(f"Error querying the database: {e}")
            abort(500, description="Failed to query the database")

    logging.info(f"Query result: {query_result}")
    return jsonify(query_result), 200