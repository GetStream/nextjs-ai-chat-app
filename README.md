![nextjs-chat-template-cover](https://github.com/GetStream/nextjs-chat-template/assets/12433593/8080611f-6145-47aa-b0bc-11b838b13264)

# ai-chat-nextjs

This repository is intended as a started template for the [Next.js template page](https://vercel.com/templates).

The following can be understood as the content that should go on the template page.

## Overview

Use this example to have a fully functional chat app up and deployed on Vercel in no time.

Stream offers a powerful, real-time, and highly reliable chat messaging infrastructure. Combined with feature-rich SDKs and plenty of ready-to-use, pre-built components it allows you to integrate chat into your app in hours, not weeks.

When finishing the setup, you'll have a functional chat application built, ready to be customized for your use case.

## Features

- Next.js App Router
- Styling with [TailwindCSS](https://tailwindcss.com)
- Chat integration with [Stream Chat React](https://getstream.io/chat/docs/sdk/react/)

## Getting started

Follow these steps to get the project up and running for you.

### Step 1: Create an account on the Stream Dashboard

Head over to the [Stream Dashboard](https://dashboard.getstream.io/) and create an account.

### Step 2: Set up a new project with your Stream account

Create a new project to build up your application (all handled and managed by Stream).

This is necessary because you need two properties from this.

1. Your API key
2. Your Secret

See the red rectangle in the screenshot below on where you can retrieve this information from the Dashboard.

<img width="1511" alt="stream-apikey-and-secret" src="https://github.com/GetStream/nextjs-chat-template/assets/12433593/40201ab8-4c55-426d-94bc-e89649849ffc">

### Step 3: Create a `.env.local` file

Create this file at the root of the project and add both the API key and the secret. A template file (`.env.template`) is available to see and make sure you follow the correct naming conventions.

### Step 4: Insert a user ID and name

Inside of `app/page.tsx` you will need to update the values of `userId` and `userName` to be real values instead of `undefined`.

If you forget to do this, your app will show an error, displaying what you have missed.

### Step 5: Run the app

You're ready to run the app with the command:

```
yarn dev
```

## Find more resources to enhance and further customize the Stream SDK

- [React Docs](https://getstream.io/chat/docs/sdk/react/)
- [Basic Theming](https://getstream.io/chat/docs/sdk/react/theming/themingv2/)
- [Customization of components](https://getstream.io/chat/docs/sdk/react/guides/customization/)
- Stream also has an [Audio & Video SDK](https://getstream.io/video/docs/) that blends in nicely with the Chat SDK.
