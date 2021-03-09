export function fetchProfileData(userId: number, userTime: number, postsTime: number): { userId: number; user: { read: () => { name: string } }, posts: { read: () => { id: number; text: string; }[] } } {
  let userPromise = fetchUser(userId, userTime);
  let postsPromise = fetchPosts(userId, postsTime);
  return {
    userId,
    user: wrapPromise(userPromise),
    posts: wrapPromise(postsPromise)
  };
}

// Suspense integrations like Relay implement
// a contract like this to integrate with React.
// Real implementations can be significantly more complex.
// Don't copy-paste this into your project!
function wrapPromise(promise: any) {
  let status = "pending";
  let result: any;
  let suspender = promise.then(
    // @ts-ignore
    r => {
      status = "success";
      result = r;
    },
    // @ts-ignore
    e => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}

function fetchUser(userId: number, timeoutTime: number) {
  console.log("fetch user...");
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("fetched user");
      switch (userId) {
        case 0:
          resolve({
            name: "Ringo Starr"
          });
          break;
        case 1:
          resolve({
            name: "George Harrison"
          });
          break;
        case 2:
          resolve({
            name: "John Lennon"
          });
          break;
        case 3:
          resolve({
            name: "Paul McCartney"
          });
          break;
        default:
          throw Error("Unknown user.");
      }
    }, timeoutTime);
  });
}

function fetchPosts(userId: number, timeoutTime: number) {
  console.log("fetch posts...");
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("fetched posts for " + userId);
      switch (userId) {
        case 0:
          resolve([
            {
              id: 0,
              text:
                "I get by with a little help from my friends"
            },
            {
              id: 1,
              text:
                "I'd like to be under the sea in an octupus's garden"
            },
            {
              id: 2,
              text:
                "You got that sand all over your feet"
            }
          ]);
          break;
        case 1:
          resolve([
            {
              id: 0,
              text:
                "Turn off your mind, relax, and float downstream"
            },
            {
              id: 1,
              text: "All things must pass"
            },
            {
              id: 2,
              text:
                "I look at the world and I notice it's turning"
            }
          ]);
          break;
        case 2:
          resolve([
            {
              id: 0,
              text:
                "Living is easy with eyes closed"
            },
            {
              id: 1,
              text:
                "Nothing's gonna change my world"
            },
            {
              id: 2,
              text: "I am the walrus"
            }
          ]);
          break;
        case 3:
          resolve([
            {
              id: 0,
              text: "Woke up, fell out of bed"
            },
            {
              id: 1,
              text: "Here, there, and everywhere"
            },
            {
              id: 2,
              text:
                "Two of us sending postcards, writing letters"
            }
          ]);
          break;
        default:
          throw Error("Unknown user.");
      }
    }, timeoutTime);
  });
}
