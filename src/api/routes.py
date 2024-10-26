from flask import Flask, request, jsonify, url_for, Blueprint, redirect, session, current_app
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import os
from urllib.parse import urlencode

from .googlemeet import meet_service

api = Blueprint('api', __name__)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend"
    }
    return jsonify(response_body), 200

@api.route('/meet/auth', methods=['GET'])
def start_oauth():
    try:
        auth_url = meet_service.get_oauth_url()
        return jsonify({'authUrl': auth_url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/meet/oauth-callback', methods=['GET'])
def oauth_callback():
    code = request.args.get('code')
    if not code:
        frontend_url = os.getenv('FRONTEND_URL')
        error_params = urlencode({'error': 'No authorization code received'})
        return redirect(f"{frontend_url}?{error_params}")

    try:
        credentials = meet_service.handle_oauth_callback(code)
        # Save credentials in session or database if needed
        
        # Redirect to frontend with success parameter
        frontend_url = os.getenv('FRONTEND_URL')
        success_params = urlencode({'auth': 'success'})
        return redirect(f"{frontend_url}?{success_params}")
    except Exception as e:
        frontend_url = os.getenv('FRONTEND_URL')
        error_params = urlencode({'error': str(e)})
        return redirect(f"{frontend_url}?{error_params}")

@api.route('/meet/create-meeting', methods=['POST'])
def create_meeting():
    try:
        meeting_data = meet_service.create_meeting()
        return jsonify(meeting_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Add a new endpoint to fetch meetings
@api.route('/meet/meetings', methods=['GET'])
def get_meetings():
    try:
        meetings = meet_service.get_meetings()  # You'll need to implement this in your meet_service
        return jsonify(meetings)
    except Exception as e:
        return jsonify({'error': str(e)}), 500