import moment from 'moment';

export function displayDate(value: any) {
  try {
    if (value.seconds === undefined) {
      return '';
    }
    const dateFormat = 'YYYY/MM/DD';
    const now = moment();
    const date = moment.unix(value.seconds);
    if (date.format(dateFormat) === now.format(dateFormat)) {
      return date.format('HH:mm');
    }

    if (date.format(dateFormat) === now.add(-1, 'days').format(dateFormat)) {
      return `昨日 ${date.format('HH:mm')}`;
    }
    return date.format(dateFormat);
  } catch (err) {
    return 'Unknown';
  }
}

export function localDate(value: any) {
  try {
    if (!(value instanceof Date)) {
      value = value.toDate();
    }
    return value.toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo'
    });
  } catch (err) {
    return '';
  }
}
