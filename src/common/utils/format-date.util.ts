import * as dayjs from 'dayjs';
import { DateFormat } from '@common/enums/date-format.enum';

export const formatDate = (date: Date | string, pattern: DateFormat) => {
  return dayjs(date).format(pattern);
};
