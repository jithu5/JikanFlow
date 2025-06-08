# TwoFlow – Live Talk & Shared Notes with Recording

TwoFlow is a web application designed for live discussions and collaborative note-taking. It allows users to create rooms where they can engage in real-time conversations, share notes, and record their sessions for later reference.

## Planning and Design

### Tools and Tecnologies

- **ServiceType**: Microservice

- **Frontend**: Next.js, Tailwind CSS, Socket.IO, Quilljs, WebRTC, Typescript
- **Backend**: Express.js, Socket.IO, Spring Boot
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Requests**: RESTFUL API, GRPC
- **Deployment**: Docker, AWS

### WorkFlow

### High-Level Architecture

1. **Authentication**: Users register/login using JWT for secure access.
2. **Room Management**: Each room supports two users with a unique ID.
3. **Live Communication**: Real-time video/audio via WebRTC and Socket.IO.
4. **Collaborative Notes**: Both users share and edit notes live with Quill.js.
5. **Recording**: Sessions can be recorded and stored for later viewing.
6. **Storage**: Notes and recordings are stored in PostgreSQL and cloud storage.

### Low-Level Architecture

**Video Service**: Handles video recording

- Frontend sends an HTTP request to the main server for user validation, and if the validation is successful, the main server will send a  GRPC request to the video service to start recording.
- The video is recorded and sends as small chunks to the video service for storing in cloud storage.
- The video service will send a response to the main server with the video URL and success message with GRPC.
- The main server will send a response to the frontend with the video URL and success message.

**Note Service**: Handles note creation and sharing

- Frontend sends an HTTP request to the main server for user validation, and if the validation is successful(Only for both users validation are successfull), the main server will send a GRPC request to the note service to create a new note.
- The note service will create the note and send a response back to the main server with the note ID and success message.
- The users can then edit the note in real-time using Quill.js and updated on database through note service.
- The main server will send a response to the frontend with the note ID and success message.

## Here’s what I need to do before starting programming

### Define your MVP scope clearly

- **Pick the absolute essential features first — e.g.,**

1. User auth & room creation

2. Real-time talk + basic note collaboration

3. Simple recording start/stop with storage

- This keeps initial work focused and manageable.

### Sketch a simple API contract / gRPC proto files

- **Define the inputs/outputs your services will use. This will avoid guesswork later.**

### Set up your dev environment and project structure

- **Get Next.js + Express + Spring Boot repos ready and connected.**

### Plan basic data models

- **E.g., User, Room, Note, Recording — with minimal fields to start.**

### Design a minimal UI flow

- **Rough wireframes or a checklist for frontend pages/components.**
