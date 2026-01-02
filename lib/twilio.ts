import twilio from "twilio";

/**
 * Twilio Configuration
 * Pure utility functions for Twilio Video integration
 * No auth or database logic - just Twilio SDK operations
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_API_KEY_SID = process.env.TWILIO_API_KEY_SID;
const TWILIO_API_KEY_SECRET = process.env.TWILIO_API_KEY_SECRET;

// Validate environment variables
function validateTwilioConfig() {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_API_KEY_SID || !TWILIO_API_KEY_SECRET) {
    throw new Error(
      "Missing Twilio credentials. Please set TWILIO_ACCOUNT_SID, TWILIO_API_KEY_SID, and TWILIO_API_KEY_SECRET in .env.local"
    );
  }
}

/**
 * Get or create Twilio client instance
 */
export function getTwilioClient() {
  validateTwilioConfig();
  return twilio(TWILIO_API_KEY_SID!, TWILIO_API_KEY_SECRET!, {
    accountSid: TWILIO_ACCOUNT_SID,
  });
}

/**
 * Generate a Twilio Video access token
 * @param identity - Unique identifier for the participant (e.g., "doctor_123" or "patient_456")
 * @param roomName - Name of the video room to join
 * @returns JWT token string valid for 1 hour
 */
export function generateVideoToken(params: {
  identity: string;
  roomName: string;
}): string {
  validateTwilioConfig();

  const { identity, roomName } = params;

  // Create Access Token
  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;

  // Create a Video Grant for this specific room
  const videoGrant = new VideoGrant({
    room: roomName,
  });

  // Create an Access Token
  const token = new AccessToken(
    TWILIO_ACCOUNT_SID!,
    TWILIO_API_KEY_SID!,
    TWILIO_API_KEY_SECRET!,
    {
      identity,
      ttl: 3600, // Token valid for 1 hour
    }
  );

  // Add the Video Grant to the token
  token.addGrant(videoGrant);

  // Serialize the token to a JWT string
  return token.toJwt();
}

/**
 * Create a new Twilio Video room
 * @param roomName - Unique name for the room
 * @param type - 'group' (standard group room - required for accounts created after Oct 2024)
 * @returns Room object with sid, name, status, etc.
 */
export async function createTwilioRoom(
  roomName: string,
  type: "group" = "group"
) {
  const client = getTwilioClient();

  console.log("=== TWILIO ROOM CREATION DEBUG ===");
  console.log("Room Name:", roomName);
  console.log("Room Type:", type);
  console.log("Type of type:", typeof type);
  console.log("===================================");

  try {
    const room = await client.video.v1.rooms.create({
      uniqueName: roomName,
      type: type,
      statusCallback: undefined, // No webhooks for now
      maxParticipants: 2, // Doctor + Patient only
    });

    return {
      sid: room.sid,
      name: room.uniqueName,
      status: room.status,
      type: room.type,
      duration: room.duration,
      createdAt: room.dateCreated,
    };
  } catch (error: any) {
    // Room might already exist
    if (error.code === 53113) {
      // Room with this name already exists, fetch it
      const existingRoom = await client.video.v1.rooms(roomName).fetch();
      return {
        sid: existingRoom.sid,
        name: existingRoom.uniqueName,
        status: existingRoom.status,
        type: existingRoom.type,
        duration: existingRoom.duration,
        createdAt: existingRoom.dateCreated,
      };
    }
    throw error;
  }
}

/**
 * Get a Twilio Video room by SID
 * @param roomSid - Twilio Room SID
 * @returns Room details
 */
export async function getTwilioRoom(roomSid: string) {
  const client = getTwilioClient();

  const room = await client.video.v1.rooms(roomSid).fetch();

  return {
    sid: room.sid,
    name: room.uniqueName,
    status: room.status,
    type: room.type,
    duration: room.duration,
    createdAt: room.dateCreated,
    endTime: room.endTime,
  };
}

/**
 * Complete (end) a Twilio Video room
 * @param roomSid - Twilio Room SID
 * @returns Updated room status
 */
export async function completeTwilioRoom(roomSid: string) {
  const client = getTwilioClient();

  try {
    const room = await client.video.v1.rooms(roomSid).update({
      status: "completed",
    });

    return {
      sid: room.sid,
      name: room.uniqueName,
      status: room.status,
      duration: room.duration,
      endTime: room.endTime,
    };
  } catch (error: any) {
    // Room might already be completed or doesn't exist
    console.error("Error completing Twilio room:", error);
    throw error;
  }
}

/**
 * Get list of participants in a room
 * @param roomSid - Twilio Room SID
 * @returns Array of participants
 */
export async function getRoomParticipants(roomSid: string) {
  const client = getTwilioClient();

  const participants = await client.video.v1
    .rooms(roomSid)
    .participants.list();

  return participants.map((p) => ({
    sid: p.sid,
    identity: p.identity,
    status: p.status,
    startTime: p.startTime,
    endTime: p.endTime,
    duration: p.duration,
  }));
}
