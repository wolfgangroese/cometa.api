export const environment = {
  production: false,
  captcha: {
    key: '6Lf-AkIdAAAAAEIr-TKvo3KayGf4qTqwmsOuxMLH',
  },
  api: {
    baseUrl: 'http://localhost:5092/api',
  },
  web: {
    baseUrl: 'http://localhost:4200',
  },
  cometa: {
    url: 'http://localhost:4200',
  },
  validation: {
    password: '(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,256}',
    email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,6}$',
  },
  config: {
    swagger: 'http://localhost:5092/swagger/v1/swagger.json',
  },
  locale: {
    default: 'en',
    locales: {
      de: 'Deutsch',
      en: 'English',
      fr: 'Français',
      pt: 'Português',
      ru: 'Русский',
      ua: 'Українська',
    },
  },
};
