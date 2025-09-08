### TODO
- Refactor code and extract reused components
- Allow guests in a room to add their own answer alternative
- Allow the host to create multiple rounds of questions
- Allow the host to broadcast a "whiteboard" to all guests in a room between rounds
- Sumarize results of a session
- Investigate Supabase integration for persistance and more stability on socket connects/disconnects

# Quizza

A simple little app hacked together over a weekend for asking a question, providing answer alternatives, and allowing others to vote on one alternative.

## Quizza uses
<span>
  <img alt="Vite" src="https://img.shields.io/badge/vite-000?style=for-the-badge&logo=vite" />
  <img alt="Preact" src="https://img.shields.io/badge/preact-000?style=for-the-badge&logo=preact" />
  <img alt="TypeScript" src="https://img.shields.io/badge/typescript-000?style=for-the-badge&logo=typescript" />
  <img alt="Express.js" src="https://img.shields.io/badge/express-000?style=for-the-badge&logo=express&logoColor=404D59" />
  <img alt="Node.js" src="https://img.shields.io/badge/node.js-000?style=for-the-badge&logo=nodedotjs" />
  <img alt="Socket.io" src="https://img.shields.io/badge/socket.io-000?style=for-the-badge&logo=socketdotio" />
  <img alt="Emotion" src="https://img.shields.io/badge/emotion-000?style=for-the-badge&logo=emotion" />
  <img alt="Eslint" src="https://img.shields.io/badge/eslint-000?style=for-the-badge&logo=eslint" />
  <img alt="Prettier" src="https://img.shields.io/badge/prettier-000?style=for-the-badge&logo=prettier" />
</span>

## Features

- Create a quiz with a question and multiple answer alternatives
- Share a room link for others to join and vote
- Real-time updates of votes and players
- Host can close the room at any time
