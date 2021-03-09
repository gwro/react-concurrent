import React, {
  useState,
  unstable_useTransition,
  Suspense,
  unstable_useDeferredValue
} from "react";

import {Resource} from "./02UseTransition";
import {fetchProfileData} from "../stubs/fakeApi";

function getNextId(id: number) {
  return id === 3 ? 0 : id + 1;
}

const initialResource = fetchProfileData(0, 2000 * Math.random(), 4000);

export function Three() {
  const [resource, setResource] = useState(
    initialResource
  );
  const [
    startTransition,
    isPending
  ] = unstable_useTransition();
  return (
    <>
      <div style={{marginBottom: "100px"}}>
        <h2>useDeferredValue</h2>
        <ul>
          <li>
            hook <b>useDeferredValue</b> pozwala na wykorzystanie starej wartości do np. wyrenderowania komponentu, dla którego dane wciąż nie są gotowe
          </li>
        </ul>
      </div>

      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(
              resource.userId
            );
            setResource(
              fetchProfileData(nextUserId, 2000 * Math.random(), 4000)
            );
          });
        }}
      >
        Next
      </button>
      {isPending ? " Loading..." : null}
      <ProfilePage resource={resource} />
    </>
  );
}

function ProfilePage({ resource }: {resource: Resource}) {
  const deferredResource = unstable_useDeferredValue(
    resource,
  );
  return (
    <Suspense
      fallback={<h1>Loading profile...</h1>}
    >
      <ProfileDetails resource={resource} />
      <Suspense
        fallback={<h1>Loading posts...</h1>}
      >
        <ProfileTimeline
          resource={deferredResource}
          isStale={deferredResource !== resource}
        />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }: {resource: Resource}) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ isStale, resource }: {isStale: boolean; resource: Resource}) {
  const posts = resource.posts.read();
  return (
    <ul style={{ opacity: isStale ? 0.7 : 1 }}>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
