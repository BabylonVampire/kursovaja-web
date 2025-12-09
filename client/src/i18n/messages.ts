import { ELocales } from './locales';

export const messages = {
  [ELocales.RUSSIAN]: {
    // Global
    GLOBAL_APPLICATION_NAME: 'СПНСР',
    // Authorization
    AUTHORIZATION_LOGIN: 'Войти',
    AUTHORIZATION_LOGOUT: 'Выйти',
    // Themes
    THEMES_DARK: 'Тёмная',
    THEMES_LIGHT: 'Светлая',
    THEMES_SYSTEM: 'Системная',
    THEMES_MESSAGE: 'Сменить тему',
    // Languages
    LANGUAGES_MESSAGE: 'Сменить язык',
    // Pages
    PAGE_MAIN: 'Главная',
    PAGE_GLOBAL_SITUATION: 'Глобальная обстановка',
    PAGE_MAP: 'Карта',
    // Auth Form fields
    AUTH_FORM_PASSWORD: 'Пароль',
    AUTH_FORM_EMAIL: 'Email',
    AUTH_FORM_NAME: 'Имя',
    AUTH_FORM_SURNAME: 'Фамилия',
    AUTH_FORM_FATHER_NAME: 'Отчество',
    AUTH_FORM_PASSWORD_RULE: 'Длина пароля должна быть по крайней мере',
    AUTH_FORM_EMAIL_INVALID: 'Введите корректный email',
    AUTH_FORM_TITLE: 'Войти',
    AUTH_FORM_ERROR_MESSAGE: 'Не удалось авторизоваться, попробуйте позже',
    AUTH_FORM_LOADING: 'Пожалуйста, подождите...',
    AUTH_FORM_EMAIL_PLACEHOLDER: 'exempl@some.ru',
    AUTH_FORM_NAME_PLACEHOLDER: 'Иван',
    AUTH_FORM_SURNAME_PLACEHOLDER: 'Иванов',
    AUTH_FORM_FATHER_NAME_PLACEHOLDER: 'Иванович',
    AUTH_FORM_PASSWORD_PLACEHOLDER: 'Длина пароля должна быть по крайней мере 8 символов',
    // Widgets
    WIDGET_MAP_TITLE: 'Карта',
    // Global situation widget form
    WIDGET_GLOBAL_SITUATION_FORM_TITLE: 'Подключится к комнате',
    WIDGET_GLOBAL_SITUATION_FORM_PASSWORD: 'Пароль',
    WIDGET_GLOBAL_SITUATION_FORM_ROOM: 'Комната',
    WIDGET_GLOBAL_SITUATION_FORM_PASSWORD_RULE: 'Длина пароля должна быть по крайней мере',
    WIDGET_GLOBAL_SITUATION_FORM_SUBMIT_TEXT: 'Подключится',
    WIDGET_GLOBAL_SITUATION_FORM_WRONG_PASSWORD_ERROR: 'Неверные данные для входа',
    WIDGET_GLOBAL_SITUATION_FORM_CONNECTION_TO_ROOM_ERROR:
      'При подключении к комнате возникла ошибка',
    // Map layers types
    MAP_LAYERS_TYPES_DEFAULT: 'Базовый слой',
    // Map content layers types
    MAP_CONTENT_LAYERS_TYPES_LBS: 'Слой ЛБС',
    // Map search marker modal
    MAP_SEARCH_MARKER_MODAL_TOOLTIP: 'Поиск по маркерам',
    MAP_SEARCH_MARKER_MODAL_TITLE: 'Поиск маркера',
    MAP_SEARCH_MARKER_MODAL_INPUT_PLACEHOLDER: 'Поиск маркера',
    // Map coordinates window
    MAP_COORDINATES_WINDOW_TITLE: 'Координаты',
    MAP_COORDINATES_WINDOW_LAT_LNG_LABEL: 'Широта/Долгота',
    MAP_COORDINATES_WINDOW_ALL_DATA_LABEL: 'Все данные',
    MAP_COORDINATES_WINDOW_XYZ_LABEL: 'X/Y/H',
    MAP_COORDINATES_WINDOW_SK_42_LABEL: 'СК-42',
    MAP_COORDINATES_WINDOW_FOOTER_TEXT:
      '* нажмите на координату для копирования одного значения. Если хотите скопировать все данные, нажмите на кнопку копирования',
    MAP_COORDINATES_WINDOW_LAT: 'Широта',
    MAP_COORDINATES_WINDOW_LNG: 'Долгота',
    MAP_COORDINATES_WINDOW_AZIMUTH: 'Азимут',
    MAP_COORDINATES_WINDOW_X: 'X',
    MAP_COORDINATES_WINDOW_Y: 'Y',
    MAP_COORDINATES_WINDOW_Z: 'Z',
    MAP_COORDINATES_WINDOW_H: 'H',
    // Alert message
    ALERT_MESSAGE_SUCCESSFUL_COPYING: 'Текст был скопирован!',
    // Search by coordinates modal
    SEARCH_BY_COORDINATES_MODAL_TOOLTIP: 'Поиск по координатам',
    SEARCH_BY_COORDINATES_MODAL_INCORRECT_FORMAT_ALERT: 'Введенные данные должны быть числами!',
    SEARCH_BY_COORDINATES_MODAL_ERROR_ALERT_TITLE: 'Что-то пошло не так',
    SEARCH_BY_COORDINATES_MODAL_ERROR_ALERT_DESCRIPTION: 'Проверьте правильность введенных данных.',
    SEARCH_BY_COORDINATES_MODAL_SELECT_PLACEHOLDER: 'Выберите СК',
    SEARCH_BY_COORDINATES_MODAL_INPUT_X_PLACEHOLDER: 'X/Широта',
    SEARCH_BY_COORDINATES_MODAL_INPUT_Y_PLACEHOLDER: 'Y/Долгота',
  },
  [ELocales.CHINESE]: {
    // Global
    GLOBAL_APPLICATION_NAME: '网络风暴',
    // Authorization
    AUTHORIZATION_LOGIN: '登录',
    AUTHORIZATION_LOGOUT: '退出',
    // Themes
    THEMES_DARK: '深色',
    THEMES_LIGHT: '浅色',
    THEMES_SYSTEM: '系统',
    THEMES_MESSAGE: '切换主题',
    // Languages
    LANGUAGES_MESSAGE: '切换语言',
    // Pages
    PAGE_MAIN: '主页',
    PAGE_GLOBAL_SITUATION: '全球态势',
    PAGE_MAP: '地图',
    // Auth Form fields
    AUTH_FORM_PASSWORD: '密码',
    AUTH_FORM_EMAIL: '电子邮件',
    AUTH_FORM_NAME: 'Имя',
    AUTH_FORM_SURNAME: 'Фамилия',
    AUTH_FORM_FATHER_NAME: 'Отчество',
    AUTH_FORM_PASSWORD_RULE: '密码长度至少为',
    AUTH_FORM_EMAIL_INVALID: '请输入有效的电子邮件',
    AUTH_FORM_TITLE: '登录',
    AUTH_FORM_ERROR_MESSAGE: '登录失败，请稍后再试',
    AUTH_FORM_LOADING: '请稍候...',
    AUTH_FORM_EMAIL_PLACEHOLDER: '示例: exempl@some.ru',
    AUTH_FORM_NAME_PLACEHOLDER: 'Иван',
    AUTH_FORM_SURNAME_PLACEHOLDER: 'Иванов',
    AUTH_FORM_FATHER_NAME_PLACEHOLDER: 'Иванович',
    AUTH_FORM_PASSWORD_PLACEHOLDER: '密码长度至少为 8 个字符',
    // Widgets
    WIDGET_MAP_TITLE: '地图',
    // Global situation widget form
    WIDGET_GLOBAL_SITUATION_FORM_TITLE: '加入房间',
    WIDGET_GLOBAL_SITUATION_FORM_PASSWORD: '密码',
    WIDGET_GLOBAL_SITUATION_FORM_ROOM: '房间',
    WIDGET_GLOBAL_SITUATION_FORM_PASSWORD_RULE: '密码长度至少为',
    WIDGET_GLOBAL_SITUATION_FORM_SUBMIT_TEXT: '加入',
    WIDGET_GLOBAL_SITUATION_FORM_WRONG_PASSWORD_ERROR: '不正确的输入数据',
    WIDGET_GLOBAL_SITUATION_FORM_CONNECTION_TO_ROOM_ERROR: '连接到房间时，出现了错误',
    //Map layers types
    MAP_LAYERS_TYPES_DEFAULT: '基础层',
    // Map content layers types
    MAP_CONTENT_LAYERS_TYPES_LBS: '图层 LBS',
    // Map search marker modal
    MAP_SEARCH_MARKER_MODAL_TITLE: '搜索标记',
    MAP_SEARCH_MARKER_MODAL_INPUT_PLACEHOLDER: '搜索标记',
    MAP_SEARCH_MARKER_MODAL_TOOLTIP: '标记搜索',
    // Map coordinates window
    MAP_COORDINATES_WINDOW_TITLE: '坐标',
    MAP_COORDINATES_WINDOW_LAT_LNG_LABEL: '纬度/经度',
    MAP_COORDINATES_WINDOW_ALL_DATA_LABEL: '所有数据',
    MAP_COORDINATES_WINDOW_XYZ_LABEL: 'X/Y/H',
    MAP_COORDINATES_WINDOW_SK_42_LABEL: 'SK-42',
    MAP_COORDINATES_WINDOW_FOOTER_TEXT: '* 点击坐标可复制单个值。如需复制所有数据，请点击复制按钮',
    MAP_COORDINATES_WINDOW_LAT: '纬度',
    MAP_COORDINATES_WINDOW_LNG: '经度',
    MAP_COORDINATES_WINDOW_AZIMUTH: '方位角',
    MAP_COORDINATES_WINDOW_X: 'X',
    MAP_COORDINATES_WINDOW_Y: 'Y',
    MAP_COORDINATES_WINDOW_Z: 'Z',
    MAP_COORDINATES_WINDOW_H: 'H',
    // Alert message
    ALERT_MESSAGE_SUCCESSFUL_COPYING: '文本已复制！',
    // Search by coordinates modal
    SEARCH_BY_COORDINATES_MODAL_TOOLTIP: '坐标搜索',
    SEARCH_BY_COORDINATES_MODAL_INCORRECT_FORMAT_ALERT: '输入的数据必须是数字！',
    SEARCH_BY_COORDINATES_MODAL_ERROR_ALERT_TITLE: '出现错误',
    SEARCH_BY_COORDINATES_MODAL_ERROR_ALERT_DESCRIPTION: '请检查输入的数据是否正确。',
    SEARCH_BY_COORDINATES_MODAL_SELECT_PLACEHOLDER: '选择坐标系',
    SEARCH_BY_COORDINATES_MODAL_INPUT_X_PLACEHOLDER: 'X/纬度',
    SEARCH_BY_COORDINATES_MODAL_INPUT_Y_PLACEHOLDER: 'Y/经度',
  },
};
