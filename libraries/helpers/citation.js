import moment from 'moment'

const citation = (document) => {
  moment.locale()
  const url = ''

  let result = {
    'acm': `${document?.author}. ${document?.year}. ${document?.title}. ${document?.publisher}.`,
    'acs': `${document?.author}. ${document?.title}. ${document?.publisher}. ${document?.year}.`,
    'apa': `${document?.author}. (${document?.year}). ${document?.title}. ${document?.publisher}.`,
    'chicago': `${document?.author}. ${document?.year}. "${document?.title}". ${document?.publisher}.`,
    'harvard': `${document?.author}. (${document?.year}). "${document?.title}". ${document?.publisher}.`,
    'ieee': `${document?.author}. "${document?.title}". ${document?.publisher}, ${document?.year}.`,
    'vancounver': `${document?.author}. ${document?.title}. ${document?.publisher}. ${document?.year} [cited ${moment().format('YYYY')} ${moment().format('MMMM')} ${moment().format('DD')}];. Available from: ${url}`
  }
  
  return result
}

export default citation