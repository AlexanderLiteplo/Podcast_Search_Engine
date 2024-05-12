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

# @api_bp.route('/searchtranscripts', methods=['GET'])
# def search_transcripts():
#     '''
#     Endpoint to search transcripts by terms.
#     '''
#     search_terms = request.args.get('search_terms')  # assuming multiple terms can be passed as list
#     logging.info(f"Search terms: {search_terms}")

#     url: str = "https://qdebnruvfqxnkpldyaha.supabase.co"
    
#     # key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZWJucnV2ZnF4bmtwbGR5YWhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTQ4MDQ0NCwiZXhwIjoyMDMxMDU2NDQ0fQ.bzJ8uEr7etBT1KC5WtPEaE0AKKVdUGGpyvdFXnscn2I"
#     key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZWJucnV2ZnF4bmtwbGR5YWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0ODA0NDQsImV4cCI6MjAzMTA1NjQ0NH0.GMoI3J_CoUHgmrYowNQu_IyuPCnxGcM2iJwBaP6TRlQ"
#     supabase = create_client(url, key)

#     query_result = []

#     try:
#         logging.info(f"Querying the database for term '{search_terms}'")

        
#         # result = supabase.table("transcripts").select("*").filter("text", "ilike", f"%{search_terms}%").execute()
        
#         # select rows where id is between 0 and 5 for sanity check
#         # result = supabase.table("transcripts").select("*").execute()
#         min_id = 0
#         max_id = 5
#         result = supabase.table("transcripts") \
#             .select("*") \
#             .filter("id", "gte", min_id) \
#             .filter("id", "lte", max_id) \
#             .execute()
#         # result = supabase.table("transcripts").select("*").limit(5).execute()

        
#         logging.info(f"Query result: {result}")
#         query_result.append(result.data)
    
#         rows_with_term = []
#         for row in result.data:
#             if search_terms in row['text']:
#                 rows_with_term.append(row)
#         logging.info(f"Rows with term: {rows_with_term}")
        
#     except Exception as e:
#         logging.error(f"Error querying the database: {e}")
#         abort(500, description="Failed to query the database")

#     return jsonify(rows_with_term), 200


@api_bp.route('/searchtranscripts', methods=['GET'])
def search_transcripts():
    '''
    Endpoint to search transcripts by search term.
    '''
    search_term = request.args.get('search_term')  # Get the search term from query parameters
    logging.info(f"Search term: {search_term}")

    url: str = "https://qdebnruvfqxnkpldyaha.supabase.co"
    key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZWJucnV2ZnF4bmtwbGR5YWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU0ODA0NDQsImV4cCI6MjAzMTA1NjQ0NH0.GMoI3J_CoUHgmrYowNQu_IyuPCnxGcM2iJwBaP6TRlQ"  # Ensure you replace this with your actual Supabase key
    supabase = create_client(url, key)

    query_result = []
    try:
        offset = 0
        batch_size = 5
        more_records = True

        # Loop through the database table in chunks of 5
        while more_records:
            result = supabase.table("transcripts") \
                .select("*") \
                .range(offset, offset + batch_size - 1) \
                .execute()

            # Check if any rows contain the search term
            filtered_rows = [row for row in result.data if search_term.lower() in row['text'].lower()]
            query_result.extend(filtered_rows)

            # Update the offset to get the next chunk
            offset += batch_size

            # Determine if there are more records to fetch
            more_records = len(result.data) == batch_size

        logging.info(f"Query results matching term '{search_term}': {query_result}")

    except Exception as e:
        logging.error(f"Error querying the database: {e}")
        abort(500, description=str(e))

    return jsonify(query_result), 200