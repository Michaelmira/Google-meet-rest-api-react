const { SpacesServiceClient } = require('@google-cloud/meet').v2;
const { GoogleAuth } = require('google-auth-library');

class MeetService {
  constructor() {
    this.auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/meetings.space.created'],
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
    
    this.meetClient = new SpacesServiceClient({
      auth: this.auth
    });
  }

  async createMeetingSpace() {
    try {
      const request = {
        // You can add space configuration here
        space: {
          displayName: "New Meeting Space",
          // Add other configuration as needed
        }
      };

      const [response] = await this.meetClient.createSpace(request);
      return response;
    } catch (error) {
      console.error('Error creating meeting space:', error);
      throw error;
    }
  }

  async getMeetingSpace(spaceName) {
    try {
      const request = {
        name: spaceName
      };

      const [response] = await this.meetClient.getSpace(request);
      return response;
    } catch (error) {
      console.error('Error getting meeting space:', error);
      throw error;
    }
  }
}

module.exports = new MeetService();