import React, {
  useState,
  unstable_useTransition,
  Suspense,
  unstable_SuspenseList as SuspenseList,
  unstable_useDeferredValue
} from "react";

import {Resource} from "./02UseTransition";
import {fetchProfileData} from "../stubs/fakeApi";

function getNextId(id: number) {
  return id === 3 ? 0 : id + 1;
}

const initialResource = fetchProfileData(0, 2000 * Math.random(), 4000, 1000);

export function Four() {
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
        <h2>SuspenseList</h2>
        <ul>
          <li>
            <b>SuspenseList</b> to komponent pozwalający na wygodne ustalenia kolejności pokazywania załadowanych
            elementów
          </li>
          <li>
            prop <b>revealOrder</b> wskazuje, czy Suspense'y będące dziećmi SuspenseList powinny być pokazywane w
            kolejności: forwards, backwards albo together
          </li>
          <li>
            prop <b>tail</b> kontroluje ile fallbacków możemy widzieć naraz, tail="collapsed" oznacza że będziemy
            widzieć maksymalnie jeden
          </li>
        </ul>
      </div>

      <Suspense fallback={<h1>Loading...</h1>}>
        <ProfilePage resource={initialResource}/>
      </Suspense>
    </>
  );
}

function ProfilePage({resource}: { resource: Resource }) {
  return (
    <SuspenseList revealOrder="forwards">
      <Suspense
        fallback={<h2>Fastest - Loading profile details...</h2>}
      >
        <ProfileDetails resource={resource}/>
      </Suspense>

      <Suspense
        fallback={<h2>Slowest - Loading posts...</h2>}
      >
        <ProfileTimeline resource={resource}/>
      </Suspense>

      <Suspense
        fallback={<h2>Loading fun facts...</h2>}
      >
        <ProfileTrivia resource={resource}/>
      </Suspense>
    </SuspenseList>
  );
}

function ProfileDetails({resource}: { resource: Resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({resource}: { resource: Resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}

function ProfileTrivia({resource}: { resource: Resource }) {
  const trivia = resource.trivia.read();
  return (
    <>
      <h2>Fun Facts</h2>
      <ul>
        {trivia.map(fact => (
          <li key={fact.id}>{fact.text}</li>
        ))}
      </ul>
    </>
  );
}
