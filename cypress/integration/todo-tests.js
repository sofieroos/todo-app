/// <reference types="cypress" />
import dayjs from "dayjs";

context("Actions", () => {
  const dateString = "2020-03-13 12:00";
  const date = dayjs(dateString);

  const dayJsDate = dayjs(date).format("MMM D H:mm");

  beforeEach(() => {
    cy.clock(date.valueOf(), ["Date"]);

    // Visit the webpage https://docs.cypress.io/api/commands/visit.html#Syntax
    cy.visit("http://localhost:3000");
  });

  it("adds a new todo and the todo is appended to the list", () => {
    // Find the input field for new todo and type a description into it
    cy.get("#newTodo").type("Skriv test");
    // Click the button to add the todo
    cy.get("[data-testid=add-todo-btn]").click();
    // Assert that the todo was added to the list
    cy.contains("Skriv test").should("be.visible");
    cy.get("[data-cy=todoItem]").should("have.length", 4);
    cy.get("[data-cy=todoItem]").eq(3).should("contain", "Skriv test");
  });

  it("adds a new todo and the todo is appended to the list", () => {
    // Find the input field for new todo and type a description into it
    cy.get("#newTodo").type("Skriv test{enter}");
    // Click the button to add the todo

    // Assert that the todo was added to the list
    cy.contains("Skriv test").should("be.visible");
    cy.get("[data-cy=todoItem]").should("have.length", 4);
    cy.get("[data-cy=todoItem]").eq(3).should("contain", "Skriv test");
  });

  it("does not add a new todo if only a space is typed into the input field", () => {
    // Type an empty description into the input field
    // Click the button to add the todo
    // Assert that todo was not added

    const lengthBeforeAdd = 3;

    cy.get("#newTodo").type(" {enter}").wait(1000);

    cy.get("[data-cy=todoItem]").should("have.length", lengthBeforeAdd);
  });

  it("deletes a todo and the todo is deleted from the list", () => {
    // Get the first todo item and locate the button within it then click it
    // Assert that the item was removed
    cy.get("[data-cy=todoItem]").first().find("button").click();

    cy.get("[data-cy=todoItem]").should("have.length", 2);
    cy.get("[data-cy=todoItem]").should("not.contain", "Make todo application");
  });

  it("completes a todo and the todo is checked", () => {
    // Get the the last todo item, find the checkbox and click it
    cy.get("[data-cy=todoItem]").last().find("input").check();
    // Assert that the checkbox is checked
    cy.get("[data-cy=todoItem]").last().find("input").should("be.checked");
  });

  it("adds a new todo with a deadline and the todo is appended to the list", () => {
    // Add new todo
    cy.get("#newTodo").type("Skriv test");
    // Get the deadline input and save it as a variable
    cy.get("[data-testid=deadline-input]").as("timeButton");
    // Get the saved input and click it
    cy.get("@timeButton").click();
    // Find the OK button in the date-dialog
    cy.contains("OK").click();
    // Trigger Mouseover on the date input to make the tooltip visible
    cy.get("@timeButton").trigger("mouseover");
    // Assert that the tooltip of the dateinput has correct value
    cy.get("[role=tooltip]").should("contain", dateString);
    // Trigger Mouseleave on the date input to make the tooltip dissapear
    cy.get("@timeButton").trigger("mouseleave");
    // Add the todo
    cy.get("[data-testid=add-todo-btn]").click();
    // Assert that the todo was added
    cy.get("[data-cy=todoItem]").should("have.length", 4);
    cy.get("[data-cy=todoItem]").eq(3).should("contain", "Skriv test");
    // Assert that the date is correct on the new todo-item
    cy.get("[data-cy=todoItem]").eq(3).should("contain", dayJsDate);
  });

  it("removes a todo after it's been completed for day", () => {
    // Setup the clock to overide the date
    cy.get("[data-cy=todoItem]").last().find("input").click();
    // Get the the last todo item, find the checkbox and click it
    cy.tick(86400100);
    // Move the clock forward 24h + 100ms (86400100)
    cy.get("[data-cy=todoItem]", { timeout: 6400 }).should("have.length", 2);
    // Assert that the item was removed
  });
});
