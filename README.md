# yet-another-todo-list

[Kanban Board](https://github.com/users/zloishavrin/projects/4/views/1)

## Содержание

[Требования к проекту](#требования-к-проекту)

[Запуск проекта в DEV-режиме](#запуск-проекта-в-dev-режиме)

[Запуск проекта в PROD-режиме](#запуск-проекта-в-prod-режиме)

## Требования к проекту

### Git

Разработка ведется с использованием GIT (система контроля версия) и GitHub (удаленный репозиторий).

Подробнее ветвление можно посмотреть [здесь](https://github.com/zloishavrin/yet-another-todo-list/network).

### Docker

Настроены два варианта развертывания платформы с помощью Docker - в DEV и PROD режимах.

Также настроен Docker Build Test с помощью GitHub Actions.

### IDE и отладка

На проекте используется VS Code для разработки. Для форматирования кода применяются Prettier и ESLint.

### Agile, Scrum, Kanban

Все задачи по проекту фиксируются здесь - [Kanban Board](https://github.com/users/zloishavrin/projects/4/views/1)

### ООП

На бэкэнде применяется архитектурный фреймворк NestJS для TypeScript, который завязан на ООП.

#### Инкапсуляция

Инкапсуляция в NestJS достигается за счет классов, методов и зависимостей, которые управляют своей логикой и данными, не раскрывая внутреннюю реализацию. Например:

Контроллер:
```typescript
export class ArticleController {
  constructor(private ArticleService: ArticleService) {}
}
```
* Контроллер инкапсулирует логику работы с HTTP-запросами. Вся бизнес-логика скрыта в ArticleService, а контроллер отвечает только за маршрутизацию и вызов соответствующих методов.
* Зависимость ArticleService инжектируется через конструктор, скрывая реализацию от контроллера.

Сервис:
```typescript
export class ArticleService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Article.name) private ArticleModel: Model<Article>,
  ) {}
}
```
* Сервис инкапсулирует бизнес-логику работы с данными (например, создание статьи). Внешний код не знает, как данные сохраняются в базе или как модели взаимодействуют друг с другом.

#### Абстракция

NestJS позволяет скрывать сложность реализации через использование интерфейсов, декораторов и зависимостей. Например:

Встроенный декоратор, в который передается класс AuthGuard с реализацией проверки аутентификации с помощью JWT-токенов:
```typescript
@UseGuards(AuthGuard)
```
* Абстрагирует проверку аутентификации. Контроллеру не нужно знать, как работает AuthGuard — он просто доверяет, что пользователь будет аутентифицирован.

Или валидация:
```typescript
@UsePipes(new ValidationPipe())
```
* Инкапсулирует валидацию данных запроса. Контроллеру не нужно заботиться о проверке каждого поля — это делается пайпом.

### Инверсия управления

Используется механизм dependency injection (DI), что является реализацией принципа инверсии управления (IoC). Это позволяет избегать жесткой привязки к конкретным реализациям классов и облегчает тестирование. Пример:
```typescript
constructor(private ArticleService: ArticleService) {}
```
* ArticleService инжектируется в контроллер автоматически благодаря DI контейнеру NestJS.
* Реализация ArticleService может быть легко заменена, например, на мок-объект для тестирования.

### Паттерны проектирования

#### Внедрение зависимостей

```typescript
@Controller('api/article')
export class ArticleController {
  constructor(private ArticleService: ArticleService) {}
}
```
* Контроллер получает ArticleService, который создается и управляется IoC-контейнером NestJS. Это упрощает тестирование и замену зависимостей.

#### Многослойная архитектура

Проект следует слоистой архитектуре, разделяя проект на контроллеры, сервисы и репозитории. Каждый слой выполняет строго определенную задачу:

* Контроллеры управляют HTTP-запросами.
* Сервисы содержат бизнес-логику.
* Репозитории работают с базой данных (используется ODM Mongoose).

#### Singletone

Все сервисы в NestJS по умолчанию являются синглтонами, т.е. создаются один раз и переиспользуются во всех местах, где они инжектируются.

Пример:
```typescript
@Injectable()
export class ArticleService {
  constructor(private readonly ArticleModel: Model<Article>) {}
}
```

#### Фабрика

```typescript
@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_ROOT_USER}:${process.env.MONGO_ROOT_PASSWORD}@mongodb:27017/yatl?authSource=admin`,
    ),
    AuthModule,
    ArticleModule,
    UserModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

В данном примере используется фабричный подход при настройке подключения к *MongoDB* с помощью *MongooseModule.forRoot*.

Метод *forRoot* в *MongooseModule* является фабричным методом, который возвращает предварительно настроенный провайдер для подключения к базе данных.

#### Репозиторий

Паттерн используется для абстрагирования работы с базой данных. Вместо прямого взаимодействия с моделью, данные обрабатываются через слой репозитория:
```typescript
@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private ArticleModel: Model<Article>,
  ) {}

  async findArticlesByUser(userId: string) {
    return this.ArticleModel.find({ owner: userId }).exec();
  }
}
```

#### Декоратор

NestJS построен на паттерне **Декоратор**:
```typescript
@UseGuards(AuthGuard)
@Put('new')
async newArticle(@Body() article: ArticleRequestDto, @UserId() userId: string) {
  // ...
}
```

### Тестирование

На бэкэнде присутствуют юнит-тесты для модулей работы пользователями, аутентификацией и записями, а также интеграционные тесты.

С помощью GitHub Actions настроено автоматическое тестирование при попадании изменений в **master**.

Охват покрытия тестами на бэкэнде - 68%.

## Запуск проекта в DEV-режиме

В dev-режиме фронтенд запускается отдельно от других сервисов. Для того, чтобы запустить фронтенд необходимо прописать следующее в директории фронтенда:

```bash
npm run dev
```

Для того, чтобы запустить бэкэнд, базу данных и панель управления базой данных, необходимо установить Docker Desktop (Windows, MacOS) или Docker+DockerCompose (Linux), а затем в директории проекта прописать следующую команду:

```bash
docker-compose up --build
```

Такое разделение во многом обусловлено тем, что фронтенд является более обособленным сервисом от всего остального (он, как минимум, не упадет, если запустится без бэкэнда или базы данных), а также из-за проблемы [WSL2-ограничений в Vite](https://vite.dev/config/server-options.html#server-watch) с watch-режимом.

Запросы на сервер можно делать по такому адресу (этот выведет Hello World):
```
localhost/api/test
```

Также запускается автодокументация (swagger) по пути:
```
localhost/api/docs
```

Панель управления базой данных по этому адресу:
```
localhost:8888/
```

Логин и пароль задаются переменными окружения. Перед запуском в корне проекта создайте .env файл (пример лежит в example.env):

|Переменная|Пример|Значение|
|----------|------|--------|
|MONGO_ROOT_USER|admin|Логин суперпользователя от БД|
|MONGO_ROOT_PASSWORD|admin|Пароль суперпользователя от БД|
|MONGOEXPRESS_LOGIN|admin|Логин от панели управления БД|
|MONGOEXPRESS_PASSWORD|admin|Пароль от панели управления БД|
|JWT_SECRET|TestSecretKey|Ключ для подписи JWT-токена|

Или можно задать переменные окружения вручную.

## Запуск проекта в PROD-режиме