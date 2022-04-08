import { aliasMutation } from "cypress/utils/graphql-test-utils";

Cypress.Commands.add("getTestId", (value) => {
  return cy.get(`[data-testid='${value}']`);
});

Cypress.Commands.add("login", ({ email, password }) => {
  cy.getTestId("email").type(email);
  cy.getTestId("password").type(password);
  cy.getTestId("loginBtn").click();
  cy.wait("@getSession");
  cy.url().then(($url) => {
    if ($url.includes("home")) {
      cy.getTestId("dismissIntro").click();
    }
  });
});

Cypress.Commands.add("setContent", ({ title, content }) => {
  if (!title && !content) return;
  cy.window().should("have.property", "tinymce");
  if (title) {
    cy.getTestId("postTitleInput").type(`${title}{enter}`).tab();
    cy.wait("@updatePostMutation");
  }
  if (content) {
    cy.window().then((win) => {
      //@ts-ignore
      win.tinymce.activeEditor.setContent(content);
    });
  }
});

Cypress.Commands.add("openSettings", () => {
  cy.getTestId("postMenuBtn").trigger("click");
  cy.getTestId("postSettingsLink").trigger("click");
});

Cypress.Commands.add("enterTags", (tags) => {
  tags.forEach((tag) => {
    cy.get(".react-tags__search-input").type(`${tag}{enter}`);
  });
});

Cypress.Commands.add("visitLogin", () => cy.visit("/login"));
Cypress.Commands.add("visitHome", () => cy.visit("/home"));
Cypress.Commands.add("visitPosts", () => cy.visit("/posts"));
Cypress.Commands.add("visitPages", () => cy.visit("/pages"));
Cypress.Commands.add("visitProfile", () => cy.visit("/profile"));
Cypress.Commands.add("visitSettings", () => cy.visit("/settings"));

Cypress.Commands.add("addNavItem", (label, text) => {
  cy.getTestId("empty-label-item").type(label);
  cy.get(`.ant-select-selector .ant-select-selection-search input`)
    .last()
    .invoke("attr", "id")
    .then(() => {
      cy.get(`.ant-select-selector .ant-select-selection-search input`)
        .last()
        .type(`${text}`, { force: true });
      cy.getTestId(text).click();
      cy.wait("@UpdateOptionsMutation");
    });
});

// Cypress.Commands.add("addUnplsashImage", (imageInputTestId) => {
//   cy.getTestId(imageInputTestId).then((ele) => {
//     if (ele.has('[title="Remove file"]')) {
//       ele.find('[title="Remove file"]').trigger("click");
//     }
//     ele.find(".ant-upload").trigger("click");
//   });
// });

beforeEach(function () {
  cy.visitLogin();
  cy.intercept("POST", "http://localhost:3000/admin/api/graphql", (req) => {
    aliasMutation(req, "updatePost");
    aliasMutation(req, "UpdateOptions");
    aliasMutation(req, "UpdateAuthor");
  });
  cy.intercept("/admin/api/auth/session").as("getSession");
  window.localStorage.setItem("intro_dismissed", "true");
  cy.login({ email: "demo@demo.com", password: "demo" });
});

afterEach(function () {
  cy.clearCookies();
  cy.clearLocalStorage();
});

const asModule = {};
export default asModule;