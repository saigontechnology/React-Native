/**
 * Created by NL on 07/06/2022.
 */
import {getWithTimeout} from './networking';

const url = 'https://postman-echo.com/get';

export const getMessageTypes = () => {
  return getWithTimeout(`${url}`);
};

export const getLessons = () => {
  return getWithTimeout(`https://learn-by-api.glitch.me/intro`);
};
