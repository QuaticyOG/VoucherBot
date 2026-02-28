# Private Vouch Bot

⚠️ **Notice:** This project is for my personal use only.

This Discord bot handles moderated vouch submissions. Users can submit a vouch with proof, which is then reviewed by moderators before being publicly posted.

---

## ✨ Features

* `/vouch` slash command
* Users submit text + screenshot
* Sent to private mod review channel
* Approve / Deny buttons for moderators
* Approved vouches posted publicly
* Denied vouches are deleted
* Designed for Railway deployment

---

## 🔒 Usage Notice

This repository and code are intended **solely for my own server and personal use**.

**You may not:**

* redistribute this bot
* resell this bot
* claim this bot as your own
* deploy it commercially

If you want similar functionality, create your own implementation.

---

## 🚀 Deployment (Railway)

1. Deploy from GitHub
2. Add required environment variables in Railway
3. Start command:

```
npm start
```

---

## 🔑 Required Environment Variables

```
TOKEN=
CLIENT_ID=
GUILD_ID=
REVIEW_CHANNEL=
APPROVED_CHANNEL=
MOD_ROLE_ID=
```

---

## 🛠️ Tech Stack

* Node.js
* discord.js v14
* Railway hosting

---

## 📌 Disclaimer

This bot is provided **as-is** for private usage. No support or guarantees are provided.

---

**Owner:** YourNameHere
