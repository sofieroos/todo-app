import { Server, Model, Response } from "miragejs";
import dayjs from "dayjs";

export function makeServer({ environment = "development" } = {}) {
  const server = new Server({
    environment,

    models: {
      todo: Model,
    },

    routes() {
      this.namespace = "api";

      this.get("/todos", (schema, request) => {
        return schema.todos.all();
      });

      this.get("/todos/:id", (schema, request) => {
        let id = request.params.id;
        return schema.todos.find(id);
      });

      this.post("/todos", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);

        return schema.todos.create(attrs);
      });

      this.patch("/todos/:id", (schema, request) => {
        let newAttrs = JSON.parse(request.requestBody);
        let id = request.params.id;
        let todo = schema.todos.find(id);

        if (todo) {
          return todo.update(newAttrs);
        } else {
          return new Response(
            400,
            { some: "header" },
            { errors: ["todo could not be found"] }
          );
        }
      });

      this.delete("/todos/:id", (schema, request) => {
        let id = request.params.id;

        return schema.todos.find(id).destroy();
      });
    },

    seeds(server) {
      const date = dayjs().add(1, "day");

      server.create("todo", {
        todo: "Make todo application",
        completed: null,
        deadline: null,
      });
      server.create("todo", {
        todo: "Construct Cypress introduction",
        completed: null,
        deadline: date,
      });
      server.create("todo", {
        todo: "Perform cypress workshop",
        deadline: null,
        completed: null,
      });
    },
  });
  return server;
}
