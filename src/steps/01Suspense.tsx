import React, {Suspense} from "react";

import {fetchProfileData} from "../stubs/fakeApi";

const resource = fetchProfileData(0,1000, 2000); // 1 -- pobieranie rozpoczyna się przed renderowaniem komponentu

const ProfileDetails = () => {
  // sprobuj odczytac informacje o uzytkowniku, chociaz mogly sie jeszcze nie zaladowac
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

const ProfileTimeline = () => {
  // sprobuj odczytac posty, chociaz mogly sie jeszcze nie zaladowac
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}

export const One = () => {
  return (
    <>
      <Suspense
        fallback={<h1>Ładowanie profilu</h1>}
      >
        {/* 2 -- komponent ProfileDetails wyświetli się dopiero w momencie gotowości danych */}
        <ProfileDetails/>

        {/* 3 -- informacja o ładowaniu postów pojawi się dopiero wtedy, gdy załadują się dane dla ProfileDetails (wcześniej będzie widoczny fallback),
                 ale dane będą się pobierać już wcześniej */}
        <Suspense
          fallback={<h1>Ładowanie postów</h1>}
        >
          <ProfileTimeline/>
        </Suspense>
      </Suspense>

      <h2 style={{ marginTop: "100px" }}>Czym nie jest Suspense?</h2>
      <ul>
        <li>Nie implementuje pobierania danych. Nie zakłada wykorzystania jakiegoś konkretnego formatu, biblioteki lub protokołu.
        </li>
        <li>
          Nie pozwala na zastąpienie fetcha bez dodatkowych zmian.
        </li>
        <li>
          Nie łączy pobierania danych z warstwą widokową, pomaga jedynie zarządzać stanami ładowania w UI.
        </li>
      </ul>

      <h2>Na co pozwala Suspense (wg twórców Reacta)?</h2>
      <ul>
        <li>Pozwala na głęboką integrację z bibliotekami do techowania danych. Jeżeli biblioteka implementuje wsparcie
          dla Suspense, korzystanie z niej w Reactowych componentach jest bardzo naturalne.
        </li>
        <li>Pomaga walczyć z race condition - używając Suspense działamy na danych, jak gdyby były ładowane
          synchronicznie.
        </li>
      </ul>

      <h2>Suspense w praktyce</h2>
      <ul>
        <li>Relay to biblioteka Facebooka służąca do obsługi GraphQL, która obsługuje Suspense i została sprawdzona na
          produkcji.
        </li>
        <li>
          Suspense pod spodem
          <ul>
            <li>Suspense to wzorzec, który pozwala Reactowi na wstrzymywanie (ang. suspense) komponentów.</li>
            <li>Komponent zostaje "wstrzymany", gdy zamiast zwrócić JSX jak zwykle, rzuca promise jako wyjątek.</li>
            <li>Biblioteki do fetchowania obsługujące Suspense zawierają synchroniczne funkcje zwracające dane, które
              rzucają właśnie promise'ami w przypadku, gdy dane nie są jeszcze gotowe.
            </li>
            <li>Komponent Suspense wyłapuje takie (i tylko takie) wyjątki i renderuje <b>fallback</b> dopóki komponent
              nie może zostać wyrenderowany.
            </li>
            <li>Jeżeli nie da się pobrać danych, to rzucamy błędem, który łapiemy w Error Boundaries (komponenty klasowe
              ze statyczną metodą getDerivedStateFromError, która aktualizuje stan komponentu na wypadek błędu, aby np.
              wyświetlić komunikat o błędzie)
            </li>
          </ul>
        </li>
      </ul>

      <h2>Tradycyjne podejścia do pobierania danych vs Suspense</h2>
      <ul>
        <li><b>Fetch-on-render</b> (np. fetch użyte w useEffect): Rozpocznij renderowanie komponentów, każdy z
          komponentów może triggerować pobieranie danych w swoich efektach i metodach lifecycle (componentDidMount
          itd.); prowadzi to często do kaskadowości (pobieranie niektórych danych zaczyna się dopiero w momencie
          skończenia pobierania innych itd.)
        </li>
        <li><b>Fetch-then-render</b> Zacznij pobierać dane dla następnego ekranu tak wcześnie jak to możliwe. Kiedy dane
          zostaną pobrane, wyrenderuj nowy ekran. Nie możemy nic robić w trakcie oczekiwania na dane.
        </li>
        <li><b>Render-as-you-fetch</b> (np. Relay z Suspense): Rozpocznij pobieranie wszystkich wymaganych danych dla
          następnego ekranu tak wcześnie jak to możliwe i zacznij renderowanie nowego ekranu natychmiast - zanim
          uzyskamy jakąkolwiek odpowiedź. Gdy dane napływają, React próbuje renderować komponenty, które potrzebują
          danych, tak długo aż będą gotowe.
        </li>
      </ul>

      <h2>Istotne - pobieranie danych w Render-as-you-fetch powinno zawsze zaczynać się przed renderowaniem!</h2>
      <ul>
        <li>Rozwiązanie 1. Umieść początek pobierania danych w kodzie przed definicją komponentu - patrz komentarz 1.;
          nie zadziała, gdy pobierane dane mają zależeć od jakiegoś parametru
        </li>
        <li>Rozwiązanie 2. rozpocznij pobieranie danych w event handlerze np. przycisku przenoszącego na nowy ekran;
          dane zaczną się fetchować jeszcze przed pobraniem kodu strony!
        </li>
      </ul>

      <h2>Komentarz 2. i 3.</h2>
    </>
  );
}
