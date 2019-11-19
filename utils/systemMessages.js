
//FaceBook messages ----------------------

//Email already exist

export const FACEBOOK_EMAIL_EXIST = {
  title: 'Внимание',
  message: 'Пользотвалеь с таким Email уже существует, пожалуйста авторизируйтесь',
  buttonText: 'Хорошо'
};

//FaceBook messages END ------------------

//Twitter messages -----------------------

export const TWITTER_LOGIN_ERROR = {
  title: 'Внимание',
  message: 'Авторизация через Twitter была отменена',
  buttonText: 'Хорошо'
};


//Twitter message END --------------------




//Registration with Email and Password

export const EMAIL_CONFIRMATION = {
  title: `Подтверждение электорнной почты`,
  message: `Мы отправили Вам ссылку для подтверждения электронной почты на ардес {email}. Пожалуйста, подтвердите Вашу электронную почту.`,
  resendButtonText: 'Отправить еще раз',
  buttonText: 'Я проверю'
};

//Login with Email and Password

export const ACCOUNT_NOT_FOUND = {
  title: 'Поиск аккаунта',
  message: `Мы не нашли пользователя с таким электронным адресом или паролем. Пожалуйста, проверьте правописание и попробуйте снова или зарегистрируйтесь как новый пользователь.`,
  buttonText: 'Хорошо'
};

export const LOGIN_FAILED ={
  title: 'Ошибка авторизации',
  message: `Вы ввели неверный пароль или у пользователя еще нет пароля.`,
  buttonText: 'Хорошо'
};

//Recovery password

export const SUBMIT_RECOVERY_PASS = {
  title: 'Вам было отправлено письмо на почту',
  message: `Для восстановления аккаунта перейтиде по ссылке в письме`,
  buttonText: 'Я проверю'
};

export const RECOVERY_PASS_NO_USER = {
  title: 'Странно...',
  message: `Такого пользователь нет в системе или он был удален. Попробуйде ввести другой email`,
  buttonText: 'Я проверю'
}

//Internet notification

export const INTERNET_CONNECTION ={
  exist: 'Соединение восстановленно',
  lost: 'Потерялся интернет...'
};


//Social Network linked

export const SOCIAL_NETWORK_SUCCESS_LINKED = {
  title: 'Подключение аккаунта',
  message: 'Вы успешно подключили социальную сеть к основному аккаунту',
  buttonText: 'Понятно'
};

export const SOCIAL_NETWORK_ALREADY_LINKED = {
  title: 'Подключение аккаунта',
  message: 'Эта социальна сеть уже подключена к основному аккаунту',
  buttonText: 'Понятно'
};
