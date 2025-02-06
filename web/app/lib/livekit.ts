import { Room, RoomEvent, RoomOptions } from "livekit-client"

let room: Room | null = null

export async function connectToRoom(url: string, token: string, options?: RoomOptions): Promise<Room> {
  if (room) {
    return room
  }

  room = new Room(options)
  
  await room.connect(url, token)
  
  room.on(RoomEvent.Disconnected, () => {
    room = null
  })

  return room
}

export async function disconnectFromRoom() {
  if (room) {
    await room.disconnect()
    room = null
  }
}

export function getRoom(): Room | null {
  return room
} 