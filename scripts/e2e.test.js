console.log('e2e тестування....')

describe("Головна сторінка", () => {
    it("Повинна відкрити головну сторінку", () => {
        cy.visit("http://localhost:3000");
        cy.contains("Ласкаво просимо").should("be.visible");
    });

    it("Повинна перейти на сторінку ігри", () => {
        cy.get("a[href='/play']").click();
        cy.url().should("include", "/login");
    });
});