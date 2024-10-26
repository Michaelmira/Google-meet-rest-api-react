import React, { useState } from 'react';

const MeetingComponent = () => {
  const [meetingInfo, setMeetingInfo] = useState({
    url: '',
    loading: false,
    error: ''
  });

  const startAuth = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/meet/auth`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error(data.error || 'Failed to start authentication');
      }
    } catch (error) {
      setMeetingInfo(prev => ({
        ...prev,
        error: error.message
      }));
    }
  };

  const createMeeting = async () => {
    try {
      setMeetingInfo(prev => ({ ...prev, loading: true, error: '' }));
      
      const response = await fetch(`${process.env.BACKEND_URL}/api/meet/create-meeting`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMeetingInfo(prev => ({
          ...prev,
          url: data.meetingUrl,
          loading: false
        }));
      } else {
        throw new Error(data.error || 'Failed to create meeting');
      }
    } catch (error) {
      setMeetingInfo(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
    }
  };

  return (
    <div className="text-center mt-5">
      <h2>Google Meet Integration</h2>
      
      {/* Auth button */}
      <button 
        className="btn btn-primary mb-3 me-3"
        onClick={startAuth}
      >
        Authenticate with Google
      </button>

      {/* Create meeting button */}
      <button 
        className="btn btn-success mb-3"
        onClick={createMeeting}
        disabled={meetingInfo.loading}
      >
        {meetingInfo.loading ? 'Creating Meeting...' : 'Create New Meeting'}
      </button>

      {/* Meeting URL */}
      {meetingInfo.url && (
        <div className="alert alert-success">
          <p>Your meeting has been created!</p>
          <a 
            href={meetingInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-success"
          >
            Join Meeting
          </a>
        </div>
      )}

      {/* Error message */}
      {meetingInfo.error && (
        <div className="alert alert-danger">
          {meetingInfo.error}
        </div>
      )}
    </div>
  );
};

export default MeetingComponent;