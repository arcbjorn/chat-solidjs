import { Component, createResource, createSignal, For } from "solid-js";
import { createClient } from "@urql/core";

import styles from "./App.module.css";

const client = createClient({
  url: "http://localhost:4000",
});

const [todos, { refetch }] = createResource(() => {
  client
    .query(
      `
      query {
        id
        done
        text
      }`
    )
    .toPromise()
    .then(({ data }) => data.getTodos);
});

const App: Component = () => {
  const [text, setText] = createSignal("");
  const onAdd = async () => {
    await client
      .mutation(
        `
      mutation($text: String!) {
        addTodo(text: $text) {
          id
        }
      }
    `,
        {
          text: text(),
        }
      )
      .toPromise();
    refetch();
    setText("");
  };

  const toggle = async (id: string) => {
    await client
      .mutation(
        `
        mutation($id: ID!, $done: Boolean!) {
          setDone(id: $id, done: $done) {
            id
          }
        }
      `,
        {
          id,
          done: !todos().find((todo) => todo.id === id),
        }
      )
      .toPromise();
    refetch();
  };

  return (
    <div>
      <For each={todos()}>
        {({ id, done, text }) => (
          <div>
            <input type="checkbox" checked={done} onclick={toggle(id)} />
            <span>{text}</span>
          </div>
        )}
      </For>
      <div>
        <input
          type="text"
          value={text()}
          oninput={(event) => setText(event.currentTarget.value)}
        />
      </div>
      <button onclick={onAdd}>Add</button>
    </div>
  );
};

export default App;
