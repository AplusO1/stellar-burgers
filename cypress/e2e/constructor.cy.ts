export const BURGER_CONSTRUCTOR = '[data-cy=burger-constructor]';
export const BUN_TOP = '[data-cy=bun-top]';
export const BUN_BOTTOM = '[data-cy=bun-bottom]';
export const MODAL = '[data-cy=modal]';
export const MODAL_CLOSE_BUTTON = '[data-cy=modal-close-button]';
export const MODAL_OVERLAY = '[data-cy=modal-overlay]';
export const ORDER_NUMBER = '[data-cy=order-number]';
export const USERNAME = '[data-cy=username]';

describe('burgerConstructor', () => {
  beforeEach(() => {
    // Загрузка моковых данных
    cy.fixture('ingredients.json').as('ingredientsData');
    cy.fixture('order.json').as('orderData');
    cy.fixture('user.json').as('userData');

    // Настройка запросов
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as(
      'getOrder'
    );
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as(
      'getUserAuth'
    );
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearAllCookies();
  });

  it('должен обрабатывать добавление булок и начинки', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    // Ожидание рендера компонента
    cy.get(BURGER_CONSTRUCTOR).should('exist');

    // Проверка отсутствия булок в конструкторе перед добавлением
    cy.get(BURGER_CONSTRUCTOR).should(
      'not.contain',
      'Краторная булка N-200i (верх)'
    );
    cy.get(BURGER_CONSTRUCTOR).should(
      'not.contain',
      'Краторная булка N-200i (низ)'
    );

    // Проверка присутствия кнопки "Добавить"
    cy.contains('Добавить').should('exist').click();

    // Проверка присутствия булок в конструкторе после добавления
    cy.get(BUN_TOP).should('exist');
    cy.get(BUN_BOTTOM).should('exist');
    cy.get(BUN_TOP).contains('Краторная булка N-200i (верх)');
    cy.get(BUN_BOTTOM).contains('Краторная булка N-200i (низ)');

    // Проверка отсутствия ингредиентов в конструкторе перед добавлением
    cy.get(BURGER_CONSTRUCTOR).should(
      'not.contain',
      'Биокотлета из марсианской Магнолии'
    );
    cy.get(BURGER_CONSTRUCTOR).should(
      'not.contain',
      'Мясо бессмертных моллюсков Protostomia'
    );
    cy.get(BURGER_CONSTRUCTOR).should(
      'not.contain',
      'Хрустящие минеральные кольца'
    );
    cy.get(BURGER_CONSTRUCTOR).should('not.contain', 'Соус Spicy-X');

    // Добавление ингредиентов
    cy.contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.contains('Мясо бессмертных моллюсков Protostomia')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.contains('Хрустящие минеральные кольца')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.contains('Соус Spicy-X')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверка наличия всех добавленных ингредиентов в конструкторе
    cy.get(BURGER_CONSTRUCTOR).within(() => {
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      cy.contains('Мясо бессмертных моллюсков Protostomia').should('exist');
      cy.contains('Хрустящие минеральные кольца').should('exist');
      cy.contains('Соус Spicy-X').should('exist');
    });
  });

  it('должен обрабатывать открытие и закрытие модальных окон', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    // Проверка открытия модального окна ингредиента
    cy.contains('Биокотлета из марсианской Магнолии').click();

    // Проверка, что модальное окно открылось
    cy.get(MODAL).should('be.visible');

    // Проверка закрытия модального окна по клику на крестик
    cy.get(MODAL_CLOSE_BUTTON).click();
    cy.get(MODAL).should('not.exist');

    // Повторное открытие модального окна для проверки закрытия по клику на оверлей
    cy.contains('Биокотлета из марсианской Магнолии').click();
    cy.get(MODAL).should('be.visible');

    // Проверка закрытия модального окна по клику на оверлей
    cy.get(MODAL_OVERLAY).click({ force: true });
    cy.get(MODAL).should('not.exist');
  });

  it('должен обрабатывать авторизацию пользователя и создание заказа', () => {
    // Посещаем страницу логина и ждем загрузки моковых данных
    cy.setCookie('accessToken', 'mock-access-token');
    cy.setCookie('refreshToken', 'mock-refresh-token');
    cy.visit('/login');
    cy.wait(['@getUserAuth', '@getIngredients']);

    // Проверка авторизации
    cy.get(USERNAME).should('contain', 'Alex1');

    // Сборка бургера
    cy.contains('Краторная булка N-200i')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.contains('Филе Люминесцентного тетраодонтимформа')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.contains('Соус Spicy-X')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.contains('Мини-салат Экзо-Плантаго')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();
    cy.contains('Сыр с астероидной плесенью')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверка наличия всех добавленных ингредиентов в конструкторе
    cy.get(BURGER_CONSTRUCTOR).within(() => {
      cy.contains('Краторная булка N-200i').should('exist');
      cy.contains('Филе Люминесцентного тетраодонтимформа').should('exist');
      cy.contains('Соус Spicy-X').should('exist');
      cy.contains('Мини-салат Экзо-Плантаго').should('exist');
      cy.contains('Сыр с астероидной плесенью').should('exist');
    });

    // Клик по кнопке "Оформить заказ"
    cy.get('button').contains('Оформить заказ').click();

    // Проверка, что модальное окно открылось и номер заказа верный
    cy.get(MODAL).should('be.visible');
    cy.get(ORDER_NUMBER).should('contain', '47777');

    // Закрытие модального окна и проверка успешности закрытия
    cy.get(MODAL_CLOSE_BUTTON).click();
    cy.get(MODAL).should('not.exist');

    // Проверка, что конструктор пуст
    cy.get(BURGER_CONSTRUCTOR).within(() => {
      cy.contains('Краторная булка N-200i').should('not.exist');
      cy.contains('Филе Люминесцентного тетраодонтимформа').should('not.exist');
      cy.contains('Соус Spicy-X').should('not.exist');
      cy.contains('Мини-салат Экзо-Плантаго').should('not.exist');
      cy.contains('Сыр с астероидной плесенью').should('not.exist');
    });
  });
});
