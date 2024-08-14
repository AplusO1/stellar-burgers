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
    cy.get('[data-cy=burger-constructor]').should('exist');

    // Проверка отсутствия булок в конструкторе перед добавлением
    cy.get('[data-cy=burger-constructor]').should(
      'not.contain',
      'Краторная булка N-200i (верх)'
    );
    cy.get('[data-cy=burger-constructor]').should(
      'not.contain',
      'Краторная булка N-200i (низ)'
    );

    // Проверка присутствия кнопки "Добавить"
    cy.contains('Добавить').should('exist').click();

    // Проверка присутствия булок в конструкторе после добавления
    cy.get('[data-cy=bun-top]').should('exist');
    cy.get('[data-cy=bun-bottom]').should('exist');
    cy.get('[data-cy=bun-top]').contains('Краторная булка N-200i (верх)');
    cy.get('[data-cy=bun-bottom]').contains('Краторная булка N-200i (низ)');

    // Проверка отсутствия ингредиентов в конструкторе перед добавлением
    cy.get('[data-cy=burger-constructor]').should(
      'not.contain',
      'Биокотлета из марсианской Магнолии'
    );
    cy.get('[data-cy=burger-constructor]').should(
      'not.contain',
      'Мясо бессмертных моллюсков Protostomia'
    );
    cy.get('[data-cy=burger-constructor]').should(
      'not.contain',
      'Хрустящие минеральные кольца'
    );
    cy.get('[data-cy=burger-constructor]').should(
      'not.contain',
      'Соус Spicy-X'
    );

    // Добавление "Биокотлета из марсианской Магнолии"
    cy.contains('Биокотлета из марсианской Магнолии')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Добавление "Мясо бессмертных моллюсков Protostomia"
    cy.contains('Мясо бессмертных моллюсков Protostomia')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Добавление "Хрустящие минеральные кольца"
    cy.contains('Хрустящие минеральные кольца')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Добавление "Соус Spicy-X"
    cy.contains('Соус Spicy-X')
      .parent()
      .find('button')
      .contains('Добавить')
      .click();

    // Проверка наличия всех добавленных ингредиентов в конструкторе
    cy.get('[data-cy=burger-constructor]').within(() => {
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
    cy.get('[data-cy=modal]').should('be.visible');

    // Проверка закрытия модального окна по клику на крестик
    cy.get('[data-cy=modal-close-button]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    // Повторное открытие модального окна для проверки закрытия по клику на оверлей
    cy.contains('Биокотлета из марсианской Магнолии').click();
    cy.get('[data-cy=modal]').should('be.visible');

    // Проверка закрытия модального окна по клику на оверлей
    // force: true требуется, если оверлей перекрыт модальным окном
    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('должен обрабатывать авторизацию пользователя и создание заказа', () => {
    // Посещаем страницу логина и ждем загрузки моковых данных
    cy.setCookie('accessToken', 'mock-access-token');
    cy.setCookie('refreshToken', 'mock-refresh-token');
    cy.visit('/login');
    cy.wait(['@getUserAuth', '@getIngredients']);

    // Проверка авторизации
    cy.get('[data-cy=username]').should('contain', 'Alex1');

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
    cy.get('[data-cy=burger-constructor]').within(() => {
      cy.contains('Краторная булка N-200i').should('exist');
      cy.contains('Филе Люминесцентного тетраодонтимформа').should('exist');
      cy.contains('Соус Spicy-X').should('exist');
      cy.contains('Мини-салат Экзо-Плантаго').should('exist');
      cy.contains('Сыр с астероидной плесенью').should('exist');
    });

    // Клик по кнопке "Оформить заказ"
    cy.get('button').contains('Оформить заказ').click();

    // Проверка, что модальное окно открылось и номер заказа верный
    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=order-number]').should('contain', '47777');

    // Закрытие модального окна и проверка успешности закрытия
    cy.get('[data-cy=modal-close-button]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    // Проверка, что конструктор пуст
    cy.get('[data-cy=burger-constructor]').within(() => {
      cy.contains('Краторная булка N-200i').should('not.exist');
      cy.contains('Филе Люминесцентного тетраодонтимформа').should('not.exist');
      cy.contains('Соус Spicy-X').should('not.exist');
      cy.contains('Мини-салат Экзо-Плантаго').should('not.exist');
      cy.contains('Сыр с астероидной плесенью').should('not.exist');
    });
  });
});
