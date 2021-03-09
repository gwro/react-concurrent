import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import {fetchProfileData} from "../stubs/fakeApi";

const resource = fetchProfileData();

export const One = () => {
  return (
    <Suspense
      fallback={<h1>Loading profile...</h1>}
    >
      <ProfileDetails />
      <Suspense
        fallback={<h1>Loading posts...</h1>}
      >
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

const ProfileDetails = () => {
  // Try to read user info, although it might not have loaded yet
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

const ProfileTimeline = () => {
  // Try to read posts, although they might not have loaded yet
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
      <div>
        Czym nie jest Suspense?
        <p>It is not a data fetching implementation. It does not assume that you use GraphQL, REST, or any other particular data format, library, transport, or protocol.</p>
        <p>It is not a ready-to-use client. You can’t “replace” fetch or Relay with Suspense. But you can use a library that’s integrated with Suspense (for example, new Relay APIs).</p>
        <p>It does not couple data fetching to the view layer. It helps orchestrate displaying the loading states in your UI, but it doesn’t tie your network logic to React components.</p>
      </div>
      <div>
        Na co pozwala Suspense (wg twórców Reacta)?
        <p>It lets data fetching libraries deeply integrate with React. If a data fetching library implements Suspense support, using it from React components feels very natural.</p>
        <p>It lets you orchestrate intentionally designed loading states. It doesn’t say how the data is fetched, but it lets you closely control the visual loading sequence of your app.</p>
        <p>It helps you avoid race conditions. Even with await, asynchronous code is often error-prone. Suspense feels more like reading data synchronously — as if it were already loaded.</p>
      </div>
      <div>
        Suspense w praktyce
        <p>It lets data fetching libraries deeply integrate with React. If a data fetching library implements Suspense support, using it from React components feels very natural.</p>
        <p>It lets you orchestrate intentionally designed loading states. It doesn’t say how the data is fetched, but it lets you closely control the visual loading sequence of your app.</p>
        <p>It helps you avoid race conditions. Even with await, asynchronous code is often error-prone. Suspense feels more like reading data synchronously — as if it were already loaded.</p>
      </div>
    </ul>
  );
}
