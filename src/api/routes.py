from flask import Flask, request, jsonify, url_for, Blueprint, redirect, session
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
import os

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
        return jsonify({'error': 'No authorization code received'}), 400

    try:
        credentials = meet_service.handle_oauth_callback(code)
        return redirect('/') 
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/meet/create-meeting', methods=['POST'])
def create_meeting():
    try:
        meeting_data = meet_service.create_meeting()
        return jsonify(meeting_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500