import React, {
  useState,
  unstable_useTransition,
  Suspense
} from "react";
import ReactDOM from "react-dom";
import {fetchProfileData} from "../stubs/fakeApi";

export type Resource = {
  user: {
    read(): {
      name: string;
    }
  }
  posts: {
    read(): {
      id: number;
      text: string;
    }[];
  }
}

const initialResource = fetchProfileData(0, 1000, 2000)

function getNextId(id: number) {
  return id === 3 ? 0 : id + 1;
}

export const Two = () => {
  const [resource, setResource] = useState(
    initialResource
  );
  const [
    startTransition,
    isPending
  ] = unstable_useTransition({
    // timeoutMs: 1000,
  });

  return (
    <>
      <div>
        <h2>useTransition</h2>
        <ul>
          <li>
            hook <b>useTransition</b> pozwala na opóźnianie przechodzenia na nowy widok do momentu jego wyrenderowania
          </li>
          <li>
            zwracana wartość boolean przekazuje informację, czy właśnie następuje tranzycja, co pozwala na np.
            zastosowanie spinnera
          </li>
          <li>
            dokumentacja wspomina parametr "timeoutMs", który pozwala ustawić maksymalny czas oczekiwania, ale nie
            jest on dostępny w obecnej wersji - uroki korzystania z ficzerów eksperymentalnych
          </li>
        </ul>
      </div>

      <div style={{marginTop: "100px"}}>
        <button
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              const nextUserId = getNextId(
                resource.userId
              );
              setResource(
                fetchProfileData(nextUserId, 1000, 5000)
              );
            });
          }}
        >
          Next
        </button>
        {isPending ? " Loading..." : null}
        <ProfilePage resource={resource}/>
      </div>
    </>
  );
}

function ProfilePage({resource}: { resource: Resource }) {
  return (
    <Suspense
      fallback={<h1>Loading profile...</h1>}
    >
      <ProfileDetails resource={resource}/>
      <Suspense
        fallback={<h1>Loading posts...</h1>}
      >
        <ProfileTimeline resource={resource}/>
      </Suspense>
    </Suspense>
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
