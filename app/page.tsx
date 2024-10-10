'use client';

import { useCallback, useEffect, useState } from 'react';
import { User } from 'stream-chat';
import { LoadingIndicator } from 'stream-chat-react';
import MyChat from '@/components/MyChat';

type HomeState = {
  apiKey: string;
  user: User;
  token: string;
};

export default function Home() {
  const [homeState, setHomeState] = useState<HomeState | undefined>();
  const [error, setError] = useState<string | undefined>();

  // TODO: The userId and userName must be set for the code to run. Either dynamically after log-in or hardcoded
  const userId = "test-user";
  const userName = "Test User";

  const getUserToken = useCallback(async (userId: string, userName: string) => {
    const response = await fetch('/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId }),
    });

    const responseBody = await response.json();
    if (response.status !== 200) {
      setError(responseBody.message);
    }
    const token = responseBody.token;

    if (!token) {
      setError('No token found');
    }

    const user: User = {
      id: userId,
      name: userName,
      image: `https://getstream.io/random_png/?id=${userId}&name=${userName}`,
    };

    const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
    if (apiKey) {
      setHomeState({ apiKey: apiKey, user: user, token: token });
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setError('User id is not set.');
      return;
    }

    if (!userName) {
      setError('User name is not set.');
      return;
    }
    getUserToken(userId, userName);
  }, [userId, userName, getUserToken]);

  if (error) {
    return (
      <section className='bg-red-100 text-red-700 font-bold w-screen h-screen flex items-center justify-center'>
        <p>{error}</p>
      </section>
    );
  }

  if (homeState) {
    return <MyChat {...homeState} />;
  } else {
    <section className='w-screen h-screen flex items-center justify-center'>
      <LoadingIndicator />
    </section>;
  }
}
