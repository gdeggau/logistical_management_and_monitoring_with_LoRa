import { parseISO, format } from 'date-fns';

export default function dateFormated(date) {
  if (date !== '') {
    const dateIso = parseISO(date);
    return format(dateIso, 'dd/MM/yyyy HH:mm:ss');
  }
  return '';
}
