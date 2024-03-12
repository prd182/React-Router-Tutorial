import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";
// Outlet: sitio onde vao carregar as child routes e seus elementos
// Link: o mesmo que um href mas sem pedir um recarregar de pagina / NavLink para ser visualmente melhor a navegaçao
// useLoaderData: permite acesso aos dados carregados no loader
// Form: um form de React. Em vez de enviar um pedido ao server, envia para a route action pretendida
// useNavigation: neste caso, checks for loading e dá efeito de loading page
// useSubmit: neste caso, para que o Form seja submetido com cada letra nova que se escreve

import { getContacts, createContact } from "../contacts";
import { useEffect } from "react";

export async function action() {
  // action para criar um contacto, function importada
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`); // redirect para a edit page
}

export async function loader({ request }) {
  // vai pre-carregar os dados seleccionados (contacts)
  const url = new URL(request.url); // novo url com o request
  const q = url.searchParams.get("q"); // search for "q"
  const contacts = await getContacts(q); // function getContacts() importada do ficheiro dos contactos
  return { contacts, q }; // retorna tbm o search param
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching = // para o spinner aparecer
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  // <nav/>: Para cada contacto existente (length), criar dinamicamente uma lista com a informaçao desse contacto
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q} // refresh page, value still shows
              onChange={(event) => {
                const isFirstSearch = q == null; // checks for first search
                submit(event.currentTarget.form, {
                  // update currentTarget (DOM node onde está o evento) with every letter / currentTarget.form é o parent form node
                  replace: !isFirstSearch, // if not, replaces history placement with new search
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No Contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
