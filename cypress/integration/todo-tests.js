/// <reference types="cypress" />
import dayjs from "dayjs";

context("Actions", () => {
  const dateString = "2020-03-13 12:00";
  const date = dayjs(dateString);
  const dayJsDate = dayjs(date).format("MMM D H:mm");

  beforeEach(() => {
    // Visit the webpage
  });

  it("adds a new todo by clicking button and the todo is appended to the list", () => {
    // Find the input field for new todo and type a description into it
    // Click the button to add the todo
    // Assert that the todo was added to the list
  });

  it("adds a new todo by pressing enter and the todo is appended to the list", () => {
    // Find the input field for new todo and type a description into it
    // Press enter to add the todo
    // Assert that the todo was added to the list
  });

  it("does not add a new todo if only a space is typed into the input field", () => {
    // Type an empty description into the input field
    // Click the button to add the todo
    // Assert that todo was not added
  });

  it("deletes a todo and the todo is deleted from the list", () => {
    // Get the first todo item and locate the button within it then click it
    // Assert that the item was removed
  });

  it("completes a todo and the todo is checked", () => {
    // Get the the last todo item, find the checkbox and click it
    // Assert that the checkbox is checked
  });

  it("adds a new todo with a deadline and the todo is appended to the list", () => {
    // Add new todo
    // Get the deadline input and save it as a variable
    // Get the saved input and click it
    // Find the OK button in the date-dialog
    // Trigger Mouseover on the date input to make the tooltip visible
    // Assert that the tooltip of the dateinput has correct value
    // Trigger Mouseleave on the date input to make the tooltip dissapear
    // Add the todo
    // Assert that the todo was added
    // Assert that the date is correct on the new todo-item
  });

  it("removes a todo after it's been completed for day", () => {
    // Setup the clock to overide the date
    // Get the the last todo item, find the checkbox and click it
    // Move the clock forward 24h + 100ms (86400100)
    // Assert that the item was removed
  });
});
